import type { CategoryKey } from './types';

interface CategoryColors {
  color: string;
  bg: string;
  dark: string;
  label: string;
}

export const CATEGORY_COLORS: Record<CategoryKey, CategoryColors> = {
  'no-fit': {
    color: 'var(--color-no-fit)',
    bg: 'var(--color-no-fit-bg)',
    dark: 'var(--color-no-fit-dark)',
    label: 'No AI Fit',
  },
  'automation': {
    color: 'var(--color-automation)',
    bg: 'var(--color-automation-bg)',
    dark: 'var(--color-automation-dark)',
    label: 'Automation',
  },
  'ai-assisted': {
    color: 'var(--color-ai-assisted)',
    bg: 'var(--color-ai-assisted-bg)',
    dark: 'var(--color-ai-assisted-dark)',
    label: 'AI-Assisted',
  },
  'ai-system': {
    color: 'var(--color-ai-system)',
    bg: 'var(--color-ai-system-bg)',
    dark: 'var(--color-ai-system-dark)',
    label: 'AI System',
  },
};

export const DEFAULT_COLORS: CategoryColors = {
  color: 'var(--color-default)',
  bg: 'var(--color-default-bg)',
  dark: 'var(--color-default-dark)',
  label: 'Not scored',
};

export function getCategoryColors(category: CategoryKey | null): CategoryColors {
  if (!category) return DEFAULT_COLORS;
  return CATEGORY_COLORS[category];
}
