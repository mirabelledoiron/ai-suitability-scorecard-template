import type { Criterion, Result, CategoryKey } from './types';

/**
 * 8 criteria organised into the four Discovery "Pre-Flight" quadrants:
 *   1. Repeatability   — Does scale justify the investment?
 *   2. Legality & Risk — Are there compliance or consequence gates?
 *   3. Grounding       — Does AI have enough context to work with?
 *   4. Human Loop      — Is oversight built into the process?
 */
export const CRITERIA: Criterion[] = [

  // ── Repeatability ──────────────────────────────────────────────────────────

  {
    id: 1,
    group: 'Repeatability',
    title: 'How often does this workflow actually happen?',
    risk: false,
    sub: 'AI investment only makes sense when the return compounds with frequency. A one-off task rarely justifies the setup cost.',
    opts: [
      { label: 'Constantly — multiple times a week, every week', score: 5 },
      { label: 'Regularly — a few times a week on average', score: 3 },
      { label: 'Occasionally — once a week or less, or triggered by rare events', score: 1 },
    ],
  },
  {
    id: 2,
    group: 'Repeatability',
    title: 'When this workflow is slow or painful, what\'s really causing it?',
    risk: false,
    sub: 'AI solves volume problems, not judgment problems. If the bottleneck is complexity or expertise, more automation won\'t help.',
    opts: [
      { label: 'Pure volume — there\'s simply too much of it and not enough time', score: 5 },
      { label: 'Both — volume is a problem and figuring out the right approach takes real effort', score: 3 },
      { label: 'Judgment — it requires expertise, institutional knowledge, or knowing the client personally', score: 1 },
    ],
  },

  // ── Legality & Risk ────────────────────────────────────────────────────────

  {
    id: 3,
    group: 'Legality & Risk',
    title: 'What happens to the business if this output is wrong?',
    risk: true,
    sub: 'The higher the consequence, the more a human needs to own the outcome — not a tool. This is one of the two most important questions in the framework.',
    opts: [
      { label: 'Low stakes — internal, easy to correct, and no one outside the team is affected', score: 5 },
      { label: 'Moderate — awkward or costly, but recoverable with effort', score: 3 },
      { label: 'Serious — it could damage a client relationship, trigger a legal issue, or cause lasting reputational harm', score: 1 },
    ],
  },
  {
    id: 4,
    group: 'Legality & Risk',
    title: 'Does this workflow involve sensitive, personal, or regulated data?',
    risk: true,
    sub: 'PII, client data, and regulated information require enterprise or closed AI models. This is a compliance gate — not just a risk consideration.',
    opts: [
      { label: 'No — fully internal, non-sensitive data with no compliance obligations', score: 5 },
      { label: 'Somewhat — confidential business content, but not personally identifiable or regulated', score: 3 },
      { label: 'Yes — PII, client data, financial records, health information, or any regulated content', score: 1 },
    ],
  },

  // ── Grounding ──────────────────────────────────────────────────────────────

  {
    id: 5,
    group: 'Grounding',
    title: 'Does your team have a documented source of truth to reference?',
    risk: false,
    sub: 'AI is only as good as the context it\'s given. Without existing documentation, examples, or a knowledge base, there\'s nothing for it to build on.',
    opts: [
      { label: 'Yes — past examples, templates, and documentation exist and are accessible', score: 5 },
      { label: 'Partially — there\'s some material but it\'s incomplete, scattered, or out of date', score: 3 },
      { label: 'No — every instance starts from a blank page with no reference material', score: 1 },
    ],
  },
  {
    id: 6,
    group: 'Grounding',
    title: 'How consistent is the input each time this workflow runs?',
    risk: false,
    sub: 'Consistent inputs produce consistent outputs. Variable inputs — emails, call notes, freeform requests — require more human judgment to process and are harder for AI to handle reliably.',
    opts: [
      { label: 'Always consistent — a standard form, template, or system-generated format', score: 5 },
      { label: 'Roughly similar — a recognisable pattern, but it varies case by case', score: 3 },
      { label: 'Different every time — freeform emails, call notes, or unstructured requests', score: 1 },
    ],
  },

  // ── Human Loop ─────────────────────────────────────────────────────────────

  {
    id: 7,
    group: 'Human Loop',
    title: 'Is a human available to review the output before it\'s used?',
    risk: true,
    sub: 'This is the most critical safety question. If AI output goes directly to clients or into live systems without a review step, mistakes become your problem immediately.',
    opts: [
      { label: 'Always — a human reviews and approves before it reaches a client or live system', score: 5 },
      { label: 'Sometimes — it depends on the situation, the team member, or the urgency', score: 3 },
      { label: 'No — it goes directly to the client, system, or audience without any review step', score: 1 },
    ],
  },
  {
    id: 8,
    group: 'Human Loop',
    title: 'How would you know if the output was wrong?',
    risk: false,
    sub: 'If there\'s no clear way to verify the result, errors pass through unnoticed. Objective outputs are far easier to quality-check than judgment calls.',
    opts: [
      { label: 'Easy — there\'s a clear right answer, a metric, or a defined standard to check against', score: 5 },
      { label: 'Requires expertise — only someone with domain knowledge can reliably evaluate quality', score: 3 },
      { label: 'Judgment call — reasonable, experienced people could genuinely disagree on whether it\'s good', score: 1 },
    ],
  },
];

