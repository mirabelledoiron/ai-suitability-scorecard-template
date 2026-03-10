import { CRITERIA, RESULTS } from '../data';
import { CATEGORY_COLORS } from '../categoryColors';
import type { CategoryKey } from '../types';

const CATEGORY_KEYS: CategoryKey[] = ['no-fit', 'automation', 'ai-assisted', 'ai-system'];

const SCORE_RANGES: Record<CategoryKey, string> = {
  'no-fit': '8–16',
  'automation': '17–24',
  'ai-assisted': '25–32',
  'ai-system': '33–40',
};

const QUADRANT_DESCRIPTIONS: Record<string, string> = {
  'Repeatability': 'AI investment only compounds when the task repeats. Volume is what makes the setup cost worthwhile.',
  'Legality & Risk': 'These questions act as gates. High consequence or sensitive data doesn\'t prevent AI — but it changes what tools you can use and how much oversight is required.',
  'Grounding': 'Agents are only as good as the context they\'re given. Structured inputs and existing documentation dramatically improve reliability.',
  'Human Loop': 'The most critical dimension. AI without a review step is a liability, not an asset — especially for client-facing work.',
};

export default function MethodologyView() {
  const quadrantOrder = Array.from(new Set(CRITERIA.map(c => c.group)));
  const byQuadrant = CRITERIA.reduce<Record<string, typeof CRITERIA>>((acc, c) => {
    if (!acc[c.group]) acc[c.group] = [];
    acc[c.group].push(c);
    return acc;
  }, {});

  return (
    <div className="main">
      <h1 className="page-title">How to Read Your Results</h1>
      <p className="page-desc">The four discovery quadrants, how scoring works, and what each result means.</p>

      <div className="methodology-section">
        <h2>The four discovery quadrants</h2>
        <p>
          Every workflow is evaluated across four strategic dimensions. Each quadrant contains two
          questions — together they answer whether AI is the right investment, right now, for this team.
        </p>
        <table className="methodology-table">
          <thead>
            <tr>
              <th>Quadrant</th>
              <th>Key question</th>
              <th>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            {quadrantOrder.map(name => (
              <tr key={name}>
                <td style={{ fontWeight: 700 }}>{name}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>
                  {name === 'Repeatability' && 'Is this a one-off or a high-volume task?'}
                  {name === 'Legality & Risk' && 'Does this involve PII or sensitive data? What are the stakes?'}
                  {name === 'Grounding' && 'Is there a source of truth — docs, examples, or a knowledge base?'}
                  {name === 'Human Loop' && 'Is a human available to sanity-check the output?'}
                </td>
                <td style={{ color: 'var(--color-text-muted)' }}>
                  {QUADRANT_DESCRIPTIONS[name]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="methodology-section">
        <h2>How scoring works</h2>
        <p>
          Each of the 8 questions is answered with one of three options, scored 1, 3, or 5 points.
          The maximum possible score is 40.
        </p>
        <p>
          Three questions are flagged as <strong>Risk factors</strong> — consequence severity, data
          sensitivity, and human review. If the consequence is serious AND there is no human review
          step, the result is automatically downgraded one level regardless of the total score.
          A separate warning surfaces if sensitive or regulated data is involved.
        </p>
      </div>

      <div className="methodology-section">
        <h2>Score thresholds</h2>
        <table className="methodology-table">
          <thead>
            <tr>
              <th>Score range</th>
              <th>Result</th>
              <th>Direction</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORY_KEYS.map(key => {
              const colors = CATEGORY_COLORS[key];
              const result = RESULTS[key];
              return (
                <tr key={key}>
                  <td style={{ fontWeight: 600 }}>{SCORE_RANGES[key]}</td>
                  <td>
                    <span
                      style={{
                        background: colors.bg,
                        color: colors.dark,
                        padding: '2px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'inline-block',
                      }}
                    >
                      {result.tag}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{result.title}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="methodology-section">
        <h2>The 8 questions</h2>
        {quadrantOrder.map(quadrantName => (
          <div key={quadrantName} style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-hint)',
                marginBottom: 10,
                paddingBottom: 8,
                borderBottom: '1px solid var(--color-border-light)',
              }}
            >
              {quadrantName}
            </div>
            <ul className="methodology-criteria-list">
              {byQuadrant[quadrantName].map(criterion => (
                <li key={criterion.id} className="methodology-criteria-item">
                  <span className="methodology-criteria-num">{criterion.id}</span>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{criterion.title}</div>
                    <div style={{ color: 'var(--color-text-subtle)', fontSize: '12px' }}>{criterion.sub}</div>
                    {criterion.risk && (
                      <span
                        className="risk-badge"
                        style={{ display: 'inline-block', marginTop: 6 }}
                      >
                        Risk factor
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="methodology-section">
        <h2>What each result means</h2>
        {CATEGORY_KEYS.map(key => {
          const colors = CATEGORY_COLORS[key];
          const result = RESULTS[key];
          return (
            <div
              key={key}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.color}33`,
                borderRadius: 12,
                padding: '18px 22px',
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: colors.dark,
                  marginBottom: 4,
                }}
              >
                {result.tag}
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 700,
                  color: colors.dark,
                  marginBottom: 8,
                }}
              >
                {result.title}
              </div>
              <div style={{ fontSize: 'var(--font-size-md)', color: colors.dark, lineHeight: 1.6 }}>
                {result.body}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
