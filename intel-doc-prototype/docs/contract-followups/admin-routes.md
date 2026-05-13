# Admin routes — proposed mounting in `App.tsx`

The admin surface is implemented but not yet wired into the top-level router.
`App.tsx` is owned by the contract layer; the lines below are proposed for the
contract owner to copy in verbatim.

## Imports (add near the existing route imports)

```tsx
import AdminDashboard from './routes/admin/Dashboard'
import AdminDrillDown from './routes/admin/DrillDown'
```

## Routes (add inside the `<Routes>` block, alongside doctor routes)

```tsx
{/* Admin surface (aggregate-only, no PII) */}
<Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/kpi/:kpiId" element={<AdminDrillDown />} />
```

## OnboardingGate note

The admin surface is independent of patient onboarding (mirrors the doctor
cockpit). The current gate only redirects on `pathname.startsWith('/patient')
&& !isEntry`, so admin routes pass through cleanly without modification.

## Demo toolbar (optional)

If `DemoToolbar` exposes a surface switcher, add an «Админ» entry pointing at
`/admin/dashboard`. This is a UX nicety, not a contract dependency.
