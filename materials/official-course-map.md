# learn-ai-design-with-phoebe - official source map

Two tracks, 16 sessions. Leader track (a1-a6) for design, brand and creative leads. Designer
track (b1-b10) for working designers and design-adjacent builders. Running product: **Cadence**,
the AI meeting-notes app used across the Finance / Marketing / Branding / Leadership / Content
tracks. Running artifact: **the shared-summary feature**, brief to spec'd screen set.

Signature interactive: **`assets/design-live.js`** - the critique lab. It renders a real Cadence
screen and measures it for real. Verified live in-browser before fan-out.

**Re-verify before delivery.** Tool features and credit systems in this space change monthly.
Every tool fact below was fetched from official documentation on **2026-08-08**; treat anything
about pricing, credits or beta status as needing a re-check at delivery time.

---

## The lab's canon numbers (verified in-browser, do not edit without re-running)

| Rung | Levers on | Score |
|---|---|---|
| 0 | none - "AI first draft" | **17 / 100** |
| 1 | + hierarchy | **32** |
| 2 | + type scale | **46** |
| 3 | + spacing | **66** |
| 4 | + contrast | **86** |
| 5 | + one accent - "art-directed" | **100** |
| anti | + add colour | **81 (-19)** |

What is real vs scripted (state this honestly on every page that embeds the lab): the starting
draft is a scripted composite of unbriefed generator output. Every score is measured live -
contrast ratios computed with the WCAG 2.1 relative-luminance formula, spacing and font sizes read
from `getComputedStyle`, hue families counted by converting each rendered colour to HSL.

Measured checks and weights: contrast 25%, spacing rhythm 20%, type scale 20%, hierarchy 20%,
colour restraint 15%. Anti-lever mechanism: adds a fourth hue family, two off-grid paddings, and a
yellow-on-yellow highlight at 1.5:1.

---

## Craft standards (the judgement layer)

Verified: **WCAG 2.2** is the standard to design and argue against.

- **SC 1.4.3 Contrast (Minimum), AA** - 4.5:1 for normal text, 3:1 for large text. Large = 18pt
  (24px), or 14pt (18.66px) when bold. Weight and size decide, not role.
- **SC 1.4.11 Non-text Contrast, AA** - 3:1 for UI component boundaries/states and meaningful
  graphics. This is why a pale button outline is a defect.
- **SC 1.4.6 Contrast (Enhanced), AAA** - 7:1, and 4.5:1 for large text.
- **SC 1.4.12 Text Spacing, AA** - layout must survive user overrides (line height 1.5x font size,
  paragraph spacing 2x).
- **SC 2.5.8 Target Size (Minimum), AA** - 24x24 CSS px minimum, with exceptions.
- **APCA / WCAG 3** - draft work, not a standard. Design to 2.2 for anything you must defend.

Conventions, and label them as conventions on the pages:
- One modular ratio for the type scale (the lab uses 1.25: 12 / 14 / 16 / 20 / 25 / 31 / 39).
- One spacing unit (the lab uses 8px). Widely shared convention, not a formal spec.
- "One loudest thing" - the largest, heaviest, highest-contrast element wins first read; two
  competing means neither does.

**Design tokens** - the W3C Design Tokens Community Group format's stable version is **2025.10**,
a Final Community Group Report (published 2025-10-28), explicitly **not a W3C Standard**. Cite
`https://www.designtokens.org/TR/2025.10/format/` - the older `tr.designtokens.org/format/` URL now
redirects to an unstable living draft that says "do not attempt to implement this version".
Tokens Studio supports both DTCG (`$`-prefixed) and legacy formats and exports to Figma Styles
and Variables.

---

## Tool universe (verified 2026-08-08 from official docs)

### Figma
- Current AI feature names: **First Draft** (not "Make Design"), Rename layers, Replace content,
  Add interactions, rewrite/translate/shorten, Adjust tone, Make image, Edit image with prompt,
  Remove background, Expand image, Isolate/erase object, Vectorize image, Boost resolution,
  AI search. "AI text suggestions" is retired.
- **Figma agent** (beta from 2026-05-20) is becoming the entry point for First Draft functionality.
  Config 2026 additions in open beta: custom skills, web search, file attachments, verified partner
  MCP connectors.
