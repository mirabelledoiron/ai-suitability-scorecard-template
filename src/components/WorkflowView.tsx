import type {
  Workflow,
  Answers,
  OptionScore,
  WorkflowContextEntry,
  Criterion,
  Result,
  CategoryKey,
  TenantThresholds,
} from '../types';
import { totalScore, getCategory } from '../logic';
import { getCategoryColors } from '../categoryColors';

interface WorkflowViewProps {
  workflow: Workflow;
  context: WorkflowContextEntry | undefined;
  answers: Answers;
  onAnswer: (wfId: number, criterionId: number, score: OptionScore) => void;
  criteria: Criterion[];
  results: Record<CategoryKey, Result>;
  thresholds: TenantThresholds;
}

export default function WorkflowView({
  workflow,
  context,
  answers,
  onAnswer,
  criteria,
  results,
  thresholds,
}: WorkflowViewProps) {
  const wfAnswers = answers[workflow.id] ?? {};
  const answeredCount = Object.keys(wfAnswers).length;
  const totalCriteria = criteria.length;
  const allAnswered = answeredCount === totalCriteria;
  const score = totalScore(workflow.id, answers);
  const maxScore = totalCriteria * 5;

  const { category, override } = allAnswered
    ? getCategory(score, wfAnswers as Record<number, 1 | 3 | 5>, thresholds)
    : { category: null, override: false };

  const colors = getCategoryColors(category);
  const result = category ? results[category] : null;

  const fillPercent = allAnswered ? Math.round((score / maxScore) * 100) : 0;

  // Data sensitivity warning: criterion 4 scoring 1 = sensitive/regulated data
  const hasSensitivityFlag = allAnswered && wfAnswers[4] === 1;

  // Group criteria by their quadrant, preserving order
  const quadrantOrder = Array.from(new Set(criteria.map(c => c.group)));
  const byQuadrant = criteria.reduce<Record<string, Criterion[]>>((acc, c) => {
    if (!acc[c.group]) acc[c.group] = [];
    acc[c.group].push(c);
    return acc;
  }, {});

  return (
    <div className="main">
      <h1 className="page-title">{workflow.title}</h1>
      <p className="page-desc">{workflow.desc}</p>

      {/* Score header */}
      <div className="score-header">
        <div className="score-big" style={{ color: allAnswered ? colors.color : 'var(--color-score-pending)' }}>
          {score}
          <span className="score-denom">/{maxScore}</span>
        </div>
        <div className="score-track">
          <div
            className="score-fill"
            style={{
              width: `${fillPercent}%`,
              background: allAnswered ? colors.color : 'var(--color-score-pending)',
            }}
          />
        </div>
        <div className="score-status">
          {answeredCount}/{totalCriteria} answered
        </div>
      </div>

      {/* Result card (only when all answered) */}
      {allAnswered && result && (
        <>
          <div
            className="result-card"
            style={{
              background: colors.bg,
              borderColor: colors.color + '33',
            }}
          >
            <div className="result-tag" style={{ color: colors.dark }}>
              {result.tag}
            </div>
            <div className="result-title" style={{ color: colors.dark }}>
              {result.title}
            </div>
            <div className="result-body" style={{ color: colors.dark }}>
              {result.body}
            </div>
            {override && (
              <div className="result-override" style={{ color: colors.dark }}>
                Risk override applied: no human review + serious consequences downgraded this result one level.
              </div>
            )}
          </div>

          {/* Sensitive data warning — surfaces regardless of overall score */}
          {hasSensitivityFlag && (
            <div className="sensitivity-warning">
              <span className="sensitivity-warning-icon">⚠</span>
              <div>
                <strong>Sensitive data detected.</strong> This workflow involves PII, regulated content, or confidential client data.
                Before deploying any AI here, confirm you are using an enterprise or closed model and have reviewed your data governance obligations.
              </div>
            </div>
          )}

          <div className="result-examples">
            <div className="result-examples-title">How this looks in practice</div>
            <div className="result-examples-row">
              <div>
                <div className="result-examples-col-label">Tools to consider</div>
                <div className="result-examples-tools">
                  {result.examples.tools.map(tool => (
                    <span key={tool} className="tool-chip">{tool}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="result-examples-col-label">Suggested flow</div>
                <div className="result-examples-flow">{result.examples.flow}</div>
              </div>
            </div>
            <div className="result-examples-note">{result.examples.note}</div>
          </div>
        </>
      )}

      {/* Workflow context intro */}
      {context && (
        <div className="context-intro">{context.intro}</div>
      )}

      {/* Criteria grouped by quadrant */}
      {quadrantOrder.map(quadrantName => (
        <div key={quadrantName} className="quadrant-section">
          <div className="quadrant-header">{quadrantName}</div>

          {byQuadrant[quadrantName].map(criterion => {
            const selected = wfAnswers[criterion.id];
            const hint = context?.hints[criterion.id];

            return (
              <div key={criterion.id} className="criteria-card">
                <div className="criteria-header">
                  <span className="criteria-num">{criterion.id}</span>
                  <span className="criteria-title">{criterion.title}</span>
                  {criterion.risk && (
                    <span className="risk-badge">Risk factor</span>
                  )}
                </div>

                <div className="criteria-sub">{criterion.sub}</div>

                {hint && (
                  <div className="context-hint">{hint}</div>
                )}

                <div className="opts-list">
                  {criterion.opts.map(opt => {
                    const isSelected = selected === opt.score;
                    return (
                      <label
                        key={opt.score}
                        className="opt-label"
                        style={
                          isSelected
                            ? {
                                background: colors.bg,
                                borderColor: colors.color,
                              }
                            : {}
                        }
                      >
                        <input
                          type="radio"
                          className="opt-radio"
                          name={`wf-${workflow.id}-q-${criterion.id}`}
                          checked={isSelected}
                          onChange={() => onAnswer(workflow.id, criterion.id, opt.score)}
                        />
                        {opt.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
