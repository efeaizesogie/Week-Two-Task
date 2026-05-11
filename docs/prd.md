# RFPilot — Product Requirements Document

## One-liner
RFPilot is the AI copilot for RFPs and security questionnaires — built for modern sales teams who refuse to use 2015-era software.

## Problem
B2B sales teams spend 20–40 hours per RFP re-answering the same questions. Incumbents (Loopio, Responsive) charge $25k+/yr and ship 2015-era UX. The bottom-up market — teams responding to RFPs in Google Docs and email threads — is ~100× larger and underserved.

## Target users
- **Maya — Proposal Manager** (primary): 200-person B2B SaaS, owns 40+ RFPs/yr.
- **Derek — Account Executive** (expansion): does 6–8 RFPs/yr, won't learn complex tools.
- **Sasha — VP Sales / RevOps** (economic buyer): cares about win rate + rep productivity.

## Unique value proposition
An RFP copilot that answers 80% of any RFP from your own past proposals in minutes, with citations — priced for individual users, not enterprise contracts.

## MVP scope
1. Multi-tenant auth + workspaces (Clerk)
2. Document ingest (PDF / DOCX / XLSX)
3. Knowledge base with vector search (Postgres + pgvector)
4. RFP question extraction (AI)
5. AI answer drafting with citations + confidence
6. Answer library CRUD + ownership + staleness flags
7. Collaboration (assign, comment, approve)
8. Export to DOCX + PDF
9. Stripe billing
10. Core analytics

## Pricing

| Tier | Price | Target | Included |
|---|---|---|---|
| Free | $0 | Solo trial | 1 user, 3 RFPs/mo, watermarked exports |
| Starter | $79 / user / mo | Small teams | Unlimited RFPs, no watermark, 5 GB KB |
| Team | $199 / user / mo | Proposal teams | SSO, roles, analytics, 50 GB KB, API |
| Enterprise | Custom ($30k+) | 50+ users | SOC 2, SLA, dedicated CSM |

Blended ARPA target: ~$8k. 500 customers in Y1 = $4M ARR.

## North-star metrics
- Activation: user uploads 1 RFP + gets 1 AI answer within 24h (target 40%)
- Week-4 retention: 50%
- Free → Paid conversion: 8% within 14 days
- Time-to-first-value: < 10 minutes

## Growth loops
1. Watermarked free exports — every submitted proposal markets us to buyer procurement teams.
2. Invite-teammate collaboration — natural seat expansion.
3. Public answer-library templates (opt-in) — SEO moat + community flywheel.
4. "Import from Loopio" migration tool — competitive displacement.
