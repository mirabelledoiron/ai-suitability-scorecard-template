import type { TenantBranding } from '../types';

const DEFAULT_SUBTITLE = 'What is this for?';

const DEFAULT_BODY = [
  'This scorecard evaluates whether AI is actually the right solution for a workflow — helping teams decide when a task is a strong candidate for automation or AI assistance, and when it should remain human-led.',
  'By scoring workflows across common suitability factors, the scorecard ensures that:',
];

const DEFAULT_BULLETS: Array<{ label: string; text: string }> = [
  { label: 'Strategic Judgment', text: 'remains prioritized for relationship-heavy work.' },
  { label: 'Efficiency', text: 'is gained only where the risk to client reputation is low.' },
  {
    label: 'Quality Standards',
    text: 'are maintained through rigorous suitability factors like measurability and human review.',
  },
];

const DEFAULT_NOTE =
  'Customize the workflow list and context text to match your organization, ' +
  'then use this scorecard in discovery sessions, internal audits, or client-facing workshops.';

const DEFAULT_CTA = 'Open Scorecard →';

interface HomePageProps {
  branding?: TenantBranding;
  onEnter: () => void;
}

export default function HomePage({ branding, onEnter }: HomePageProps) {
  const productName = branding?.productName ?? 'AI Suitability Scorecard';
  const orgName = branding?.organizationName;
  const logoUrl = branding?.logoUrl;
  const content = branding?.content ?? {};

  const heroTitle = content.heroTitle ?? productName;
  const heroSubtitle = content.heroSubtitle ?? DEFAULT_SUBTITLE;
  const heroBody = content.heroBody ?? DEFAULT_BODY;
  const heroBullets = content.heroBullets ?? DEFAULT_BULLETS;
  const heroNote = content.heroNote ?? DEFAULT_NOTE;
  const heroCta = content.heroCta ?? DEFAULT_CTA;

  return (
    <div className="home-page">
      <div className="home-inner">
        {/* Logo */}
        {logoUrl && (
          <img src={logoUrl} alt={orgName ?? productName} className="home-logo" />
        )}

        {/* Org label */}
        {orgName && !logoUrl && (
          <p className="home-org">{orgName}</p>
        )}

        <h1 className="home-title">{heroTitle}</h1>

        <h2 className="home-subtitle">{heroSubtitle}</h2>

        {heroBody.map((paragraph, i) => (
          <p key={i} className="home-body">{paragraph}</p>
        ))}

        <ul className="home-list">
          {heroBullets.map((item, i) => (
            <li key={i}>
              <strong>{item.label}</strong> {item.text}
            </li>
          ))}
        </ul>

        <p className="home-note">{heroNote}</p>

        <button className="home-cta" onClick={onEnter}>
          {heroCta}
        </button>
      </div>
    </div>
  );
}
