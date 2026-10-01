# ImpulsArte UI, story, and motion audit

Date: 2026-10-01. Scope: current Next.js source, all route pages, shared components, six global CSS files, dependency list, local code graph, and a read-only Supabase status check. This is a source and product-flow audit. A controlled browser session was unavailable, so visual, mobile, accessibility, and frame-rate findings below are recommendations to validate on devices, not claims of measured runtime behavior. No Three.js or GSAP implementation was made.

## Design verdict

The existing visual identity is worth keeping: ink blue, pale blue, mint, sand, editorial type, hand-drawn vector scenes, and the original home hero. The site already has many animations. Adding two libraries everywhere would make the experience heavier and less coherent. The best next move is to assign each tool a specific job:

- **GSAP + ScrollTrigger:** one substantial, reversible scroll story on `/how-it-works`, with smaller one-time editorial reveals on selected public pages. Replace overlapping Motion and IntersectionObserver control on any element GSAP owns.
- **Three.js via React Three Fiber:** one optional, interactive, orthographic paper-and-glass service model in the `/services` hero. Tie its three states to the real service categories and existing DOM controls. Preserve the current home illustration.
- **Current Motion/CSS:** keep for the navigation highlight, menu, functional state transitions, and small ambient details. Reduce repeated entrance patterns and perpetual loops.

The bigger gap is business credibility. Service copy explains broad categories but rarely states client problems, deliverables, boundaries, who does the work, or how decisions are made. Business services and digital consultancy each have one short generic description. The About page says what the team values but provides no verified team, location, or work examples. Animation cannot supply those facts.

## Current route audit

| Route | What is there now | Recommended story and motion | Three.js / GSAP decision |
| --- | --- | --- | --- |
| `/` | Original looping build visual, service ribbon, searchable finder, three service cards, CTA. | Keep this hero composition. Clarify who ImpulsArte helps and what the first conversation produces. One GSAP transition can connect the hero's moving line to the discovery section; no extra carousel or second process explanation. The ribbon can remain ambient if paused when out of view. | GSAP only for a short, non-pinned hero-to-discovery sequence. No Three.js in the first pass. |
| `/services` | Search repeated from Home, three catalog rows, short business/consultancy section. | Make this the exploration page: let a selected category alter one orthographic 3D object that shows website, workflow, or maintenance as a tangible artifact. Keep all category names, descriptions, and links in HTML. Add clear inputs, outputs, and fit for each offer. | Best and only initial Three.js island. GSAP optional for one catalog transition, replacing the current repeated entrances. |
| `/services/websites` | Browser-like art, feature list, other-service links. | Show a website moving from rough content structure to a usable page, tied to what the client receives and supplies. Avoid implying SEO or conversion results without evidence. | GSAP SVG/DOM timeline on entry or controlled scroll. No Three.js. |
| `/services/web-apps` | Connected nodes and list of capabilities. | Show a specific, illustrative problem-to-workflow sequence: manual handoff → shared tool → visible decision. State it is an example, not a client case. | GSAP path and node transitions. No separate WebGL canvas. |
| `/services/maintenance` | Orbiting support art and list of activities. | Replace generic pulsing with a clear lifecycle: observe → fix → verify → improve. Explain support boundaries after the agency defines them. | Small GSAP SVG sequence at most. No Three.js. |
| `/how-it-works` | Animated crew hero, five chapter texts, sticky illustrated desk, auto-rotating business map. | This is the flagship narrative. Keep all five chapters readable in document order. Align desk artifacts to Listen, Define, Build, Review, Deliver. Show client action, team action, and decision/output per chapter. End with a specific handoff/next-step CTA. | GSAP ScrollTrigger owns chapter progression; CSS sticky can remain. Do not add GSAP pin on top of sticky. No second 3D story. |
| `/about` | Illustrated studio, Listen/Agree/Build principles, contact invitation. | Differentiate it from the process page. Tell who the company is, where it operates, who clients speak to, and why the team can be trusted, using verified facts. Animate the existing studio objects once as the reader arrives. | GSAP one-time SVG scene choreography; no Three.js. |
| `/contact` | Permanent redirect to `/about#contact`. | Keep redirect; no visual treatment. | Neither. |
| `/signin` | Full-height split view and email OTP; Google button gated by config. | Keep sign-in quiet and fast. Explain what happens after sign-in and how long the email code takes only when verified. | Neither. |
| `/start` | Single brief form with service, timeline, title, summary, attachments. | Keep the form stable while typing. Add precise inline validation and a clear successful-submission state; preserve no-payment promise. | Neither. |
| `/onboarding/terms` | Terms acceptance or pending message. | Text and consent must remain still and readable. | Neither. |
| `/legal/terms`, `/legal/privacy` | Published copy or pending message. | Publish approved EN/ES legal text before inviting clients. Improve document hierarchy once real content exists. | Neither. |
| `/dashboard` | Brief list, recent notices, empty state. | Make next action and state obvious. Animate only a newly created row or status change briefly. | Neither; CSS/Motion feedback only. |
| `/dashboard/briefs/[id]` | Brief, milestones, quotes, messages, attachments. | Present a clear status timeline and next action. Keep quote decisions and messages stable, with immediate confirmation feedback. | Neither; no cinematic animation. |
| `/developer` | Pending-review view or assignment list. | Keep approval state and assigned work clear; use a useful empty state. | Neither. |
| `/developer/onboarding` | Invitation claim and location confirmation. | Preserve a plain verification flow. | Neither. |
| `/developer/assignments/[id]` | Brief, milestones, messages, attachments. | Prioritize due work, scope, and handoff context once those facts exist in data. | Neither. |
| `/admin` | Recent briefs and links to content/developers. | Prioritize work requiring a decision; avoid decorative load. | Neither. |
| `/admin/enquiries/[id]` | Brief, conversation, quotes, milestones, assignment controls. | Make operations and destructive/irreversible decisions unmistakable; use immediate status feedback. | Neither. |
| `/admin/developers` | Invitation review list. | Put evidence and review status ahead of motion. | Neither. |
| `/admin/content` | Bilingual service editor. | Make unsaved changes and EN/ES completeness visible. | Neither. |
| `/notifications` | Latest 50 notices. | Read/unread feedback should be quick and interruptible. | Neither. |
| `/auth/callback` | Auth code exchange endpoint. | No visible page to animate. | Neither. |