- **Figma Make** GA 2026-07-24 (publishing still beta). Figma Motion, custom shader effects,
  generative plugins, Weave tools: open beta. Code layers: closed beta.
- Seats: AI features generally need a **Full seat on a paid plan**; View/Collab/Dev can try them in
  Draft files. **Starter plans do not include Figma AI.**
- **AI credits** are the real constraint. Full seat/month: Starter 500 (150/day cap), Professional
  3,000, Organization 3,500, Enterprise 4,250. Dev/Collab/View 500/mo on all plans. No rollover,
  not shareable. Zero-credit: AI search, Rename layers. Sample costs: remove background 1-5,
  vectorize 2-5, boost resolution 5-10, Make image 2-16, Add interactions 20, **Figma Make 30 to
  100+ per task**. Pay-as-you-go $0.03/credit with a spend cap. Betas consume 0 credits.
- **Content training**: two toggles (Content training, AI features). Default **on** for Starter and
  Professional teams, **off** and not toggleable on Organization and Enterprise. Policy effective
  2024-08-15. Education and Government accounts excluded.
- Figma Make's model picker names Gemini, Claude and GPT models; the default is deliberately
  unnamed and "may change over time".
- Conflict to acknowledge rather than resolve: official Figma pages disagree on whether the agent
  is Enterprise-only or Pro/Org/Ent Full seat.

### Adobe
- **Firefly Image Model 5** - announced public beta at MAX Oct 2025, listed as generally available
  by Mar 2026; native 4MP generation, powers Prompt to Edit. Firefly Audio and Speech models in
  public beta. **Firefly Custom Models** public beta Mar 2026, private by default. Firefly Boards
  GA worldwide since 2025-09-24.
- Firefly now hosts **30+ partner models** (Google, Runway, Kling, OpenAI, Black Forest Labs,
  ElevenLabs, Topaz, Moonvalley) alongside Adobe's own.
- Photoshop: Generative Fill, Generative Expand, Remove Tool, Harmonize, Reference Image for
  Generative Fill - GA, 2K output. Model picker includes Adobe **and partner** models.
- Illustrator: Generative Recolor, Generative Shape Fill, Text to Pattern / Generate Patterns.
- **"Commercially safe" in Adobe's own framing**: the first Firefly model was "trained on Adobe
  Stock images, openly licensed content, and public domain content where copyright has expired" and
  is "designed to generate images safe for commercial use" - a **design goal, not a warranty**.
  Critically, for partner models Adobe states it **cannot verify commercial safety** and points to
  the partner's terms. Teach that distinction explicitly.
- **Indemnification is purchased, not automatic**: enterprise customers "may purchase an entitlement
  that comes with contractual IP indemnification for select Firefly outputs", scoped by published
  lists of eligible features, surfaces and export events. Exact conditions unverified (Adobe's
  enterprise legal FAQ PDF was unreachable) - say so rather than guessing.
- **Content Credentials** are applied automatically where 100% of pixels are Firefly-generated and
  on the Firefly web app and APIs; elsewhere opt-in (Photoshop: Window - Content Credentials).
- **Generative credits**: renew monthly; most standard features 1 credit per generation. Reported
  tiers include Creative Cloud Pro 4,000/mo and new single-app plans at 25/mo. Exact full table and
  exhaustion behaviour unverified - and a live "unlimited generations" promotion distorts the math.
  Flag as "check today's page" on the page rather than teaching a number.

### C2PA / provenance
- Current spec version **2.4**. The C2PA **Conformance Program** launched mid-2025 with a Trust
  List; the Interim Trust List **froze on 2026-01-01** ("no new entries will be added"). CAI reports
  6,000+ members. Capture-side signing shipping in some phones and cameras.
- What it proves: a signed history of how an asset was made and edited. What it does not prove:
  that an unsigned asset is fake, or that a signed asset is truthful.

### Canva
- Naming has moved from "Magic" to **Canva AI**. Still-current Magic names: Magic Media, Magic
  Write, Magic Grab, Magic Video, Magic Edit, Magic Design, Magic Resize. **"Magic Switch" is no
  longer a help-centre feature** - its functions are documented as Magic Resize, Translate and
  Transform into Doc.
- **Canva AI 2.0** launched 2026-04-16 as a research preview on Canva's in-house Design Model,
  adding conversational design, agentic orchestration, Memory Library, connectors, Canva Code 2.0,
  Sheets AI.
