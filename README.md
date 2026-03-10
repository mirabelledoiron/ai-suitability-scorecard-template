# AI Suitability Scorecard

An interactive tool for evaluating whether AI is actually the right solution for a specific workflow — before recommending or implementing anything.

Built as part of the **AI Opportunity & Workflow Audit** framework by Mirabelle Doiron.

---

## What It Does

Most AI discussions start with the tool. This one starts with the workflow.

The scorecard walks through 6 common agency and consulting workflows and scores each one across 8 criteria drawn from published research on automation suitability. The result is a recommendation — with a rationale — for whether a workflow needs AI, traditional automation, process redesign, or nothing at all.

It is designed to be used in client meetings, internal audits, and discovery sessions.

---

## The 6 Workflows

1. Client Proposal / Brief
2. Client Onboarding
3. Design Brief Review
4. Progress Reporting
5. Social Media Content
6. Website & Branding

---

## The 8 Scoring Criteria

Each workflow is scored across 8 criteria using forced-choice answers of 1, 3, or 5:

| # | Criterion | Why it matters |
|---|-----------|----------------|
| 1 | Repetition Frequency | AI earns its cost through volume |
| 2 | Input Structure | Consistent inputs produce predictable outputs |
| 3 | Output Verifiability | Invisible errors are the most dangerous kind |
| 4 | Error Catchability ⚠ | Human review is the last line of defense |
| 5 | Bottleneck Type | AI solves throughput, not judgment |
| 6 | Stakes of Error ⚠ | High consequences require human ownership |
| 7 | Data Availability | AI needs material to work with |
| 8 | Output Standardization | Templated outputs are AI-friendly |

Criteria 4 and 6 are risk factors. If both score 1, a risk override triggers and the recommendation is automatically downgraded one category.

---

## Score Thresholds

| Score | Recommendation |
|-------|----------------|
| 8–16 | No AI fit — leave alone or redesign the process |
| 17–24 | Automation candidate — Zapier, Make, scripts |
| 25–32 | AI-assisted — drafting, summarizing, classification |
| 33–40 | AI system candidate — custom workflow or agent |

---

## Sources

The criteria are grounded in published research on automation suitability:

- **Brynjolfsson, E. & Mitchell, T.** — *What Can Machines Learn, and What Does It Mean for Occupations and the Economy?* Science, 2017
- **McKinsey Global Institute** — *A Future That Works: Automation, Employment, and Productivity*, 2017
- **Autor, D.** — *Why Are There Still So Many Jobs? The History and Future of Workplace Automation*, Journal of Economic Perspectives, 2015
- **Gartner** — AI Readiness Framework (multiple editions)

Full source explanations are available inside the tool under **Scoring Methodology**.

---

## Running Locally

No build step. No dependencies. Open the file directly:

```bash
open index.html
```

Or serve it locally:

```bash
npx serve .
```

---

## Deploying to Vercel

```bash
vercel
```

The `vercel.json` is already configured for static deployment.

---

## Part of a Larger Framework

This scorecard is one component of the **AI Opportunity & Workflow Audit** — a 4-phase engagement framework that maps workflows, scores opportunities, classifies solutions, and produces a phased implementation roadmap.

The full framework documentation lives in Notion.

---

*Built by Mirabelle Doiron — AI Systems & Workflow Strategy*
