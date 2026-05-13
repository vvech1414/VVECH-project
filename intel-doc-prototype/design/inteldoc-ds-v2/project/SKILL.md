---
name: inteldoc-design
description: Use this skill to generate well-branded interfaces and assets for IntelDoc, either for production or throwaway prototypes / mocks / slides. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping the IntelDoc patient app, IntelDok doctor cockpit, and pitch-deck style slides.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files:

- `colors_and_type.css` — every token (colors, type ramp, spacing, shadows, motion). Import this in any new HTML you produce.
- `assets/` — the Vasiliy mascot PNG, founder portrait, hero phone render. Copy, don't redraw.
- `preview/` — small spec cards, one per concept. Use as reference to understand what each token looks like rendered.
- `ui_kits/mobile/` — working patient-app primitives and screens (Manrope, `#006FFD`, white/blue-tinted cards).
- `ui_kits/cockpit/` — directional cockpit primitives. Flag to the user that this surface is under-specified.
- `slides/` — deck style (cyan `#DCF2FF` background, black 2.5px top rule, Montserrat Alternates 114–140px headlines, pill CTAs, `#476DF6` action blue).

Note the two product surfaces use **different blues**: mobile app & cockpit = `#006FFD`; pitch deck = `#476DF6`. Don't cross them.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask a couple of focused questions (which surface: mobile / cockpit / deck? which audience: patient / clinician / investor? any real content or placeholders?), and act as an expert designer who outputs HTML artifacts *or* production code, depending on the need.