- Free vs paid is now a **shared credit pool across three quality tiers** (Standard / Premium /
  Ultra) rather than per-feature counts. Free 200 Standard or 20 Premium, no Ultra. Pro/Teams
  2,000 / 200 / 20. Business and Enterprise 4,000 / 400 / 40. Per member, never pooled. Magic
  Resize is metered and not on Free. **Canva Teams is closed to new sign-ups** - the ladder is
  Free / Pro / Business / Enterprise.
- Rights: "you own your Output, except for any Output that modifies or incorporates Licensed
  Content"; outputs may not be unique; Canva recommends independent advice before commercial use.
  Training use is governed by Privacy Settings.
- Brand Kits: Free 1 (3 colours), Pro 5, Business 100 with approvals, Enterprise 1000.

### Midjourney
- **Current default version is V8.2** (default since 2026-07-24). V8.1 added HD 2048px via
  `--hd`/`--sd` and does not support Turbo. Niji 7 shipped 2026-01-09.
- Consistency parameters, exact: `--sref <url|code|random>` style reference with `--sw 0-1000`
  (default 100) and `--sv` style-reference model; `--cref` + `--cw 0-100` is **V6 only**;
  **`--oref` Omni Reference (V7+) takes one image, `--ow 1-1000` (stay below 400), and costs 2x GPU
  time**; `--p` personalization profiles must be unlocked by rating images; moodboards `--p mID`
  cannot be combined with `--sv` or `--sw`; `--stylize 0-1000`.
- Docs are explicit about limits: `--sref` "doesn't copy objects or people, just the overall style";
  style codes come from Midjourney's library and **you cannot create a style code from an uploaded
  image**; references are used "as inspiration ... not to copy them exactly". Teach this - it is the
  honest answer to "make it look exactly like our brand".
- Plans: Basic $10 (3.3 fast GPU hours = 200 min, no Relax), Standard $30 (15h + unlimited Relax),
  Pro $60 (30h, Stealth), Mega $120 (60h, Stealth). Fast time does not roll over. Commercial terms
  are the same across tiers **except** companies grossing over $1M USD/yr must be on Pro or Mega.
- `--exp` appears in the compatibility chart with no documented spec. Do not teach a number for it.

### Prompt-to-UI tools - what each actually outputs
| Tool | Real artifact | Where it lands |
|---|---|---|
| **v0** (Vercel) | Production Next.js/React/TS/Tailwind/shadcn code, one-click deploy, optional Supabase/Neon/Upstash backend, REST API | Dev handoff and production. Once GitHub is connected it becomes the source of truth |
| **Lovable** | Full-stack app (new apps from 2026-05-13 use TanStack Start with SSR; older React+Vite), hosted URL, zip or Git sync | Production for small/internal apps; genuinely exportable |
| **Framer AI** | Editable native Framer pages/components, published Framer site. **No documented code export** | Marketing/CMS site - a destination, not a handoff |
| **Claude Artifacts** | Single self-contained React/HTML/SVG page, no backend, outside data only via MCP connectors | Concept prototype / interactive spec / stakeholder demo |
| **Figma Make** | Working prototype plus Download code zip, one-way GitHub push, `*.figma.site` publish, paste-back as Figma layers | In-Figma prototyping; both bridges are lossy |