Shared header and footer: keep their current CSS/Motion behavior. A second animation engine has no useful role in navigation. The footer can use one short, non-looping invitation movement when it first enters view, while the legal links remain still.

## Evidence-backed issues, ordered by impact

| Before | After | Why |
| --- | --- | --- |
| The main `/start` CTA requires sign-in and accepted Terms (`src/app/[locale]/start/page.tsx`), while Supabase currently has **0 published legal documents**. | Publish approved Terms and Privacy text in both languages, then test the full anonymous-to-submitted-brief journey. If launch must precede that, decide on a separate lawful contact path. | The primary client conversion path cannot complete today. The public legal pages show a pending message despite a live deployment. |
| Google sign-in is gated by `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED`; Supabase reports Google disabled. | Configure the Google provider and redirect URLs, enable the UI flag, and test callback. | A visible Google button must work, and the currently hidden option weakens the intended low-friction sign-in path. |
| `agency-offerings.ts` gives one broad sentence each for business services and consultancy; `/services` has no deeper explanation for them. | Define concrete business service types, client situations, outputs, and boundaries; give them substantive in-page sections before adding routes. | Clients cannot judge whether these offerings fit their need. Motion would amplify vague claims. |
| `/about` repeats Listen/Agree/Build, while `/how-it-works` already explains five stages. | Use About for real team identity, location, values in action, contact expectations, and verified examples; keep process detail on How We Work. | The pages currently answer much of the same question. |
| `DetailedProcessStory` selects chapters through a narrow IntersectionObserver reading band (`src/components/detailed-process-story.tsx`). | Move chapter state and artifact changes to one scoped GSAP ScrollTrigger timeline, or retain the observer and avoid GSAP here. | Two scroll controllers would fight. A single explicit controller makes reversible chapter behavior easier to tune. |
| `BusinessMap` automatically advances every 4.5 seconds even after a user selects a category (`src/components/business-map.tsx`). | Stop auto-advance after manual interaction; add explicit previous/next or use a stable selected state. | The interface can undo a user's choice while they read it. |
| `ServiceEntrance` moves cards 62px over 720ms, and `CatalogEntrance` repeats a 36px side reveal (`src/components/landing-motion.tsx`, `src/components/motion-experience.tsx`). | Reduce repeated entrances; use a smaller 8–16px reveal only where it helps hierarchy. Keep hover feedback under 200ms. | Repeated entrance patterns make sections feel templated and can slow scanning. |
| Six globally imported stylesheets total about **128 KB of source CSS** and **6,820 lines**; `studio-story.css` and `site-shell.css` override `.journey-desk` repeatedly. | Consolidate page-specific motion styles before adding GSAP; remove unused old story/rail styles. | Additional animation will be hard to reason about while the cascade has several later overrides. This is a maintainability finding, not a measured transfer-size claim. |
| `ScrollStory`, `ProcessTimeline`, `ScrollRail`, and `BusinessRail` are defined but not imported by current pages. | Remove after confirming no planned reuse, with their unused CSS. | They increase the number of animation patterns developers must understand. |
| Current reduced-motion CSS stops most loops, but `marketing.css` still scales some hovered glyphs to 1.7x/2.5x inside its reduced-motion rule. | Use a static emphasis treatment for those states. | Reduced-motion users should not get a large visual transform as a fallback. |