export const RESULTS: Record<CategoryKey, Result> = {
  'no-fit': {
    tag: 'Not Ready',
    title: 'Fix the process before adding AI',
    body: 'The fundamentals aren\'t in place for AI to add value here — whether it\'s frequency, data quality, or missing oversight. Adding AI to a broken process makes the process faster and more broken. The real investment is in redesigning the workflow first, then revisiting whether tooling helps.',
    examples: {
      tools: ['Notion', 'Asana', 'Miro', 'Loom'],
      flow: 'Map the current workflow → identify where the real friction is → redesign the process → then revisit whether any tooling helps',
      note: 'Example: Leadership coaching is slow because participants arrive underprepared — the fix is a better pre-session briefing package, not an AI tool.',
    },
  },
  'automation': {
    tag: 'Start Simpler',
    title: 'Traditional automation before AI',
    body: 'This workflow has some structure, but AI adds unnecessary complexity over simpler solutions. Zapier, Make, or platform-native automation will be cheaper, more predictable, and easier to govern. Prove the value of automation before evaluating AI.',
    examples: {
      tools: ['Zapier', 'Make', 'HubSpot Workflows', 'Google Apps Script'],
      flow: 'Define the trigger event → map the action steps → build and test → monitor for errors',
      note: 'Example: New client intake form submitted → auto-create CRM contact → send welcome email → notify account manager in Slack.',
    },
  },
  'ai-assisted': {
    tag: 'AI Can Help',
    title: 'AI supports — but a human must stay in charge',
    body: 'A strong candidate for AI assistance in drafting, summarizing, classifying, or researching. The human stays in the loop and makes every final decision. AI reduces effort, not accountability. Start with a copilot approach before considering anything more automated.',
    examples: {
      tools: ['Claude', 'ChatGPT', 'Perplexity', 'Notion AI', 'Otter.ai'],
      flow: 'Human defines the task → AI generates a first draft → Human reviews, edits, and refines → Human approves and delivers',
      note: 'Example: A team member briefs the AI on the audience, goal, and constraints → AI drafts a first version → a human edits for accuracy and tone → a human sends or publishes it.',
    },
  },
  'ai-system': {
    tag: 'Invest in AI',
    title: 'There\'s a compelling case for a purpose-built AI workflow',
    body: 'High frequency, structured inputs, verifiable outputs, and manageable risk make this worth investing in properly — not just a copilot. Define your success metrics and governance plan before you build. The returns here will compound.',
    examples: {
      tools: ['Claude API', 'n8n', 'Make + AI', 'Relevance AI'],
      flow: 'Structured input received → AI processes and generates output → automated quality check → human approval gate → delivery',
      note: 'Example: SEO brief submitted → AI generates full article draft with keyword optimization → editor reviews for accuracy and voice → approved draft published to CMS.',
    },
  },
};