Gates worth naming: v0 Free is 7 messages/day and Figma import needs a paid plan; Lovable prices by
credits with unlimited workspace members; Framer plans are **per-site** with a workspace-shared
credit pool; Figma Make code editing needs a Full seat on a paid plan and its GitHub push is
one-way ("if you edit your code in GitHub, those changes won't appear in Figma Make and will be
overwritten next time you push"); pasting Make output back into Design produces layers that "aren't
automatically tied to your design system".

### Design-system-aware generation (b6 and b9 material)
- **Figma Code Connect** bridges codebase and Dev Mode; needs a Dev or Full seat on Organization or
  Enterprise. **Hard deadline: framework-specific parsers lose updates and support from 2026-08-17;
  template files become the only maintained path.**
- **Figma MCP server** (formerly "Dev Mode MCP server"): remote `https://mcp.figma.com/mcp` or
  desktop `http://127.0.0.1:3845/mcp`. Token-relevant tools: `get_design_context` (replaced
  `get_code`), **`get_variable_defs`** (variables/styles in the selection), `get_code_connect_map`,
  `get_code_connect_suggestions`, remote-only `search_design_system`.
- **The Figma variables REST API is Enterprise-only** ("you must have a Full seat in an Enterprise
  org"). Below Enterprise, selection-scoped `get_variable_defs` via MCP is the only token route.
  This is the single most important constraint for anyone planning token automation.
- **v0 Design Systems 2.0** stores your system as a "skill" - an adapter naming where the source
  lives and which components, props and tokens are safe to use. Sources: GitHub repos, npm packages,
  Figma frames, Storybook/docs links, screenshots. Writes `v0.json`. (`registry.json` is the legacy
  path here.)
- **shadcn registry**: `registry.json` → `shadcn build` → serve at `/r/[NAME].json` →
  `shadcn add <url>`. `shadcn mcp init --client ...` for multi-registry access. "Open in v0" does
  not support `cssVars`, `css`, `envVars`, namespaced registries or advanced auth.
- Official vendor MCP servers exist for Storybook, MUI, Chakra (`get_theme`), Ant Design
  (`antd_token`) and Adobe React Spectrum. **There is no official Google/Material 3 MCP server** -
  those are community-maintained.

---

## Per-session coverage

Legend: ✓ taught to the working 80% · ◐ partial, deliberately

| Session | Sources covered | Depth |
|---|---|---|
| **a1** What AI changes | Tool capability map, where cost collapses vs where it does not, credit economics as the real constraint | ◐ tool detail deferred to a3 |
| **a2** Taste is the moat | The measurable/judgement split, homogenisation of generated output, the review standard | ✓ |
| **a3** Tool + workflow map | Figma / Adobe / Canva / Midjourney / prompt-to-UI - what each outputs, seat and credit gates, training defaults | ✓ verified feature names + gates |
| **a4** IP, provenance, brand risk | Registrability of AI-assisted work, vendor indemnity scope, C2PA 2.4 and the frozen interim trust list, synthetic-content transparency duties | ✓ where verified, gaps stated |
| **a5** Craft and careers | Where juniors used to learn, portfolio review under AI, ladder design | ◐ no hiring-data claims beyond what is cited |
| **a6** Rollout and quality | Quality-not-volume metrics, review ritual, guardrails, 12-month plan | ✓ |
| **b1** Designer's AI loop | The five-step loop, four levers, WCAG 1.4.3, the lab's full ladder | ✓ hand-authored template page |
| **b2** Art-direction prompting | Constraint briefs, reference discipline, Midjourney reference params and their documented limits | ✓ |
| **b3** Research + moodboards | Divergent exploration, Firefly Boards, homogenisation defences, moodboards with a position | ✓ |
| **b4** UI drafting | Prompt-to-UI outputs and where they land, the states generated work forgets | ✓ |
| **b5** Critique lab | WCAG 1.4.3 / 1.4.11 / 1.4.6 / 1.4.12 / 2.5.8 by number, APCA status, AI-as-reviewer prompt and its failure modes | ✓ hand-authored signature page |
| **b6** Systems and tokens | DTCG 2025.10 status, Figma variables API Enterprise limit, MCP `get_variable_defs`, Code Connect deadline, v0 skills, shadcn registry | ✓ |
| **b7** Illustration + imagery | Style/character/omni reference mechanics, Firefly commercial-safety framing and the partner-model carve-out, Content Credentials | ✓ |
| **b8** Content design + microcopy | Words as interface, AI-disclosure copy, empty/error states | ◐ platform copy guidelines referenced, not reproduced |
| **b9** Handoff to code | Specs, Code Connect and MCP token access, AI-assisted front-end drafts, design-to-shipped gap | ✓ |
| **b10** Capstone | Everything, scored: 100 on the lab plus a stated idea | ✓ |

## Not covered, by design

- Certificates, official tool training and vendor exams - linked, not reproduced.
- 3D, motion design and video generation beyond a mention (Firefly Video, Figma Motion are named in
  a3 only).
- Legal advice. a4 teaches the shape of the risk and what to ask counsel, with gaps flagged where
  primary sources were unreachable.
- Front-end engineering. b9 covers handoff quality, not how to build the component.
