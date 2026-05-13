import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, ClipboardList, Hospital, ShieldCheck } from 'lucide-react'
import PhoneFrame from '../../../components/patient/PhoneFrame'
import OnboardingChrome from '../../../components/patient/OnboardingChrome'
import Button from '../../../components/primitives/Button'
import { track } from '../../../lib/analytics'

const FLOW_POINTS = [
  {
    id: 'partner' as const,
    Icon: Hospital,
    title: 'Контекст ЭНЦ подтверждён',
    body:
      'Вы переходите в подготовку к визиту в отделение диабетологии.',
  },
  {
    id: 'prepare' as const,
    Icon: ClipboardList,
    title: 'Соберём нужные материалы',
    body:
      'Чек-лист подскажет, какие анализы, документы и жалобы стоит подготовить.',
  },
  {
    id: 'access_control' as const,
    Icon: ShieldCheck,
    title: 'Доступ только с вашего согласия',
    body:
      'Перед передачей данных клинике вы увидите, кто получает доступ и что именно будет доступно.',
  },
]

/**
 * Screen 1 — QR/link entry + partner context confirmation.
 * - No back arrow (this is the first visible screen on first launch).
 * - No progress indicator (pre-flow).
 * - Dark clinic-linked hero card on a light page bg per spec.
 */
export default function Welcome() {
  const nav = useNavigate()
  const enteredAt = useRef(performance.now())

  useEffect(() => {
    track({ name: 'welcome_viewed' })
    // Treat all 3 cards as in-view for the prototype (they fit on viewport).
    FLOW_POINTS.forEach((u) => track({ name: 'usp_in_view', uspId: u.id }))
  }, [])

  function next() {
    const dwellMs = Math.round(performance.now() - enteredAt.current)
    track({ name: 'welcome_cta_tapped', dwellMs })
    nav('/patient/entry/account')
  }

  return (
    <PhoneFrame>
      <OnboardingChrome />

      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-5">
        {/* Hero card (dark surface) */}
        <section className="relative rounded-2xl bg-navy-900 text-white px-5 py-6 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl"
          />

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
              <BadgeCheck size={14} className="text-cyan-300" strokeWidth={2.2} />
              <span className="text-[11px] font-semibold uppercase tracking-caps text-cyan-200">
                Приглашение от ЭНЦ
              </span>
            </div>

            <h1 className="text-h1-ui font-bold leading-tight mb-5">
              Подготовьтесь к приёму
            </h1>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-[16px] font-bold leading-snug">
                Эндокринологический научный центр
              </p>
              <p className="text-caption text-slate-300 mt-1">
                Отделение диабетологии · врач: Соколов А.В.
              </p>
            </div>

            <p className="text-body text-slate-300 leading-relaxed mt-4">
              IntelDoc поможет собрать анализы и документы перед визитом. Это не
              заменяет консультацию врача.
            </p>
          </div>
        </section>

        {/* Entry context cards */}
        <div className="flex flex-col gap-3">
          {FLOW_POINTS.map(({ id, Icon, title, body }) => (
            <article
              key={id}
              className="rounded-2xl bg-surface-sunken px-4 py-4 flex items-start gap-3"
            >
              <div className="h-11 w-11 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center flex-shrink-0">
                <Icon size={22} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-ink-strong leading-snug">
                  {title}
                </p>
                <p className="text-caption text-ink-muted leading-relaxed mt-1">
                  {body}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Info footer */}
        <div className="rounded-2xl bg-cyan-50 px-4 py-3">
          <p className="text-caption text-ink-muted leading-relaxed">
            На следующем шаге создадим короткий профиль, затем отдельно
            подтвердим доступ ЭНЦ к данным.
          </p>
        </div>
      </div>

      <div className="px-5 pb-8 pt-3 border-t border-slate-100 bg-white/85 backdrop-blur">
        <Button full onClick={next}>
          Продолжить из ЭНЦ
        </Button>
      </div>
    </PhoneFrame>
  )
}
