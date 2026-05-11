# Deploy to Vercel (Step-by-Step)

Goal: get the marketing site + dashboard live on Vercel in ~10 minutes. This is a **frontend-only** deploy — the API, background workers, database, and Stripe can be wired up after you see the site running.

## What works without any backend

- Landing page (`/`)
- Pricing page (`/pricing`)
- Sign-in / Sign-up (once Clerk is configured)
- Dashboard shell (once signed in)

What will **not** work yet (needs the API + DB):
- "Upgrade" button on billing page
- Anything that reads real data

---

## 1. Create a Clerk account (2 min)

We need Clerk before deploying because the middleware requires its publishable key.

1. Go to [clerk.com](https://clerk.com) → create free account.
2. Create a new application, name it `RFPilot`.
3. Choose your auth methods (Email + Google is a good default).
4. From the dashboard, open **API Keys**. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_`)

Keep this tab open — we'll paste these into Vercel in a moment.

## 2. Push the PR branch to `main`

The current PR is on `feat/scaffold-monorepo-v2`. For Vercel to auto-deploy production, we need code on `main`.

Two options:

**Option A — merge the PR via GitHub UI (recommended):**
1. Open [PR #1](https://github.com/efeaizesogie/Week-Two-Task/pull/1).
2. First, switch repo default branch to `main` in **Settings → General → Default branch**.
3. Click **Merge pull request**.

**Option B — if you'd rather skip the PR:** just point Vercel at the `feat/scaffold-monorepo-v2` branch as its production branch in step 4 below.

## 3. Import the repo into Vercel (2 min)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import `efeaizesogie/Week-Two-Task`.
3. Vercel will detect Next.js. On the configuration screen:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** leave as `./` (the root `vercel.json` handles monorepo paths)
   - **Build Command:** already set by `vercel.json` — don't override
   - **Install Command:** already set by `vercel.json` — don't override
   - **Output Directory:** already set by `vercel.json` — don't override

## 4. Set environment variables (3 min)

In Vercel's **Environment Variables** section on the same screen, add these — set them for **Production, Preview, and Development** (the 3 checkboxes):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | From Clerk step 1 |
| `CLERK_SECRET_KEY` | From Clerk step 1 |
| `API_URL` | `http://localhost:4000` for now (the dashboard's billing button will fail gracefully) |
| `APP_URL` | Leave blank for now; set to your Vercel URL after first deploy |

That's it. You don't need Stripe, OpenAI, AWS, Redis, or Postgres yet — none of those are hit by the pages currently rendered.

## 5. Click Deploy

Vercel will:
1. Run `pnpm install --frozen-lockfile`
2. Run `pnpm --filter @rfpilot/db generate` (generates Prisma types so TS compiles)
3. Run `pnpm --filter @rfpilot/web build`
4. Serve `apps/web/.next`

First build takes ~2–3 minutes. When it finishes you get a URL like `week-two-task-xxx.vercel.app`.

## 6. Configure Clerk with your deployed URL

Back in Clerk:
1. Open **Domains** in the Clerk dashboard.
2. Add your Vercel URL (e.g. `week-two-task-xxx.vercel.app`) as an authorised domain.
3. Under **Paths**, set:
   - **Sign-in URL:** `/sign-in`
   - **Sign-up URL:** `/sign-up`
   - **After sign-in URL:** `/dashboard`
   - **After sign-up URL:** `/dashboard`

Finally, back in Vercel → **Settings → Environment Variables**, set `APP_URL` to `https://your-vercel-url.vercel.app` and redeploy from the **Deployments** tab.

## 7. Test it

Visit your URL. You should see:
- ✅ Landing page renders
- ✅ `/pricing` renders
- ✅ `/sign-up` shows the Clerk sign-up form
- ✅ After signing up, you're redirected to `/dashboard` and see the shell
- ⚠️ Clicking "Upgrade to Starter" will error (expected — needs the API)

## Troubleshooting

**Build fails with "CLERK_SECRET_KEY is required"**
- Make sure the env var is set for the environment the build is running in (Production/Preview/Development). The three checkboxes matter.

**Build fails with "Prisma Client not generated"**
- The root `vercel.json` should handle this via the `buildCommand`. If you overrode the build command in the UI, clear it and redeploy.

**Middleware errors about `auth.protect()`**
- You're on an older Clerk version. Run `pnpm update @clerk/nextjs` and redeploy.

**Sign-in redirects in a loop**
- Your Clerk **After sign-in URL** is probably `/` instead of `/dashboard`. Fix in Clerk → Paths.

## What to do after you see it live

Come back and we'll implement features in this order:
1. Neon Postgres + Prisma migration (unblocks everything else)
2. Deploy the API to Fly.io (so billing / dashboard data works)
3. Document upload → AI ingestion slice
4. RFP question extraction + AI draft slice
5. Design-system polish (Framer Motion, richer shadcn components)
