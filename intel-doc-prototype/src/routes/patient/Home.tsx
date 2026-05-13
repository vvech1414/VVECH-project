import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileText,
  MessageSquareText,
  TestTube2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PhoneFrame from '../../components/patient/PhoneFrame'
import TopHeader from '../../components/patient/TopHeader'
import PrepBanner from '../../components/patient/PrepBanner'
import VasilyBlock from '../../components/patient/VasilyBlock'
import VasilyMascot from '../../components/system/VasilyMascot'
import ServicesCarousel from '../../components/patient/ServicesCarousel'
import TabBar from '../../components/primitives/TabBar'
import {
  useActivePatient,
  useAnalyses,
  useAppointment,
  useComplaints,
  useDocumentReadiness,
  usePlanItems,
  usePrepProgress,
} from '../../store/hooks'
import { formatAppointmentLead, formatDateShort } from '../../lib/formatters'

export default function Home() {
  const nav = useNavigate()
  const patient = useActivePatient()
  const firstName = patient?.name.split(' ')[0] ?? 'Анна'
  const appointment = useAppointment()
  const analyses = useAnalyses()
  const complaints = useComplaints()
  const docsReady = useDocumentReadiness()
  const plan = usePlanItems()
  const progress = usePrepProgress()

  const agenda = [
    {
      key: 'docs',
      icon: <FileText size={17} strokeWidth={2.2} />,
      title: 'Документы для ЭНЦ',
      body: `${docsReady.uploaded} из ${docsReady.total} загружено`,
      done: docsReady.uploaded === docsReady.total,
    },
    {
      key: 'analyses',
      icon: <TestTube2 size={17} strokeWidth={2.2} />,
      title: 'Анализы',
      body:
        plan.assigned.length > 0
          ? `${plan.assigned.length} ожидает загрузки`
          : analyses.length > 0
          ? `${analyses.length} сохранено в истории`
          : 'добавьте первый результат',
      done: plan.assigned.length === 0 && analyses.length > 0,
    },
    {
      key: 'complaints',
      icon: <MessageSquareText size={17} strokeWidth={2.2} />,
      title: 'Вопросы и жалобы',
      body:
        complaints.length > 0
          ? `${complaints.length} заметка для врача`
          : 'запишите, что важно обсудить',
      done: complaints.length > 0,
    },
  ]
  const nextKey = agenda.find((row) => !row.done)?.key ?? null
  const allDone = agenda.every((r) => r.done)
  const previewHasContent =
    analyses.length > 0 || complaints.length > 0 || docsReady.uploaded > 0

  const contextLine = !appointment
    ? 'Запланируем приём — и я помогу подготовиться к нему.'
    : allDone
    ? 'Вы готовы к приёму в ЭНЦ. Можно выдохнуть.'
    : (() => {
        const lead = formatAppointmentLead(appointment.date)
        if (lead === 'Сегодня') return 'Сегодня приём в ЭНЦ. Я рядом.'
        if (lead === 'Завтра')
          return 'Завтра приём в ЭНЦ. Финишируем подготовку.'
        return `До приёма в ЭНЦ — ${lead.toLowerCase()}. Помогу подготовиться.`
      })()

  const prepHeading = appointment
    ? allDone
      ? 'Подготовка завершена'
      : `Подготовка к приёму ${formatDateShort(appointment.date)}`
    : progress.done === 0
    ? 'Подготовка к приёму'
    : 'Продолжите подготовку'

  return (
    <PhoneFrame>
      <TopHeader showPartner />

      <div className="flex-1 overflow-y-auto px-5 pb-[108px] flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <p className="text-h2-ui font-bold text-ink-strong leading-tight">
              Здравствуйте, {firstName}
            </p>
            <p className="text-[14px] text-ink-muted leading-snug">
              {contextLine}
            </p>
          </div>
          <VasilyMascot size={64} halo className="flex-shrink-0" />
        </div>

        <PrepBanner />

        <section className="rounded-2xl bg-white p-4">
          {appointment ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-emerald-700">
                  <Calendar size={22} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-caps text-emerald-700">
                    Приём запланирован
                  </p>
                  <p className="text-[15px] font-bold text-ink-strong leading-tight font-data">
                    {formatDateShort(appointment.date)}
                  </p>
                </div>
              </div>
              {previewHasContent && (
                <button
                  onClick={() => nav('/patient/history')}
                  className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl bg-surface-sunken px-3 py-2.5 text-left hover:bg-cyan-50/60 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted">
                      Что увидит врач
                    </p>
                    <p className="truncate text-[13px] text-ink-strong">
                      Анализы — {analyses.length} · Документы — {docsReady.uploaded}/
                      {docsReady.total} · Жалобы — {complaints.length}
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="flex-shrink-0 text-ink-muted"
                    strokeWidth={2}
                  />
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => nav('/patient/book')}
              className="flex w-full items-center gap-3 text-left active:scale-[0.99] transition-transform"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                <CalendarDays size={22} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted">
                  Приём
                </p>
                <p className="text-[15px] font-bold text-ink-strong leading-tight">
                  Запишитесь к основному врачу
                </p>
                <p className="text-caption text-ink-muted mt-0.5">
                  Дата задаст ритм подготовки.
                </p>
              </div>
              <ChevronRight
                size={18}
                className="flex-shrink-0 text-cyan-500"
                strokeWidth={2.3}
              />
            </button>
          )}
        </section>

        <section className="rounded-2xl bg-white p-4">
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <p className="text-[15px] font-bold text-ink-strong leading-tight">
              {prepHeading}
            </p>
            <span className="text-[12px] text-ink-muted font-data flex-shrink-0">
              {progress.done}/{progress.total}
            </span>
          </div>
          {!appointment && !allDone && (
            <p className="text-caption text-ink-muted mb-2 leading-snug">
              Можно начать заранее — финал зависит от даты приёма.
            </p>
          )}
          <div className="h-1.5 rounded-full bg-surface-sunken overflow-hidden mb-3 mt-2">
            <div
              className="h-full bg-cyan-500 transition-all duration-500 ease-out"
              style={{
                width: `${(progress.done / Math.max(progress.total, 1)) * 100}%`,
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            {agenda.map((row) => (
              <AgendaRow
                key={row.key}
                icon={row.icon}
                title={row.title}
                body={row.body}
                done={row.done}
                next={row.key === nextKey}
                onClick={() => nav('/patient/checklist')}
              />
            ))}
          </div>
          <button
            onClick={() => nav('/patient/checklist')}
            className="mt-3 flex w-full items-center justify-between rounded-xl border border-cyan-100 bg-white px-3 py-2.5 text-left active:scale-[0.99] transition-transform"
          >
            <span className="text-[13px] font-bold text-cyan-600">
              Все шаги подготовки
            </span>
            <ChevronRight
              size={16}
              strokeWidth={2.3}
              className="text-cyan-500"
            />
          </button>
        </section>

        <VasilyBlock />

        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted px-1">
            Полезные сервисы
          </p>
          <ServicesCarousel />
        </div>
      </div>

      <TabBar />
    </PhoneFrame>
  )
}

function AgendaRow({
  icon,
  title,
  body,
  done,
  next,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  body: string
  done: boolean
  next: boolean
  onClick: () => void
}) {
  const rowBg = done
    ? 'bg-[#ECFDF5]'
    : next
    ? 'bg-cyan-50 ring-1 ring-cyan-100'
    : 'bg-surface-sunken'
  const iconBg = done
    ? 'bg-emerald-100 text-emerald-700'
    : next
    ? 'bg-cyan-500 text-white shadow-[0_2px_8px_rgba(6,182,212,0.35)]'
    : 'bg-white text-ink-muted'
  const titleClass =
    done || next
      ? 'text-[13px] font-bold text-ink-strong leading-snug'
      : 'text-[13px] font-semibold text-ink-strong/70 leading-snug'
  const bodyClass =
    done || next
      ? 'text-caption text-ink-muted leading-snug mt-0.5'
      : 'text-caption text-ink-muted/80 leading-snug mt-0.5'
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left active:scale-[0.99] transition-transform ${rowBg}`}
    >
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className={titleClass}>{title}</p>
        <p className={bodyClass}>{body}</p>
      </div>
      {done ? (
        <CheckCircle2
          size={17}
          className="flex-shrink-0 text-emerald-600"
          strokeWidth={2.4}
        />
      ) : (
        <ChevronRight
          size={16}
          className={`flex-shrink-0 ${next ? 'text-cyan-500' : 'text-ink-muted/70'}`}
          strokeWidth={2}
        />
      )}
    </button>
  )
}
