# philaraujo-web: the client data check, moved off Lovable

What this repo is: the free check "Is your client data safe with AI?" (EN and FR), moved from Lovable (TanStack Start) to Next.js on Vercel, with its own Supabase project in London and Resend for email. The website pages join this repo later (plan workstream F); nothing else lives here yet.

Source of truth for the plan: Phil's vault, `_index/the-plan.md`, workstream E.

## Decisions
- Next.js App Router, Tailwind 4, TypeScript. The check page and the print page are client components.
- The browser never talks to the database. The form posts to `app/api/submit/route.ts`, which validates with zod, recomputes the score on the server from the answers (never trusts client numbers), inserts with the service role key, then sends two emails through Resend: the alert to Phil and the results to the person, with their Word policy attached.
- Vercel functions run in London (`lhr1`, set in `vercel.json`), next to the database.
- Supabase project in West Europe (London). Schema in `supabase/migrations/`. RLS on, no grants to anon or authenticated.
- Keep `lib/check.ts`, `lib/copy.ts`, `lib/policy.ts`, `lib/policy-docx.ts`, `lib/nodes.ts` and their tests as ported from Lovable; they are verified (6 Nov end-to-end test).
- No Lovable packages, no Lovable badge, no error-reporting to Lovable.

## The four fixes from the 6 Nov test
1. Offer wording in `lib/copy.ts`: company brain "Everything your firm knows, in one place you own and can ask. Stored in the UK on a server you own, and client data never goes to a public AI service."; personal title "Your own AI system, that you own" (FR to match).
2. French: decimals with a comma (4,0) via `toLocaleString(lang)`; a non-breaking space before ? : ! in FR strings so they never sit alone.
3. Labels on the name, email and firm inputs (`htmlFor`/`id`).
4. No Lovable badge.

## Environment variables (set by Phil in Vercel, never committed)
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`, `RESEND_FROM` (e.g. `Phil Araujo <check@send.philaraujo.com>`), `ALERT_TO` (phil@prodheroes.com)
- `NEXT_PUBLIC_SITE_URL` (https://check.philaraujo.com)

## Done when
check.philaraujo.com serves this build, a TEST run lands in the London table with `is_test = true`, the alert reaches Phil and the results email reaches the test address, and the Word policy downloads in EN and FR.