The current global pause button, offscreen/hidden-tab gating, keyboard focus treatment, and reduced-motion infrastructure are useful foundations. Preserve them when GSAP or WebGL is added.

### Motion review verdict

**Block a wider motion rollout for now.** The business-map timer can override a deliberate selection, large repeated card entrances dilute the visual hierarchy, and the reduced-motion hover rules still apply large transforms. These are specific interaction and accessibility issues to resolve before adding another animation engine. The current site can remain live while that work is planned.

- **Feel-breaking interaction:** the business map changes selection after user input.
- **Missed simplification:** three service cards and three catalog rows use near-identical entrance treatments.
- **Performance and maintainability:** all six CSS files load through the shared layout; repeated overrides make scene ownership unclear. WebGL has no measured budget yet.
- **Accessibility:** reduced-motion fallback still scales selected glyphs; new GSAP and Canvas behavior must obey the existing pause control and user preference.

## Proposed creative system

The recurring visual should be **an idea becoming a shared plan, then a usable outcome**. Use the brand's line-drawn path as a connecting thread, not a new slider on every page. Give each public page its own visual grammar:

1. **Home — invitation:** the existing paper/window illustration stays. One line leads the eye toward the first service choice. State who the agency serves and what begins after the first message.
2. **Services — tangible choices:** a low-poly, orthographic Three.js object responds to category choice. It has paper, ink, blue glass, mint and sand materials matching current SVGs. The text and links stay in the DOM, so the scene is an enhancement.
3. **How We Work — evidence of control:** the sticky desk becomes the visual record of five decisions. GSAP transitions the artifact as each complete chapter crosses a deliberate reading point. The business map should become user-led or show one clear final relationship among strategy, business and build.
4. **About — people and trust:** studio illustration reveals on entry, followed by real team facts and contact expectations. No fabricated projects, logos, metrics, testimonials, or response times.
5. **Service details — distinct demonstrations:** website composition, workflow connection, and maintenance lifecycle each use different motion that explains the service. Do not repeat one template or canvas.

Before final copy, the agency needs to supply: target client types and markets, exact business-service offerings, consultancy outputs, team names/roles and locations allowed for publication, genuine work examples, contact channel and response expectations, and approved legal text. The existing Argentina/India operating context should be described only as accurately confirmed by the owners.

## Integration boundaries

- Current app uses React 19, Next.js 16.3.7, and Motion 13; neither GSAP nor Three.js is installed. React Three Fiber's current stable React 19 pairing is v9. Use the current installed Next.js docs before implementation.
- Scope GSAP with `@gsap/react` / `useGSAP()` so timelines and ScrollTriggers clean up on route changes. Use `gsap.matchMedia()` for desktop/mobile/reduced-motion variants. ScrollTrigger supports scrub and pin, but this project should use only one long-form scroll narrative initially. [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) · [GSAP context and React cleanup](https://gsap.com/docs/v3/GSAP/gsap.context%28%29/) · [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/)
- Use one lazy client-side React Three Fiber island on `/services`. Keep server-rendered headings, descriptions and links outside Canvas, reserve its layout space, and provide a visual fallback for WebGL failure, reduced motion, data saver, and small screens. Render on demand when the scene is idle, cap pixel ratio, and stop work offscreen. [R3F React compatibility](https://r3f.docs.pmnd.rs/getting-started/installation) · [R3F on-demand rendering](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- Do not let GSAP and Motion write `transform` or `opacity` on the same element. The existing `useMotionPreference` and `useSceneMotion` decisions need a shared adapter so the pause control affects GSAP and Canvas too.
- Keep the five process chapters and all service copy in semantic HTML. A canvas cannot be the only source of information for search engines, screen readers, or users without WebGL.
- Validate at desktop, 768px, 390px and 320px; test Spanish and English, light/dark, keyboard, reduced motion, pausing, touch, WebGL disabled, and a mid-range mobile device. Measure before/after Core Web Vitals, bundle size, main-thread work, and frame rate before expanding the 3D surface.

## Delivery order

1. **Conversion and content:** publish legal text, finish Google Auth, verify start-project flow, and gather real business/service proof. These determine what the new narrative can truthfully say.
2. **Motion cleanup:** remove dead story/rail code and conflicting CSS; define one shared motion preference across Motion, GSAP, and Canvas.
3. **GSAP prototype on `/how-it-works`:** one reversible, accessible five-stage sequence. Compare desktop and mobile before extending it.
4. **Three.js prototype on `/services`:** one interactive scene linked to existing HTML service controls, with poster fallback and performance budget.
5. **Selective polish:** one distinct demonstration per service detail and one About studio reveal. Avoid another auto-scrolling rail.

No visual implementation should start by replacing the original home hero or adding WebGL to account, admin, form, or legal routes.
