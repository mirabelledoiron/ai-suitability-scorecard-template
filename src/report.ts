import type { Workflow, Answers, Criterion, Result, CategoryKey, TenantThresholds } from './types';
import { totalScore, getCategory } from './logic';

function csvEscape(value: string | number): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function downloadCSV(
  workflows: Workflow[],
  answers: Answers,
  criteria: Criterion[],
  results: Record<CategoryKey, Result>,
  orgName?: string,
  thresholds?: TenantThresholds,
): void {
  const date = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  const maxScore = criteria.length * 5;

  const headers = [
    'Date',
    'Group',
    'Workflow',
    'Score',
    'Out of',
    'Category',
    'Risk Override',
    ...criteria.map(c => `Q${c.id}: ${c.title}`),
  ];

  const rows = workflows.map(wf => {
    const wfAnswers = answers[wf.id] ?? {};
    const answered = Object.keys(wfAnswers).length;
    const score = totalScore(wf.id, answers);

    if (answered < criteria.length) {
      return [
        date,
        wf.group,
        wf.title,
        score > 0 ? score : '',
        maxScore,
        'Incomplete',
        '',
        ...criteria.map(c => wfAnswers[c.id] ?? ''),
      ];
    }

    const { category, override } = getCategory(score, wfAnswers as Record<number, 1 | 3 | 5>, thresholds);
    const result = results[category];

    return [
      date,
      wf.group,
      wf.title,
      score,
      maxScore,
      result.tag,
      override ? 'Yes' : 'No',
      ...criteria.map(c => wfAnswers[c.id] ?? ''),
    ];
  });

  const csv = [headers, ...rows]
    .map(row => row.map(cell => csvEscape(cell as string | number)).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  const orgSlug = orgName
    ? `-${orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
    : '';
  link.download = `ai-scorecard${orgSlug}-${date}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
