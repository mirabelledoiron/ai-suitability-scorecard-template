export type OptionScore = 1 | 3 | 5;

export type CategoryKey = 'no-fit' | 'automation' | 'ai-assisted' | 'ai-system';

export type CurrentView = number | 'summary' | 'methodology' | 'home';

export interface WorkflowOption {
  label: string;
  score: OptionScore;
}

export interface Criterion {
  id: number;
  /** Discovery quadrant this criterion belongs to */
  group: string;
  title: string;
  risk: boolean;
  sub: string;
  opts: WorkflowOption[];
}

export interface Workflow {
  id: number;
  group: string;
  title: string;
  desc: string;
}

// --- Tenant theming ---

export interface TenantTheme {
  /** Primary brand color — used for CTA buttons, radio accents, active highlights */
  primaryColor?: string;
  /** Secondary/accent color — reserved for future highlight use */
  accentColor?: string;
  /** Page background (overrides --color-bg) */
  bgColor?: string;
  /** Primary text color (overrides --color-text) */
  textColor?: string;
  /** Sidebar background (overrides --color-sidebar-bg) */
  sidebarBg?: string;
  /** Sidebar muted text (overrides --color-sidebar-text) */
  sidebarText?: string;
  /** Custom font stack (overrides --font-family) */
  fontFamily?: string;
}

// --- Tenant content overrides ---

export interface TenantContent {
  /** Override the main homepage heading (defaults to productName) */
  heroTitle?: string;
  /** Override the "What is this scoring for?" subheading */
  heroSubtitle?: string;
  /** Override the body paragraph(s). Each entry becomes a <p>. */
  heroBody?: string[];
  /** Override the bullet-point list */
  heroBullets?: Array<{ label: string; text: string }>;
  /** Override the CTA button label (default: "Open Scorecard →") */
  heroCta?: string;
  /** Override the note box below the bullet list */
  heroNote?: string;
  /** Appended to result cards: "Contact {org} to discuss these results." */
  contactCta?: string;
}

// --- Per-criterion & per-category overrides ---

export interface CriterionOverride {
  /** Override the question title */
  title?: string;
  /** Override the sub-text explanation */
  sub?: string;
}

export interface CategoryOverride {
  /** Override the short tag label (e.g. "No AI Fit") */
  tag?: string;
  /** Override the recommendation headline */
  title?: string;
  /** Override the explanation body */
  body?: string;
}

// --- Scoring thresholds ---

export interface TenantThresholds {
  /** Max (inclusive) score for "no-fit" category (default: 16) */
  noFit: number;
  /** Max (inclusive) score for "automation" category (default: 24) */
  automation: number;
  /** Max (inclusive) score for "ai-assisted" category (default: 32) */
  aiAssisted: number;
}

// --- Top-level branding config ---

export interface TenantBranding {
  /** Product name shown in the page title and homepage heading */
  productName?: string;
  /** Agency/organization name shown as a small label above the heading */
  organizationName?: string;
  /** URL to the tenant's logo image (shown in sidebar header and homepage) */
  logoUrl?: string;
  /** URL to a custom favicon */
  faviconUrl?: string;
  /** Brand color theme */
  theme?: TenantTheme;
  /** Homepage copy overrides */
  content?: TenantContent;
  /** Per-criterion text overrides (key = criterion id 1–8) */
  criteriaOverrides?: Record<number, CriterionOverride>;
  /** Per-category text overrides */
  categoryOverrides?: Partial<Record<CategoryKey, CategoryOverride>>;
  /** Custom scoring thresholds */
  thresholds?: TenantThresholds;
}

// --- JSON config files ---

export interface WorkflowsJson {
  workflows: Workflow[];
  context: Record<string, WorkflowContextEntry>;
}

export interface TenantJson extends WorkflowsJson {
  branding?: TenantBranding;
}

export interface WorkflowContextEntry {
  intro: string;
  hints: Record<number, string>;
}

export interface ResultExamples {
  tools: string[];
  flow: string;
  note: string;
}

export interface Result {
  tag: string;
  title: string;
  body: string;
  examples: ResultExamples;
}

export type Answers = Record<number, Record<number, OptionScore>>;

export interface CategoryResult {
  category: CategoryKey;
  override: boolean;
}
