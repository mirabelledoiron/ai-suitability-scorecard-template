import type { Answers, CategoryKey, CategoryResult, TenantThresholds } from './types';

export const DEFAULT_THRESHOLDS: TenantThresholds = {
  noFit: 16,
  automation: 24,
  aiAssisted: 32,
};

export function totalScore(wfId: number, answers: Answers): number {
  const wfAnswers = answers[wfId];
  if (!wfAnswers) return 0;
  return Object.values(wfAnswers).reduce((sum, score) => sum + score, 0);
}

export function getCategory(
  score: number,
  wfAnswers: Record<number, 1 | 3 | 5> | undefined,
  thresholds?: TenantThresholds,
): CategoryResult {
  const t = thresholds ?? DEFAULT_THRESHOLDS;
  let category: CategoryKey;

  if (score <= t.noFit) {
    category = 'no-fit';
  } else if (score <= t.automation) {
    category = 'automation';
  } else if (score <= t.aiAssisted) {
    category = 'ai-assisted';
  } else {
    category = 'ai-system';
  }

  // Risk override: if Human Loop (Q7) = no review AND Legality/Risk (Q3) = serious stakes,
  // downgrade one category regardless of total score.
  const override =
    wfAnswers !== undefined &&
    wfAnswers[7] === 1 &&
    wfAnswers[3] === 1;

  if (override) {
    if (category === 'ai-system') {
      category = 'ai-assisted';
    } else if (category === 'ai-assisted') {
      category = 'automation';
    } else if (category === 'automation') {
      category = 'no-fit';
    }
  }

  return { category, override };
}

export const CATEGORY_ORDER: CategoryKey[] = ['no-fit', 'automation', 'ai-assisted', 'ai-system'];
