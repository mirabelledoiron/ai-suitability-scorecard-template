import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from './useTheme';
import type {
  Answers,
  CurrentView,
  OptionScore,
  Workflow,
  WorkflowContextEntry,
  TenantJson,
  TenantBranding,
  TenantThresholds,
  Criterion,
  Result,
  CategoryKey,
} from './types';
import { CRITERIA, RESULTS } from './data';
import { DEFAULT_THRESHOLDS } from './logic';
import { getTenantSlug, getTenantStoragePrefix } from './tenantLoader';
import { applyTenantTheme } from './themeLoader';
import Sidebar from './components/Sidebar';
import WorkflowView from './components/WorkflowView';
import SummaryView from './components/SummaryView';
import MethodologyView from './components/MethodologyView';
import HomePage from './components/HomePage';
import { downloadCSV } from './report';

const DEFAULT_PRODUCT_NAME = 'AI Suitability Scorecard';

function makeStorageKey(base: string): string {
  return `${getTenantStoragePrefix()}${base}`;
}

const LS_ANSWERS_KEY = makeStorageKey('scorecard-answers-v1');
const LS_VIEW_KEY = makeStorageKey('scorecard-view-v1');

function loadAnswers(): Answers {
  try {
    const raw = localStorage.getItem(LS_ANSWERS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Record<string, number>>;
    const result: Answers = {};
    for (const wfId of Object.keys(parsed)) {
      result[Number(wfId)] = {};
      for (const cId of Object.keys(parsed[wfId])) {
        const score = parsed[wfId][cId];
        if (score === 1 || score === 3 || score === 5) {
          result[Number(wfId)][Number(cId)] = score;
        }
      }
    }
    return result;
  } catch {
    return {};
  }
}

function loadView(): CurrentView {
  try {
    const raw = localStorage.getItem(LS_VIEW_KEY);
    if (!raw) return 'home';
    const parsed = JSON.parse(raw) as CurrentView;
    if (parsed === 'summary' || parsed === 'methodology' || parsed === 'home') return parsed;
    if (typeof parsed === 'number' && parsed >= 1) return parsed;
    return 'home';
  } catch {
    return 'home';
  }
}

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [answers, setAnswers] = useState<Answers>(loadAnswers);
  const [current, setCurrent] = useState<CurrentView>(loadView);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [context, setContext] = useState<Record<number, WorkflowContextEntry>>({});
  const [branding, setBranding] = useState<TenantBranding>({ productName: DEFAULT_PRODUCT_NAME });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(LS_ANSWERS_KEY, JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem(LS_VIEW_KEY, JSON.stringify(current));
  }, [current]);

  useEffect(() => {
    const tenant = getTenantSlug();
    const url = tenant ? `/tenants/${tenant}.json` : '/workflows.json';

    fetch(url)
      .then(r => r.json())
      .then((data: TenantJson) => {
        setWorkflows(data.workflows);

        const loadedBranding: TenantBranding = {
          productName: data.branding?.productName ?? DEFAULT_PRODUCT_NAME,
          organizationName: data.branding?.organizationName,
          logoUrl: data.branding?.logoUrl,
          faviconUrl: data.branding?.faviconUrl,
          theme: data.branding?.theme,
          content: data.branding?.content,
          criteriaOverrides: data.branding?.criteriaOverrides,
          categoryOverrides: data.branding?.categoryOverrides,
          thresholds: data.branding?.thresholds,
        };

        setBranding(loadedBranding);
        applyTenantTheme(loadedBranding, DEFAULT_PRODUCT_NAME);

        const ctx: Record<number, WorkflowContextEntry> = {};
        for (const [k, v] of Object.entries(data.context)) {
          const numKey = Number(k);
          ctx[numKey] = {
            intro: v.intro,
            hints: Object.fromEntries(
              Object.entries(v.hints).map(([hk, hv]) => [Number(hk), hv])
            ),
          };
        }
        setContext(ctx);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Update document title when productName changes
  useEffect(() => {
    document.title = branding.productName ?? DEFAULT_PRODUCT_NAME;
  }, [branding.productName]);

  // Close sidebar on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSidebarOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Merge CRITERIA with any per-criterion overrides from the tenant config
  const effectiveCriteria = useMemo<Criterion[]>(() => {
    const overrides = branding.criteriaOverrides ?? {};
    return CRITERIA.map(c => ({ ...c, ...overrides[c.id] }));
  }, [branding.criteriaOverrides]);

  // Merge RESULTS with any per-category overrides from the tenant config
  const effectiveResults = useMemo<Record<CategoryKey, Result>>(() => {
    const overrides = branding.categoryOverrides ?? {};
    return Object.fromEntries(
      (Object.entries(RESULTS) as [CategoryKey, Result][]).map(([key, result]) => [
        key,
        { ...result, ...(overrides[key] ?? {}) },
      ])
    ) as Record<CategoryKey, Result>;
  }, [branding.categoryOverrides]);

  // Active thresholds (tenant config or defaults)
  const thresholds: TenantThresholds = branding.thresholds ?? DEFAULT_THRESHOLDS;

  function handleAnswer(wfId: number, criterionId: number, score: OptionScore) {
    setAnswers(prev => ({
      ...prev,
      [wfId]: { ...(prev[wfId] ?? {}), [criterionId]: score },
    }));
  }

  const handleSelect = useCallback((view: CurrentView) => {
    setCurrent(view);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="layout">
        <aside className="sidebar" />
        <div className="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--color-text-hint)', fontSize: '14px' }}>Loading…</p>
        </div>
      </div>
    );
  }

  const currentWorkflow =
    typeof current === 'number'
      ? workflows.find(wf => wf.id === current) ?? null
      : null;

  const currentTitle =
    currentWorkflow?.title ??
    (current === 'summary'
      ? 'Summary'
      : current === 'methodology'
        ? 'Scoring Methodology'
        : (branding.productName ?? DEFAULT_PRODUCT_NAME));

  const appTitle =
    currentTitle === (branding.productName ?? DEFAULT_PRODUCT_NAME)
      ? currentTitle
      : currentTitle;

  return (
    <div className="layout">
      {/* Mobile top bar */}
      <header className="mobile-topbar">
        <button
          className="hamburger"
          aria-label="Open menu"
          onClick={() => setSidebarOpen(true)}
        >
          <span /><span /><span />
        </button>
        <span className="mobile-title">{appTitle}</span>
      </header>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        workflows={workflows}
        answers={answers}
        current={current}
        onSelect={handleSelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        criteriaCount={effectiveCriteria.length}
        logoUrl={branding.logoUrl}
        orgName={branding.organizationName}
        thresholds={thresholds}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="content">
        {current === 'home' && (
          <HomePage branding={branding} onEnter={() => handleSelect(workflows[0]?.id ?? 1)} />
        )}
        {current === 'summary' && (
          <SummaryView
            workflows={workflows}
            answers={answers}
            onSelect={handleSelect}
            onDownload={() =>
              downloadCSV(
                workflows,
                answers,
                effectiveCriteria,
                effectiveResults,
                branding.organizationName,
                thresholds,
              )
            }
            criteria={effectiveCriteria}
            results={effectiveResults}
            thresholds={thresholds}
          />
        )}
        {current === 'methodology' && <MethodologyView />}
        {typeof current === 'number' && currentWorkflow && (
          <WorkflowView
            workflow={currentWorkflow}
            context={context[currentWorkflow.id]}
            answers={answers}
            onAnswer={handleAnswer}
            criteria={effectiveCriteria}
            results={effectiveResults}
            thresholds={thresholds}
          />
        )}
      </div>
    </div>
  );
}
