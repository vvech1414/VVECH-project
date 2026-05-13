# patient-routes

New patient routes added during this iteration. Insert into `src/App.tsx` in
the patient surface block.

## Imports to add

```tsx
import ExtraDoctors from './routes/patient/ExtraDoctors'
```

## Route lines to add

| Path | Component | Notes |
|------|-----------|-------|
| `/patient/extra-doctors` | `<ExtraDoctors />` | Spec 020 + 021. Reads `?focus=<slug>` to pre-select the specialist tab. Submitting the picked slot routes back to `/patient/checklist`. |

## Suggested insertion position

Place directly below the existing `/patient/book` route inside the patient app
section so it remains adjacent to the related booking flows:

```tsx
<Route path="/patient/book" element={<BookMain />} />
<Route path="/patient/extra-doctors" element={<ExtraDoctors />} />
<Route path="/patient/service/:slug" element={<ServicePlaceholder />} />
```

No existing route signatures were changed.
