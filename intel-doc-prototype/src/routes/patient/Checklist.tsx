import { useNavigate } from 'react-router-dom'
import PhoneFrame from '../../components/patient/PhoneFrame'
import TopHeader from '../../components/patient/TopHeader'
import TabBar from '../../components/primitives/TabBar'
import Button from '../../components/primitives/Button'
import OldAnalysesSection from '../../components/patient/OldAnalysesSection'
import NewAnalysesSection from '../../components/patient/NewAnalysesSection'
import DocumentsSection from '../../components/patient/DocumentsSection'
import ComplaintsSection from '../../components/patient/ComplaintsSection'
import AdditionalDoctorsSection from '../../components/patient/AdditionalDoctorsSection'
import MainAppointmentSection from '../../components/patient/MainAppointmentSection'
import {
  useActivePatient,
  useAnalyses,
  useAppointment,
  useComplaints,
  useDocuments,
  usePlanItems,
  usePrepComplete,
  usePrepProgress,
} from '../../store/hooks'
import { useInteldoc } from '../../store/store'
import { formatDateShort } from '../../lib/formatters'

export default function Checklist() {
  const nav = useNavigate()
  const planItems = usePlanItems()
  const analyses = useAnalyses()
  const complaints = useComplaints()
  const docs = useDocuments()
  const appointment = useAppointment()
  const prepComplete = usePrepComplete()
  const progress = usePrepProgress()
  const patient = useActivePatient()

  // Defensive read for plan meta (doctor + sent date)
  const planMeta = useInteldoc((s) => {
    if (!patient) return null
    const req = s.doctorRequests
      .filter((r) => r.patientId === patient.id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0]
    if (!req) return null
    const doctor = s.doctors.find((d) => d.id === req.fromDoctorId)
    return {
      doctorName: doctor?.name,
      sentLabel: `получен ${formatDateShort(req.createdAt)}`,
    }
  })

  return (
    <PhoneFrame>
      <TopHeader title="Подготовка" />

      <div className="flex-1 overflow-y-auto px-5 pb-[110px] flex flex-col gap-5">
        {/* Top progress card — gives the user a calm overall sense */}
        <div className="rounded-2xl bg-surface-sunken p-5 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] font-bold uppercase tracking-caps text-cyan-500">
              Подготовка к приёму
            </p>
            <span className="text-caption text-ink-muted font-data">
              {progress.label}
            </span>
          </div>
          <div className="h-2 rounded-full bg-white overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-500 ease-out"
              style={{
                width: `${
                  (progress.done / Math.max(progress.total, 1)) * 100
                }%`,
              }}
            />
          </div>
          <p className="text-caption text-ink-muted leading-relaxed">
            {prepComplete
              ? 'Вы готовы к приёму. Осталось подтвердить запись.'
              : 'Двигайтесь по разделам в удобном порядке. Можно вернуться позже — ничего не потеряется.'}
          </p>
        </div>

        {/* Назначил врач — plan-driven new analyses (specs 005–010) */}
        <NewAnalysesSection items={planItems} planMeta={planMeta} />

        {/* Документы (specs 011–015) */}
        <DocumentsSection documents={docs} />

        {/* Жалобы (specs 016–018) */}
        <ComplaintsSection complaints={complaints} />

        {/* Какие ещё врачи (specs 019–021) */}
        <AdditionalDoctorsSection />

        {/* Старые анализы (specs 001–004) */}
        <OldAnalysesSection analyses={analyses} />

        {/* Основная запись (specs 022–025) */}
        <MainAppointmentSection appointment={appointment} prepComplete={prepComplete} />

        {/* Completion banner */}
        {prepComplete && !appointment && (
          <div className="rounded-2xl bg-cyan-500 text-white p-5 shadow-lg">
            <p className="text-[10px] font-bold uppercase tracking-caps text-white/85 mb-1">
              Подготовка завершена
            </p>
            <p className="text-[18px] font-bold leading-tight mb-3">
              Вы готовы к приёму
            </p>
            <Button
              variant="secondary"
              full
              onClick={() => nav('/patient/book')}
              className="bg-white !text-cyan-500 shadow-none"
            >
              Записаться к основному врачу
            </Button>
          </div>
        )}
      </div>

      <TabBar />
    </PhoneFrame>
  )
}
