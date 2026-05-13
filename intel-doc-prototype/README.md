# IntelDoc Patient Prototype

## What this repo is
This repository contains the source materials and implementation instructions for building the **IntelDoc patient app React prototype** for the **ЭНЦ pilot**.

The prototype is intended for:
- pilot presentation
- product validation
- partner discussions
- fast frontend prototyping in Claude Code

This is a **prototype repo**, not a production healthcare application.

---

## What the prototype should do
The prototype should demonstrate this core flow:

**ЭНЦ QR/link entry → partner context confirmed → consent + basic profile setup + granting access to the ЛПУ → prep home screen → visit checklist → upload analysis → document quality check → OCR review/correction → analysis history/card → receive doctor request or examination plan → notification → upload missing result / complete plan → confirm next appointment**

The prototype should communicate:
- partner-first onboarding
- preparation before visit
- OCR-based document structuring
- explicit access control
- doctor follow-up loop
- continuity via next appointment confirmation

---

## Which file Claude should use first
Claude should use the files in this order:

### 1. `CLAUDE.md`
Use this as the **main project instruction file**.
It contains:
- project guardrails
- design usage rules
- content rules
- required screens
- scope exclusions
- definition of success

### 2. `prototype-brief.md`
Use this to understand:
- product purpose
- pilot context
- user and partner logic
- in-scope prototype behavior

### 3. `screen-blueprint.md`
Use this as the **screen-by-screen implementation map**.
It defines:
- screen purpose
- key UI blocks
- CTA
- next transition

### 4. `dummy-data.md`
Use this for:
- realistic mock data
- patient names
- doctor names
- departments
- analyses
- plan items
- notifications
- statuses

---

## Where design references live
All design references live in:

`/design`

Claude should use the contents of `/design` as the visual reference source.

Important files there include:
- `README.md`
- `design-system-overview.md`
- design screenshots / boards / visual examples

Claude should prioritize:
1. interaction clarity
2. layout hierarchy
3. spacing rhythm
4. brand tone
5. decorative fidelity only when usability is preserved

---

## Working rules
- Build **patient app only**
- Use **React**
- Build **mobile-first**
- Use **mocked data and local state**
- Do **not** implement backend, real OCR, auth, payments, or full doctor UI
- Do **not** use diagnosis or treatment language
- Keep the prototype suitable for a **2–3 minute pilot demo**

---

## Goal for Claude Code
Claude Code should use this repo to generate a clean, coherent, demo-ready React prototype that is:
- believable
- simple to navigate
- visually aligned with the design system
- compliant in tone and language
- easy to iterate on
