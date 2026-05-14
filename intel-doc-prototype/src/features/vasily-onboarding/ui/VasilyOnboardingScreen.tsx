import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PhoneFrame from '../../../components/patient/PhoneFrame'
import OnboardingChrome from '../../../components/patient/OnboardingChrome'
import VasilyMascot from '../../../components/system/VasilyMascot'
import Button from '../../../components/primitives/Button'
import { track } from '../../../lib/analytics'
import { POINTS } from '../model/points'

export default function VasilyOnboardingScreen() {
  const nav = useNavigate()
  const enteredAt = useRef(performance.now())

  useEffect(() => {
    track({ name: 'vasily_onboarding_viewed' })
  }, [])

  function next() {
    track({
      name: 'vasily_onboarding_completed',
      dwellMs: Math.round(performance.now() - enteredAt.current),
    })
    nav('/patient/entry/setup')
  }

  return (
    <PhoneFrame>
      <OnboardingChrome progressLabel="Василий · Перед стартом" />

      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-5">
        <section className="relative overflow-hidden rounded-2xl bg-navy-900 px-5 pt-6 pb-6 text-white">
          <div className="relative flex items-start gap-3">
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-[10px] font-bold uppercase tracking-caps text-cyan-300">
                Привет, я Василий
              </p>
              <h1 className="mt-2 text-h1-ui font-bold leading-tight">
                Давайте быстро покажу, что будет дальше
              </h1>
            </div>
            <VasilyMascot size={116} halo className="flex-shrink-0" />
          </div>
        </section>

        <div className="flex flex-col gap-3">
          {POINTS.map(({ Icon, title, body }) => (
            <article
              key={title}
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

        <section className="rounded-2xl bg-cyan-50 px-4 py-4">
          <p className="text-[15px] font-bold text-ink-strong leading-snug">
            Начнём с главного экрана
          </p>
          <p className="mt-1 text-caption text-ink-muted leading-relaxed">
            Там будет первый чек-лист подготовки и вход в чат со мной.
          </p>
        </section>
      </div>

      <div className="px-5 pb-8 pt-3 border-t border-slate-100 bg-white/85 backdrop-blur">
        <Button full onClick={next}>
          Понятно, начать
        </Button>
      </div>
    </PhoneFrame>
  )
}
