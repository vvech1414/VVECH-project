# IntelDok Cockpit — UI Kit

Doctor-facing web cockpit for preparing visits. 1440-wide web canvas.

## Caveat
The Figma file does **not** contain a fully-designed cockpit — the IntelDok page is mostly pitch-deck mockups reusing the mobile app screens. This kit is a **directional recreation** grounded in:
- The product description (cockpit for clinicians with structured data + AI advisory)
- The visual DNA from the mobile app (same Manrope type, `#2563EB` v.1 primary, card style, chart treatment)
- Generic clinical-cockpit conventions (patient list + detail split view)

Flag this as **under-specified**. Ask the user for:
- Real cockpit Figma frames, if they exist
- Clinic-specific information architecture (which metrics, which labs, tariff/monetisation hooks)

## Files
- `index.html` — patient list → patient detail click-thru
- `Cockpit.jsx` — PatientList, PatientDetail, AIBrief, LabRow, MetricChart primitives
