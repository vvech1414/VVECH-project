import { getState, setState } from './store'
import { SEED } from './seed'
import {
  completeEntryFlow,
  openPatientRecord,
  openNotification,
  sendRequest,
  uploadAnalysis,
  uploadDocument,
  acknowledgeAnalysis,
  addComplaint,
} from './actions'

/**
 * Each segment helper jumps the store to the state expected at the START of
 * that demo segment, then returns the recommended landing route. Idempotent:
 * always begins by resetting to seed, then re-applies prior segments.
 */

export const SEGMENT_LABELS: Record<number, string> = {
  1: 'Онбординг',
  2: 'Подготовка',
  3: 'Готов к приёму',
  4: 'Уведомление',
  5: 'Запись',
}

export interface Segment {
  id: number
  label: string
  /** Returns the route to navigate to after seeding. */
  apply: () => Promise<string> | string
}

function freshStart() {
  setState({ ...SEED })
}

async function seedAnna() {
  freshStart()
  await completeEntryFlow({
    name: 'Анна Петрова',
    dob: '1973-06-15',
    gender: 'female',
    phone: '+7 (916) 555-12-01',
  })
}

async function seedPrep() {
  await seedAnna()
  // upload an HbA1c (the magic-moment analysis) and a couple of documents,
  // and add a complaint so the doctor has something to react to.
  uploadDocument({ type: 'passport', label: 'Паспорт' })
  uploadDocument({ type: 'oms', label: 'Полис ОМС' })
  addComplaint(
    'Утром сахар часто выше нормы. Иногда головокружения после нагрузок.',
  )
  await uploadAnalysis({ type: 'HbA1c' })
  // Demo enrichment: mark the HbA1c as low-confidence so the History tab
  // surfaces the «Требует проверки» guardrail badge.
  setState((s) => ({
    analyses: s.analyses.map((a) =>
      a.patientId === 'p1' && a.type === 'HbA1c'
        ? { ...a, qualityCheck: 'acceptable' as const }
        : a,
    ),
  }))
}

async function seedDoctorReady() {
  await seedPrep()
  // Doctor takes the patient over in the cockpit.
  openPatientRecord('p1')
}

async function seedRequestSent() {
  await seedDoctorReady()
  const request = sendRequest({
    title: 'Дополнительные анализы перед приёмом',
    body: 'Анна, перед приёмом нам важно увидеть актуальные значения. Загрузите, пожалуйста, результаты ниже — это займёт несколько минут.',
    items: [
      {
        analysisType: 'glucose',
        label: 'Глюкоза крови натощак',
        reason: 'Контроль текущего уровня перед визитом',
      },
    ],
  })
  // Demo enrichment: backdate the plan item due-date so the History tab
  // surfaces the «Просрочено» guardrail badge.
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const dueIso = yesterday.toISOString()
  setState((s) => ({
    planItems: s.planItems.map((p) =>
      p.requestId === request.id ? { ...p, dueDate: dueIso } : p,
    ),
  }))
}

async function seedReadyToBook() {
  await seedRequestSent()
  // Patient opened the notification, then uploaded the requested analysis
  // (linked to the plan item). Doctor then acknowledged it.
  const s = getState()
  const request = s.doctorRequests.find(
    (r) => r.patientId === 'p1' && !r.seenByPatient,
  )
  if (request) openNotification(request.id)
  const planItemId = getState().planItems.find(
    (p) => p.patientId === 'p1' && p.analysisType === 'glucose' && p.status === 'assigned',
  )?.id
  const glucose = await uploadAnalysis({ type: 'glucose', planItemId })
  acknowledgeAnalysis(glucose.id)
}

export const SEGMENTS: Segment[] = [
  {
    id: 1,
    label: SEGMENT_LABELS[1],
    apply: async () => {
      freshStart()
      return '/patient/entry/welcome'
    },
  },
  {
    id: 2,
    label: SEGMENT_LABELS[2],
    apply: async () => {
      await seedAnna()
      return '/patient/home'
    },
  },
  {
    id: 3,
    label: SEGMENT_LABELS[3],
    apply: async () => {
      await seedDoctorReady()
      return '/patient/home'
    },
  },
  {
    id: 4,
    label: SEGMENT_LABELS[4],
    apply: async () => {
      await seedRequestSent()
      return '/patient/home'
    },
  },
  {
    id: 5,
    label: SEGMENT_LABELS[5],
    apply: async () => {
      await seedReadyToBook()
      return '/patient/checklist'
    },
  },
]
