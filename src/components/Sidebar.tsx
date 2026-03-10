import type { Workflow, Answers, CurrentView, CategoryKey, TenantThresholds } from '../types';
import { totalScore, getCategory } from '../logic';
import { CATEGORY_COLORS, DEFAULT_COLORS } from '../categoryColors';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';

interface SidebarProps {
  workflows: Workflow[];
  answers: Answers;
  current: CurrentView;
  onSelect: (view: CurrentView) => void;
  isOpen: boolean;
  onClose: () => void;
  criteriaCount: number;
  thresholds: TenantThresholds;
  logoUrl?: string;
  orgName?: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

function getScoreStyle(
  wfId: number,
  answers: Answers,
  criteriaCount: number,
  thresholds: TenantThresholds,
): React.CSSProperties {
  const wfAnswers = answers[wfId];
  const answeredCount = wfAnswers ? Object.keys(wfAnswers).length : 0;
  if (answeredCount < criteriaCount) {
    return { background: DEFAULT_COLORS.bg, color: DEFAULT_COLORS.dark };
  }
  const score = totalScore(wfId, answers);
  const { category } = getCategory(score, wfAnswers, thresholds);
  const colors = CATEGORY_COLORS[category as CategoryKey];
  return { background: colors.bg, color: colors.dark };
}

function getScoreLabel(wfId: number, answers: Answers): string {
  const wfAnswers = answers[wfId];
  const answeredCount = wfAnswers ? Object.keys(wfAnswers).length : 0;
  if (answeredCount === 0) return '—';
  return String(totalScore(wfId, answers));
}

export default function Sidebar({
  workflows,
  answers,
  current,
  onSelect,
  isOpen,
  onClose,
  criteriaCount,
  thresholds,
  logoUrl,
  orgName,
  theme,
  onToggleTheme,
}: SidebarProps) {
  const groups = Array.from(new Set(workflows.map(wf => wf.group)));

  return (
    <nav className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
      <button className="sidebar-close" aria-label="Close menu" onClick={onClose}>✕</button>

      {/* Brand / Home */}
      {(logoUrl || orgName) ? (
        <button className="sidebar-brand sidebar-brand--btn" onClick={() => onSelect('home')}>
          {logoUrl && <img src={logoUrl} alt={orgName ?? 'Logo'} className="sidebar-logo" />}
          {orgName && <span className="sidebar-brand-name">{orgName}</span>}
        </button>
      ) : (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink active={current === 'home'} onClick={() => onSelect('home')}>
                <span className="sidebar-nav-icon">⌂</span>
                <span>Home</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}

      {/* Workflow groups */}
      {groups.map((group, groupIdx) => {
        const groupWorkflows = workflows.filter(wf => wf.group === group);
        return (
          <div key={group}>
            {groupIdx > 0 && <div className="sidebar-divider" />}
            <div className="sidebar-label">{group}</div>
            <NavigationMenu>
              <NavigationMenuList>
                {groupWorkflows.map(wf => (
                  <NavigationMenuItem key={wf.id}>
                    <NavigationMenuLink
                      active={current === wf.id}
                      onClick={() => onSelect(wf.id)}
                      className="justify-between"
                    >
                      <span className="sidebar-wf-title">{wf.title}</span>
                      <span
                        className="sidebar-score"
                        style={getScoreStyle(wf.id, answers, criteriaCount, thresholds)}
                      >
                        {getScoreLabel(wf.id, answers)}
                      </span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        );
      })}

      <div className="sidebar-divider" />

      {/* Bottom nav */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink active={current === 'summary'} onClick={() => onSelect('summary')}>
              <span className="sidebar-nav-icon">⊞</span>
              <span>Summary View</span>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink active={current === 'methodology'} onClick={() => onSelect('methodology')}>
              <span className="sidebar-nav-icon">?</span>
              <span>How to Read Results</span>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="sidebar-divider" />

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink onClick={onToggleTheme}>
              <span className="sidebar-nav-icon">{theme === 'dark' ? '○' : '●'}</span>
              <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
