import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ShieldCheck, ChevronRight } from 'lucide-react'
import PhoneFrame from '../../../components/patient/PhoneFrame'
import OnboardingChrome from '../../../components/patient/OnboardingChrome'
import Button from '../../../components/primitives/Button'
import BottomSheet from '../../../components/primitives/BottomSheet'
import ConsentModal from '../../../components/patient/ConsentModal'
import { CONSENT_BLOCKS } from '../../../lib/consent-text'
import type { AckMechanism, ConsentId, ConsentRecord } from '../../../store/types'
import { submitConsentBundle } from '../../../store/actions'
import { track } from '../../../lib/analytics'

type Channel = 'email' | 'sms' | 'push'

interface BlockState {
  accepted: boolean
  ackMechanism: AckMechanism | null
  channels: Channel[] // marketing only
}

type BlockStateMap = Record<ConsentId, BlockState>

const INITIAL: BlockStateMap = {
  pdn_general: { accepted: false, ackMechanism: null, channels: [] },
  pdn_special: { accepted: false, ackMechanism: null, channels: [] },
  cross_border: { accepted: false, ackMechanism: null, channels: [] }, // omitted from UI
  marketing: { accepted: false, ackMechanism: null, channels: [] },
}

export default function Consents() {
  const nav = useNavigate()
  const [blocks, setBlocks] = useState<BlockStateMap>(INITIAL)
  const [openConsentId, setOpenConsentId] = useState<ConsentId | null>(null)
  const [marketingSheetOpen, setMarketingSheetOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    track({ name: 'consents_viewed' })
  }, [])

  const requiredAllAccepted = useMemo(
    () =>
      CONSENT_BLOCKS.filter((b) => b.required).every(
        (b) => blocks[b.id].accepted,
      ),
    [blocks],
  )

  function tapBlock(id: ConsentId) {
    track({ name: 'consent_block_tapped', consentId: id })
    const spec = CONSENT_BLOCKS.find((b) => b.id === id)!
    if (spec.directTick) {
      // Marketing — open detail sheet for channel selection.
      setMarketingSheetOpen(true)
    } else {
      setOpenConsentId(id)
    }
  }

  function acknowledgeRequired(id: ConsentId, mech: AckMechanism) {
    const spec = CONSENT_BLOCKS.find((b) => b.id === id)!
    setBlocks((b) => ({
      ...b,
      [id]: { ...b[id], accepted: true, ackMechanism: mech },
    }))
    track({
      name: 'consent_acknowledged',
      consentId: id,
      versionId: spec.version,
      ackMechanism: mech,
    })
    setOpenConsentId(null)
  }

  function toggleMarketing() {
    setBlocks((b) => {
      const cur = b.marketing
      const nextAccepted = !cur.accepted
      // When toggled on directly without channel selection, default-off all
      // channels per pilot decision; user opens the detail sheet to opt in.
      const nextChannels: Channel[] = nextAccepted ? cur.channels : []
      return {
        ...b,
        marketing: {
          accepted: nextAccepted,
          ackMechanism: nextAccepted ? 'direct_tick' : null,
          channels: nextChannels,
        },
      }
    })
    const next = !blocks.marketing.accepted
    if (next) {
      const spec = CONSENT_BLOCKS.find((b) => b.id === 'marketing')!
      track({
        name: 'consent_acknowledged',
        consentId: 'marketing',
        versionId: spec.version,
        ackMechanism: 'direct_tick',
      })
    }
  }

  function setChannel(channel: Channel, on: boolean) {
    setBlocks((b) => {
      const cur = b.marketing
      const channels = on
        ? Array.from(new Set([...cur.channels, channel]))
        : cur.channels.filter((c) => c !== channel)
      // If at least one channel is on, marketing is implicitly accepted.
      const accepted = channels.length > 0 ? true : cur.accepted
      return {
        ...b,
        marketing: {
          accepted,
          ackMechanism: accepted ? cur.ackMechanism ?? 'direct_tick' : null,
          channels,
        },
      }
    })
    track({
      name: 'consent_opt_in_toggled',
      consentId: 'marketing',
      channels: on
        ? Array.from(new Set([...blocks.marketing.channels, channel]))
        : blocks.marketing.channels.filter((c) => c !== channel),
    })
  }

  async function submit() {
    if (!requiredAllAccepted || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const records: ConsentRecord[] = CONSENT_BLOCKS.map((spec) => {
        const s = blocks[spec.id]
        return {
          id: spec.id,
          version: spec.version,
          accepted: s.accepted,
          ackMechanism:
            s.ackMechanism ?? (spec.required ? 'scroll_to_end' : 'not_applicable'),
          ...(spec.id === 'marketing' && s.channels.length > 0
            ? { channels: s.channels }
            : {}),
        }
      })
      await submitConsentBundle(records)
      nav('/patient/entry/vasily-onboarding')
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Не удалось сохранить согласия. Попробуйте ещё раз.',
      )
      setSubmitting(false)
    }
  }

  return (
    <PhoneFrame>
      <OnboardingChrome
        showBack
        onBack={() => nav('/patient/entry/access')}
        progressLabel="Согласия · Последний шаг"
        step={3}
        totalSteps={3}
      />

      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-5">
        <div>
          <h1 className="text-h1-ui font-bold text-ink-strong leading-tight">
            Согласия
          </h1>
          <p className="text-caption text-ink-muted leading-relaxed mt-2">
            Для работы с вашими медицинскими данными нам нужны отдельные согласия
            по каждому основанию обработки. Нажмите на блок, чтобы прочитать
            полный текст.
          </p>
        </div>

        <section className="rounded-2xl bg-navy-900 text-white p-5 flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} strokeWidth={2} />
          </div>
          <p className="text-caption text-slate-200 leading-relaxed">
            Данные защищены. Согласия разнесены по закону, чтобы вы осознанно
            контролировали каждое основание обработки своих данных.
          </p>
        </section>

        <div className="flex flex-col gap-3">
          {CONSENT_BLOCKS.map((spec) => {
            const state = blocks[spec.id]
            const accepted = state.accepted
            const isMarketing = spec.id === 'marketing'

            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => tapBlock(spec.id)}
                className={`rounded-2xl p-4 text-left transition-colors ${
                  accepted ? 'bg-[#ECFDF5]' : 'bg-surface-sunken'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox visual */}
                  <span
                    className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md transition-colors ${
                      accepted
                        ? 'bg-emerald-500'
                        : isMarketing
                        ? 'bg-white shadow-[inset_0_0_0_1.5px_var(--slate-300)]'
                        : 'bg-slate-200'
                    }`}
                    aria-hidden
                  >
                    {accepted && <Check size={14} strokeWidth={2.5} className="text-white" />}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-[15px] font-bold text-ink-strong leading-snug">
                        {spec.title}
                      </p>
                      {spec.required && (
                        <span className="text-[10px] font-bold uppercase tracking-caps text-rose-600">
                          Обязательно
                        </span>
                      )}
                      {!spec.required && (
                        <span className="text-[10px] font-bold uppercase tracking-caps text-ink-muted">
                          Необязательно
                        </span>
                      )}
                    </div>
                    <p className="text-caption text-ink leading-relaxed">
                      {spec.summary}
                    </p>
                    {accepted ? (
                      <p className="text-[10px] font-bold uppercase tracking-caps text-emerald-700 mt-2">
                        Принято
                      </p>
                    ) : !isMarketing ? (
                      <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted mt-2">
                        Не прочитано
                      </p>
                    ) : null}
                  </div>

                  <ChevronRight size={18} className="text-slate-400 flex-shrink-0 mt-1" />
                </div>
              </button>
            )
          })}
        </div>

        <p className="text-caption text-ink-muted leading-relaxed text-center px-1">
          Любое из согласий можно отозвать в разделе «Настройки → Согласия».
          Отзыв некоторых согласий может ограничить работу сервиса — мы предупредим вас об этом.
        </p>
        {submitError && (
          <p className="text-caption text-rose-600 leading-snug text-center">{submitError}</p>
        )}
      </div>

      <div className="px-5 pb-8 pt-3 border-t border-slate-100 bg-white/85 backdrop-blur">
        <Button full onClick={submit} disabled={!requiredAllAccepted || submitting}>
          {submitting ? 'Сохраняем…' : 'Принять и продолжить'}
        </Button>
      </div>

      {/* Required-consent modals (one at a time) */}
      {openConsentId && (
        <ConsentModal
          open
          spec={CONSENT_BLOCKS.find((b) => b.id === openConsentId)!}
          onClose={() => setOpenConsentId(null)}
          onAcknowledge={(mech) => acknowledgeRequired(openConsentId, mech)}
        />
      )}

      {/* Marketing detail sheet (channel toggles) */}
      <BottomSheet
        open={marketingSheetOpen}
        onClose={() => setMarketingSheetOpen(false)}
        title="Информационные и рекламные рассылки"
      >
        <p className="text-caption text-ink-muted leading-relaxed text-center">
          Выберите удобные каналы. Согласие можно отозвать в любой момент.
        </p>
        <div className="flex flex-col gap-2">
          {(
            [
              { key: 'email' as const, label: 'Email' },
              { key: 'sms' as const, label: 'SMS' },
              { key: 'push' as const, label: 'Push-уведомления' },
            ]
          ).map(({ key, label }) => {
            const on = blocks.marketing.channels.includes(key)
            return (
              <div
                key={key}
                className="flex items-center justify-between gap-4 rounded-2xl bg-surface-sunken px-4 py-3.5"
              >
                <span className="min-w-0 text-body font-bold text-ink-strong">
                  {label}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={`${label}: ${on ? 'включено' : 'выключено'}`}
                  onClick={() => setChannel(key, !on)}
                  className={`relative h-8 w-[52px] flex-shrink-0 rounded-full p-1 transition-colors ${
                    on ? 'bg-cyan-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                      on ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </div>
        <Button
          variant="secondary"
          full
          onClick={() => {
            // Toggle the marketing block's accepted state if user explicitly wants it on/off.
            if (!blocks.marketing.accepted) toggleMarketing()
            setMarketingSheetOpen(false)
          }}
        >
          {blocks.marketing.accepted ? 'Сохранить' : 'Подписаться'}
        </Button>
      </BottomSheet>
    </PhoneFrame>
  )
}
