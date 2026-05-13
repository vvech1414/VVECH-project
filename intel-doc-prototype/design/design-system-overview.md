# IntelDoc Design System Overview for Claude

## Purpose
This document translates the attached IntelDoc design board into practical implementation guidance for a React prototype.

It is **not** a pixel-perfect spec. It is a working interpretation of the visual language visible in the design board and aligned with the ЭНЦ pilot product constraints. fileciteturn1file3turn1file5

## What the design board suggests
The board shows a mixed system of:
- dark blue presentation / brand canvases
- white mobile app screens framed as product examples
- bright cyan accents for emphasis and technical-medical identity
- QR-driven onboarding materials
- educational / explanatory cards
- mascots and brand characters used as optional trust/warmth elements
- rounded, minimal mobile interface patterns

This should be interpreted as:
- **brand layer** = dark, premium, trustworthy, institutional
- **product layer** = light, clean, readable, action-oriented

## Design principles

### 1. Trust before novelty
The UI should feel like:
- reliable
- calm
- medical-adjacent but not cold
- modern but not trendy

Avoid:
- loud animations
- playful clutter
- dense enterprise-style complexity

### 2. Mobile-first clarity
The patient app must be easy to understand on first use.
Use:
- clear vertical flow
- one main action per screen
- strong hierarchy
- large tap targets
- short helper text

### 3. Dark brand shell + light task surfaces
The board suggests a useful split:
- dark blue backgrounds for onboarding, branded partner entry, and explanation blocks
- white cards / sheets / mobile screens for task execution

This should be implemented as:
- **brand screens**: onboarding, partner confirmation, education highlights, QR cards
- **task screens**: forms, checklist, OCR review, history, plan

### 4. Clinical calm, not hospital bureaucracy
The design should communicate healthcare context without looking like a legacy MIS.
Prefer:
- soft borders
- rounded cards
- clean whitespace
- quiet status communication

Avoid:
- tables everywhere
- tiny fonts
- multi-column mobile layouts
- oversaturated warning colors

## Color guidance
Exact tokens are not visible with certainty from the board, so these are implementation assumptions.

### Core palette roles
- **Primary background / brand surface**: deep navy or midnight blue
- **Primary accent**: bright cyan / electric blue
- **Secondary accent**: lighter blue for highlights and selected states
- **Base content surface**: white
- **Text on white**: dark navy / charcoal
- **Text on dark**: white / pale blue-white
- **Neutral borders**: light gray-blue
- **Success**: calm green
- **Warning**: amber / muted yellow
- **Error**: restrained red

### Suggested usage
- Use dark blue mainly for hero/onboarding/partner blocks.
- Use cyan to draw attention to primary actions, status markers, and key values.
- Do not overuse bright cyan as a background for large reading surfaces.
- Keep long-form reading on white or very light surfaces.

## Typography guidance
The board implies a modern sans-serif product language.

### Typography goals
- high readability
- strong contrast between title / subtitle / body / helper text
- concise, practical tone

### Hierarchy recommendation
- **Page title**: strong, short, high-contrast
- **Section header**: clear, medium-large
- **Body**: normal reading size, spacious line height
- **Helper text**: smaller but still readable
- **Metadata**: compact, low emphasis

### Tone
Text should read like guided preparation, not marketing hype.

Good:
- «Добавьте анализ»
- «Проверьте распознанные данные»
- «Доступ активен до 12 мая»

Avoid:
- long marketing paragraphs inside app screens
- overly technical medical jargon unless necessary
- aggressive urgency language

## Spacing and layout
The board suggests relatively spacious layouts, especially on mobile examples.

### Rules
- Prefer generous vertical spacing between major blocks.
- Keep forms and action screens narrow and readable.
- Use cards to group meaningfully related items.
- Avoid stacking too many different card types on one screen.

### Mobile layout pattern
Good pattern:
1. simple header
2. one status / context card
3. 1–3 key actions
4. supporting content list
5. persistent bottom CTA if needed

## Component guidance

### Buttons
Use two main button styles:
- **Primary**: filled accent button for the main action
- **Secondary**: outlined or soft-filled neutral button

Buttons should be:
- large enough for thumbs
- clearly labeled with verbs
- visually consistent across all screens

### Cards
Cards are the main content container.
Use them for:
- partner context
- checklist steps
- analysis items
- plan items
- notifications
- access state

Card style should be:
- rounded
- lightly elevated or bordered
- readable with strong padding

### Chips / statuses
Status communication is central to this product.
Use chips for:
- access active / expired
- OCR completed / needs review
- pending / done / overdue
- structured / original only

Keep them short and color-coded but readable.

### Forms and inputs
Inputs should feel simple and low-friction.
Use:
- clear labels
- helper text only when needed
- obvious selected states
- minimal field count per screen

### Lists
Use clean list items with:
- title
- metadata line
- status chip
- chevron or action hint

This is especially important for:
- analysis history
- doctor plan
- notifications

## Brand and mascot usage
The board includes mascot elements (robot / bear) and QR-based promotional layouts.

Interpretation:
- mascots are **supporting**, not core product UI
- they may be used in onboarding, success, empty states, or promo cards
- do not place mascots in dense task screens where they distract from patient actions

Best use cases:
- QR entry card
- success screen
- educational banner
- empty state illustration

## Partner-branded onboarding guidance
The design board strongly suggests branded QR onboarding flows and partner-linked entry surfaces.

For the prototype:
- show ЭНЦ context prominently at entry
- keep partner branding visible but not overwhelming on subsequent screens
- use a partner card or header rather than a giant logo everywhere

## Screen tone guidance

### Onboarding screens
- darker brand background is acceptable
- more visual identity is acceptable
- concise reassuring copy

### Action screens
- lighter surfaces
- focus on task completion
- fewer decorative elements

### Medical data screens
- structured presentation
- status visibility
- direct actions
- minimal ambiguity

## Accessibility guidance
This prototype must be usable for adults 35–65 and should not exclude older users.

Use:
- strong contrast
- readable body sizes
- large tap targets
- enough spacing between interactive elements
- short labels
- clear primary action placement

Avoid:
- tiny secondary links as essential actions
- overly subtle borders
- pale text on complex backgrounds

## Recommended interaction tone
The interaction style should feel like:
- “we will guide you through preparation”
not
- “you are inside a complex medical operating system”

## What to preserve from the board
Preserve:
- navy + cyan identity
- QR-led partner entry motif
- clean white mobile panels
- rounded cards and simple controls
- trustworthy, institutional, non-chaotic tone

## What not to over-copy
Do not over-copy:
- presentation slides as direct app screens
- dense explanatory slide layouts inside the app
- mascot-heavy composition on functional screens
- brochure-like dark layouts for data-entry tasks

## Practical implementation priority
When implementing the React prototype, prioritize in this order:
1. screen clarity
2. hierarchy and spacing
3. status communication
4. partner context visibility
5. brand consistency
6. decorative fidelity
