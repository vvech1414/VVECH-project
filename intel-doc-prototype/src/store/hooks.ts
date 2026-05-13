import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useInteldoc } from './store'
import * as selectors from './selectors'
import type { ID, PlanItem, PlanItemStatus } from './types'

/**
 * Selector hooks. Use `useShallow` for selectors that return arrays of
 * stable store references (each item is the same object across renders).
 * Compose grouped views with `useMemo` so the inner equality check is shallow.
 */

export const useActivePatient = () => useInteldoc(selectors.selectActivePatient)
export const useDoctorActivePatient = () =>
  useInteldoc(selectors.selectDoctorActivePatient)
export const useAppointment = (patientId?: ID | null) =>
  useInteldoc((s) => selectors.selectAppointmentForPatient(s, patientId ?? s.currentPatientId))
export const usePrepComplete = () => useInteldoc(selectors.selectPrepIsComplete)

// ─── Flat collection hooks (filtered arrays of store-stable refs) ───────────

export const useUnseenRequests = () =>
  useInteldoc(useShallow(selectors.selectUnseenRequests))

export const useRequestsForPatient = (patientId: ID) =>
  useInteldoc(useShallow((s) => selectors.selectRequestsForPatient(s, patientId)))

const usePlanItemsFlat = (patientId?: ID | null) =>
  useInteldoc(
    useShallow((s) =>
      s.planItems.filter(
        (p) => p.patientId === (patientId ?? s.currentPatientId),
      ),
    ),
  )

/** Plan items grouped by status — derived once per change to the flat list. */
export const usePlanItems = (
  patientId?: ID | null,
): Record<PlanItemStatus, PlanItem[]> => {
  const flat = usePlanItemsFlat(patientId)
  return useMemo(
    () => ({
      assigned: flat.filter((p) => p.status === 'assigned'),
      uploaded: flat.filter((p) => p.status === 'uploaded'),
      acknowledged: flat.filter((p) => p.status === 'acknowledged'),
    }),
    [flat],
  )
}

export const useAnalyses = (patientId?: ID | null) =>
  useInteldoc(
    useShallow((s) =>
      s.analyses
        .filter((a) => a.patientId === (patientId ?? s.currentPatientId))
        .slice()
        .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1)),
    ),
  )

export const useDocuments = (patientId?: ID | null) =>
  useInteldoc(
    useShallow((s) =>
      s.documents.filter(
        (d) => d.patientId === (patientId ?? s.currentPatientId),
      ),
    ),
  )

/** Plan items overdue right now: assigned status + dueDate in the past. */
export const useOverduePlanItems = (patientId?: ID | null) => {
  const flat = usePlanItemsFlat(patientId)
  return useMemo(() => {
    const now = new Date().toISOString()
    return flat.filter(
      (p) => p.status === 'assigned' && p.dueDate !== undefined && p.dueDate < now,
    )
  }, [flat])
}

/** Access grants whose explicit expiry has passed and that were not revoked. */
export const useExpiredAccessGrants = (patientId?: ID | null) => {
  const flat = useInteldoc(
    useShallow((s) =>
      s.accessGrants.filter(
        (g) => g.patientId === (patientId ?? s.currentPatientId),
      ),
    ),
  )
  return useMemo(() => {
    const now = new Date().toISOString()
    return flat.filter(
      (g) => !g.revokedAt && g.expiresAt !== undefined && g.expiresAt < now,
    )
  }, [flat])
}

export const useComplaints = (patientId?: ID | null) =>
  useInteldoc(
    useShallow((s) =>
      s.complaints.filter(
        (c) => c.patientId === (patientId ?? s.currentPatientId),
      ),
    ),
  )

// ─── Object-shaped selectors → split into primitive selections ──────────────

export const useDocumentReadiness = () => {
  const docs = useDocuments()
  return useMemo(() => {
    const REQUIRED: Array<'passport' | 'oms'> = ['passport', 'oms']
    const uploaded = REQUIRED.filter((req) =>
      docs.some((d) => d.type === req),
    ).length
    const total = REQUIRED.length
    return { uploaded, total, percent: Math.round((uploaded / total) * 100) }
  }, [docs])
}

export const usePrepProgress = () => {
  const planItems = usePlanItems()
  const analyses = useAnalyses()
  const complaints = useComplaints()
  const docsReadiness = useDocumentReadiness()
  const appointment = useAppointment()
  return useMemo(() => {
    const planEverIssued =
      planItems.assigned.length +
      planItems.uploaded.length +
      planItems.acknowledged.length >
      0
    const buckets = [
      planItems.assigned.length === 0 &&
        planItems.uploaded.length + planItems.acknowledged.length > 0,
      docsReadiness.uploaded === docsReadiness.total,
      complaints.length > 0,
      analyses.length > 0,
      !!appointment,
    ]
    const considered = buckets.slice(0, planEverIssued ? 5 : 4)
    const done = considered.filter(Boolean).length
    const total = considered.length
    return { done, total, label: `${done} из ${total}` }
  }, [planItems, analyses, complaints, docsReadiness, appointment])
}
