import type { Workflow, Answers, CurrentView, Criterion, Result, CategoryKey, TenantThresholds } from '../types';
import { totalScore, getCategory } from '../logic';
import { getCategoryColors, DEFAULT_COLORS } from '../categoryColors';

interface SummaryViewProps {
  workflows: Workflow[];
  answers: Answers;
  onSelect: (view: CurrentView) => void;
  onDownload: () => void;
  criteria: Criterion[];
  results: Record<CategoryKey, Result>;
  thresholds: TenantThresholds;
}

export default function SummaryView({
  workflows,
  answers,
  onSelect,
  onDownload,
  criteria,
  results,
  thresholds,
}: SummaryViewProps) {
  const totalCriteria = criteria.length;
  const completedCount = workflows.filter(
    wf => Object.keys(answers[wf.id] ?? {}).length === totalCriteria
  ).length;

  return (
    <div className="main">
      <div
        className="summary-header"
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}
      >
        <h1 className="page-title" style={{ marginBottom: 0 }}>Summary</h1>
        <button
          className="download-btn"
          onClick={onDownload}
          title="Export all scores as a CSV file"
        >
          Download Report
        </button>
      </div>
      <p className="page-desc">
        {completedCount} of {workflows.length} workflows scored. Click any row to review or update.
      </p>

      <div className="summary-grid">
        {workflows.map(wf => {
          const wfAnswers = answers[wf.id] ?? {};
          const answeredCount = Object.keys(wfAnswers).length;
          const allAnswered = answeredCount === totalCriteria;
          const score = totalScore(wf.id, answers);

          if (!allAnswered) {
            return (
              <div
                key={wf.id}
                className="summary-row"
                onClick={() => onSelect(wf.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect(wf.id); }}
              >
                <span className="summary-row-group">{wf.group}</span>
                <span className="summary-row-name">{wf.title}</span>
                <span className="summary-row-score" style={{ color: DEFAULT_COLORS.color }}>
                  {answeredCount > 0 ? score : '—'}
                </span>
                <span
                  className="summary-row-tag"
                  style={{
                    background: DEFAULT_COLORS.bg,
                    color: DEFAULT_COLORS.dark,
                  }}
                >
                  {answeredCount === 0 ? 'Not started' : `${answeredCount}/${totalCriteria} answered`}
                </span>
              </div>
            );
          }

          const { category, override } = getCategory(score, wfAnswers as Record<number, 1 | 3 | 5>, thresholds);
          const colors = getCategoryColors(category);
          const result = results[category];

          return (
            <div
              key={wf.id}
              className="summary-row"
              onClick={() => onSelect(wf.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect(wf.id); }}
            >
              <span className="summary-row-group">{wf.group}</span>
              <span className="summary-row-name">{wf.title}</span>
              <span className="summary-row-score" style={{ color: colors.color }}>
                {score}
              </span>
              <span
                className="summary-row-tag"
                style={{
                  background: colors.bg,
                  color: colors.dark,
                }}
              >
                {result.tag}
                {override ? ' *' : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
