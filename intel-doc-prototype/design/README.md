# IntelDoc Design References — README

## Purpose
This file explains how Claude should use the attached IntelDoc design board and related design artifacts during implementation.

## Source of truth priority
Use design references in this order:

1. `CLAUDE.md` — product and implementation rules
2. `design-system-overview.md` — interpretation of the visual language
3. attached design board image (`IntelDoc DS.png`) — visual reference
4. any additional exported screens/components placed in `/design`

## What the current design board is good for
The attached board is best used to infer:
- brand tone
- color direction
- onboarding / QR branding patterns
- general mobile UI style
- spacing and card logic
- examples of how educational and partner surfaces may look

## What the board is NOT good for
Do not treat the board as a strict pixel spec for:
- every screen layout
- spacing tokens
- exact color values
- interaction behavior
- complete component states

If exact values are missing, make reasonable assumptions and keep the style coherent.

## Key visual takeaways from the board
- dark navy brand surfaces
- bright cyan accent highlights
- white mobile app surfaces layered on top of brand identity
- rounded cards and clean mobile forms
- QR onboarding as a recurring mechanic
- mascots/characters as optional supporting trust elements

## Implementation rules
When translating the board into the prototype:

### Preserve
- calm, trustworthy medical-tech tone
- mobile readability
- partner branding context
- consistent primary actions
- low-friction forms and lists

### Avoid
- building slide-style screens inside the app
- overusing dark backgrounds for task-heavy flows
- tiny text
- decorative clutter
- copying promo collateral directly into product screens

## Recommended folder usage
Place all design artifacts under `/design` and name them clearly.

Recommended examples:
- `brand-board.png`
- `home-screen-reference.png`
- `ocr-review-reference.png`
- `buttons.png`
- `typography.png`
- `partner-entry.png`
- `logo.svg`

## If artifacts conflict with product needs
Prioritize:
1. prototype usability
2. pilot flow clarity
3. compliance-safe wording
4. accessibility
5. visual consistency

## Guidance for Claude during implementation
If a screen is not explicitly shown in the design board:
- reuse the closest existing card/button/list pattern
- keep the same brand logic
- prefer simplicity over invention
- keep the visual family consistent with the rest of the prototype

## Suggested interpretation by screen type

### Use stronger brand styling for
- QR / partner entry
- partner confirmation
- onboarding success
- educational surfaces

### Use lighter task styling for
- forms
- checklist
- OCR review
- analysis history
- plan items
- notifications

## Final note
The design board should help Claude build a coherent IntelDoc prototype, not constrain it into recreating every frame literally.
