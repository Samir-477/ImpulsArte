# ImpulsArte

A bilingual service website and project workspace for a development agency. The public site has three fixed development service pages: websites, web apps, and maintenance. Business services and digital consultancy are presented on How We Work and Services, with enquiries routed to the combined About and Contact page. Clients can submit briefs, receive quotes, and follow project milestones. Admins assign approved developers. There is no online payment flow.

See [the architecture map](ARCHITECTURE.md) for the page inventory, role boundaries, data flow, and phase-one scope.

**Company name: ImpulsArte.** Tagline: “Somos la herramienta que mueve tus ideas a la realidad”.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env.local` and `npm.cmd run dev` if script execution blocks `npm`.

The public pages work without Supabase settings. Sign-in and project actions become available after the database and Auth are configured.

## Configure Supabase

1. Create a Supabase project. Put its **HTTPS Project URL** in `NEXT_PUBLIC_SUPABASE_URL` and its publishable/anon key in `NEXT_PUBLIC_SUPABASE_ANON_KEY`. A PostgreSQL URI belongs only in the server-side `DATABASE_URL`; never put it in a `NEXT_PUBLIC_*` variable. Set `NEXT_PUBLIC_SITE_URL` to the site origin and `NEXT_PUBLIC_AGENCY_WHATSAPP` to the agency's international-format number, digits only, when available.
2. Apply [the migration](supabase/migrations/20260930000000_init.sql) with Supabase CLI (`supabase db push`) or the project SQL editor before anyone signs in. It creates the tables, RLS policies, private attachment bucket, and transactional functions.
3. Enable Google Auth. Allow `http://localhost:3000/auth/callback**` and the production equivalent as redirect URLs. Configure the Google provider in Supabase and its required Google Cloud credentials.
4. Enable email OTP and set the email template to display `{{ .Token }}`. Configure custom SMTP before inviting real users; Supabase's default email delivery is for testing only. [Supabase email templates](https://supabase.com/docs/guides/auth/auth-email-templates) · [SMTP setup](https://supabase.com/docs/guides/auth/auth-smtp)
5. After the first owner signs in, promote that account through the SQL editor: `update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'owner@example.com');`. Only trusted project operators should run this command.
6. Add the reviewed Terms and Privacy Policy in **both** `es` and `en`, using the same version number per document. Publish both language rows together. Until current Terms exist, account areas intentionally stop at the acceptance screen. No legal copy is invented by this repo.

For a fresh app-schema reset, apply [reset_app.sql](supabase/reset_app.sql), then reapply [the migration](supabase/migrations/20260930000000_init.sql). The reset removes this repo's `public` tables and Storage access policies. It preserves Supabase Auth users and Storage system data. Existing Auth users get new client profiles when the migration is reapplied; promote the owner to admin again.

Example for each approved legal translation:

```sql
insert into public.legal_documents(kind, locale, version, body, published_at)
values ('terms', 'es', 1, 'REPLACE WITH APPROVED SPANISH TERMS', now());
```

Repeat for English Terms and both Privacy translations using approved text. Do not publish the example placeholder.

## Email notifications

Database actions create in-app notifications and durable email-outbox rows. Deploy `supabase/functions/send-outbox` as an Edge Function. Set `RESEND_API_KEY`, `EMAIL_FROM`, and `SITE_URL` as function secrets. Configure Supabase Cron to POST to the function every minute with the service-role token stored in Supabase Vault. The function claims jobs, sends via Resend, and retries failures. Do not place the service-role key or Resend key in `NEXT_PUBLIC_*` variables.

Follow the current [Supabase scheduled function guide](https://supabase.com/docs/guides/functions/schedule-functions) for the Vault and Cron SQL. Until the worker is scheduled, in-app notifications work but email updates remain queued.

## Route map

Public: `/`, `/services`, `/services/websites`, `/services/web-apps`, `/services/maintenance`, `/how-it-works`, and `/about`. `/contact` permanently redirects to the contact section on `/about`. The language toggle keeps the URL and stores the choice in a cookie. Older `/es` and `/en` links redirect to the same unprefixed page. These are fixed routes; there is no generated service-slug system.

Private: `/signin`, `/start`, `/dashboard`, `/dashboard/briefs/[id]`, `/developer`, `/developer/assignments/[id]`, `/admin`, `/admin/enquiries/[id]`, `/admin/developers`, `/admin/content`, and `/notifications`. Record IDs appear only in private project routes.

## Release inputs

Before production, provide the approved brand and domain, actual ARS starting prices, agency WhatsApp number, legal text, production email domain, and invited India-based developer list. Admins can edit service copy and prices after the database is connected. The public site does not claim past projects, ratings, or testimonials without evidence.

## Checks

```bash
npm run lint
npm run build
```

After Supabase is connected, test client ownership, pending-developer restrictions, assigned-developer access, private attachment downloads, quote decisions, milestone updates, and email delivery with separate real accounts.

## Public motion experience

ImpulsArte’s original landing illustration cycles through idea, design, and launch. How We Work uses a five-stage scroll story, an original animated vector team, and an interactive business/consultancy map. About uses an illustrated studio workspace. Services use distinct browser assembly, workflow, and support motion; About animates the conversation illustration.

The shared pause control stops marketing motion. Continuous scenes pause outside the viewport and when the browser tab is hidden. Reduced-motion preferences provide a static alternative. Main implementation: `src/components/motion-experience.tsx`, `src/components/classic-hero-visual.tsx`, and `src/app/motion.css`.
