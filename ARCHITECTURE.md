# ImpulsArte: phase-one architecture

**Status:** Implementation draft. Company name: ImpulsArte. Prices, domain, and legal text need owner review before launch.

## Product boundary

The public site helps a client discover agency services and send a project brief. The private workspace lets the client discuss the brief, receive and decide on a quote, and follow milestones. An admin reviews briefs, invites and approves India-based developers, assigns them to briefs, sends quotes, and manages service content. Approved developers see only their assigned work.

The phase-one site has no checkout, credits, subscriptions, open job board, public developer profiles, or digital product marketplace. Those ideas need separate product decisions before implementation.

## Public routes

Routes are language neutral. The language choice is stored in a cookie; Spanish is the default for Argentina. Service paths are fixed, so a content editor cannot generate a new public route by adding a database row.

| Route                            | Purpose                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| `/`                              | Agency introduction, service search, category cards, process, primary call to action |
| `/services`                      | Browse all published services                                                        |
| `/services/websites`             | Website service detail                                                               |
| `/services/web-apps`             | Web application service detail                                                       |
| `/services/maintenance`          | Maintenance service detail                                                           |
| `/how-it-works`                  | Brief-to-delivery process                                                            |
| `/about`                         | Agency approach and contact path in one page                                         |
| `/contact`                       | Permanent redirect to `/about#contact` for existing links                            |
| `/legal/terms`, `/legal/privacy` | Published legal documents, once supplied                                             |

Language and theme controls appear in the shared header and persist in cookies. The language toggle reloads the current URL with translated content. Public content is server rendered. Each indexable page has one canonical URL. English is not a separate indexed URL because the language choice does not change the address. `sitemap.xml` lists published public pages; `robots.txt` excludes private areas.

## Account routes

These routes use the same language choice. The only variable route segment in phase one is a private record ID.

| Route                         | Access                      | Purpose                                                                |
| ----------------------------- | --------------------------- | ---------------------------------------------------------------------- |
| `/signin`                     | Public                      | Google OAuth or email code                                             |
| `/onboarding/terms`           | Signed in                   | Read and accept current published terms                                |
| `/start`                      | Client                      | Create brief and upload up to three reference files                    |
| `/dashboard`                  | Client                      | Brief and project overview                                             |
| `/dashboard/briefs/[id]`      | Owning client               | Messages, attachments, quotes, milestones, WhatsApp link if configured |
| `/developer/onboarding`       | Invited account             | Submit developer details for manual review                             |
| `/developer`                  | Approved developer          | Assigned work overview; pending applicants see review state            |
| `/developer/assignments/[id]` | Assigned approved developer | Brief, files, and discussion                                           |
| `/admin`                      | Admin                       | Incoming briefs and operational overview                               |
| `/admin/enquiries/[id]`       | Admin                       | Assignment, quote, messages, project and milestones                    |
| `/admin/developers`           | Admin                       | Invitations and manual approval                                        |
| `/admin/content`              | Admin                       | Bilingual service copy, publication state, and ARS starting prices     |
| `/notifications`              | Signed in                   | In-app updates                                                         |

## Implementation boundaries

- **Next.js App Router + TypeScript:** pages, server rendering, route metadata, and UI. Public service content has a code fallback so the showcase loads before Supabase is connected.
- **Supabase Auth:** Google OAuth and email OTP. The server reads the verified user from Supabase; a Next.js proxy refreshes session cookies on private routes.
- **Supabase Postgres:** service content, profiles, legal documents and acceptances, enquiries, assignments, messages, quotes, projects, milestones, notifications, email outbox, and audit events.
- **Row level security:** protects rows by owner, admin role, or approved assignment. Quote decisions, assignment, invitation review, and project start use database functions to keep state changes together.
- **Supabase Storage:** private reference files. Object paths include the owner's user ID and enquiry ID. Access is checked against enquiry membership.
- **Email worker:** database events queue notifications; a scheduled Supabase Edge Function sends queued email through Resend. In-app updates work without that worker.
- **Vercel:** intended Next.js host. Supabase hosts Auth, database, storage, and the email worker.

## Main flows

1. **Discovery:** client browses or searches the three categories, opens a fixed service page, and chooses to start a brief.
2. **Access:** client signs in, reads the current approved terms, then submits a brief. The brief is saved as `submitted`; admins receive an update.
3. **Review and assignment:** admin reviews the brief, can message the client, and assigns only a manually approved developer. The developer sees only assigned enquiries.
4. **Proposal:** admin sends a versioned quote in ARS. The owning client approves or declines it. Only an approved quote can start a project.
5. **Delivery:** admin creates and updates milestones. Client, admin, and assigned approved developer can use the project discussion. Notifications mark relevant changes.
6. **Developer access:** admin invites an email address; the recipient signs in, submits an India-based profile, then waits for admin review. Approval unlocks assignments.

## Launch dependencies

The public site can run locally now. Live account flows require a Supabase project and migration, Google provider and email configuration, a reviewed Terms and Privacy Policy in both languages, an owner admin account, actual service prices if displayed, and an agency WhatsApp number if that channel is offered. The brand and domain need approval. Database policies and Auth flows need integration testing with separate client, admin, pending developer, and approved developer accounts before production.
