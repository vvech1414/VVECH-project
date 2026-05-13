import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ShieldCheck } from 'lucide-react'
import PhoneFrame from '../../../components/patient/PhoneFrame'
import OnboardingChrome from '../../../components/patient/OnboardingChrome'
import Button from '../../../components/primitives/Button'
import { useInteldoc } from '../../../store/store'
import { signAccessGrant } from '../../../store/actions'
import { track } from '../../../lib/analytics'

const SCOPE_ITEMS = [
  'Загруженные результаты анализов',
  'Структурированные данные (OCR)',
  'Оригиналы документов',
  'Базовый профиль пациента',
]
const MECHANICS = [
  'Доступ действует бессрочно',
  'Распространяется на всех врачей клиники',
  'Можно отозвать в любой момент в Настройках',
]
const PARTNER_FULL_NAME = 'Эндокринологический научный центр'

/**
 * Screen 3 — Access grant for the partner clinic, e-signed.
 *
 * Pilot deviation: OTP-based ПЭП is omitted. Tap «Подписать и продолжить»
 * directly creates the e-signature record (signature_method: 'mock_no_otp').
 * Once signed, the primary CTA enables.
 */
export default function Access() {
  const nav = useNavigate()
  const accessSigned = useInteldoc((s) => s.accessSigned)
  const draft = useInteldoc((s) => s.accountDraft)

  const [confirmed, setConfirmed] = useState(false)
  const [signing, setSigning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    track({ name: 'access_grant_viewed' })
  }, [])

  // If user navigated here without an account draft, send them back.
  useEffect(() => {
    if (!draft) nav('/patient/entry/account', { replace: true })
  }, [draft, nav])

  function toggleConfirm() {
    const next = !confirmed
    setConfirmed(next)
    if (next) track({ name: 'access_grant_confirm_checked' })
  }

  async function sign() {
    if (!confirmed || signing || accessSigned) return
    setSigning(true)
    setError(null)
    try {
      await signAccessGrant()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось подписать. Попробуйте ещё раз.')
    } finally {
      setSigning(false)
    }
  }

  async function next() {
    if (!accessSigned || submitting) return
    setSubmitting(true)
    nav('/patient/entry/consents')
  }

  const primaryDisabled = !accessSigned || submitting

  return (
    <PhoneFrame>
      <OnboardingChrome
        showBack
        onBack={() => nav('/patient/entry/account')}
        progressLabel="Доступ · Шаг 2 из 3"
        step={2}
        totalSteps={3}
      />

      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-5">
        <div>
          <h1 className="text-h1-ui font-bold text-ink-strong leading-tight">
            Доступ для клиники
          </h1>
          <p className="text-caption text-ink-muted leading-relaxed mt-2">
            Один раз разрешите клинике видеть ваши данные. Врачи внутри ЭНЦ
            смогут работать с вашими анализами без дополнительных действий с вашей стороны.
          </p>
        </div>

        {/* Recipient card (dark surface) */}
        <section className="rounded-2xl bg-navy-900 text-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-caps text-cyan-300 mb-3">
            Получатель доступа
          </p>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300 text-h2-ui font-extrabold">
              Э
            </div>
            <div>
              <p className="text-body-lg font-bold leading-tight">ЭНЦ</p>
              <p className="text-caption text-slate-400 mt-0.5">
                {PARTNER_FULL_NAME}
              </p>
            </div>
          </div>
          <ul className="flex flex-col gap-2">
            {MECHANICS.map((m) => (
              <li key={m} className="flex items-start gap-2 text-caption text-slate-200">
                <Check size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                {m}
              </li>
            ))}
          </ul>
        </section>

        {/* Scope */}
        <section className="rounded-2xl bg-surface-sunken p-5">
          <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted mb-3">
            Что войдёт в доступ
          </p>
          <ul className="flex flex-col gap-2">
            {SCOPE_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-body text-ink-strong"
              >
                <Check size={16} className="text-cyan-500 flex-shrink-0 mt-0.5" strokeWidth={2.4} />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Confirmation checkbox */}
        <label className="flex cursor-pointer items-start gap-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={confirmed}
            onClick={toggleConfirm}
            disabled={accessSigned}
            className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md transition-colors ${
              confirmed
                ? 'bg-cyan-500'
                : 'bg-white shadow-[inset_0_0_0_1.5px_var(--slate-300)]'
            } ${accessSigned ? 'opacity-60 cursor-default' : ''}`}
          >
            {confirmed && <Check size={14} strokeWidth={2.5} className="text-white" />}
          </button>
          <span className="text-caption text-ink leading-relaxed">
            Я подтверждаю, что предоставляю Эндокринологическому научному центру
            постоянный доступ к моим медицинским данным в IntelDoc, и даю согласие
            на передачу этих данных указанному ЛПУ в соответствии со статьёй 9
            Федерального закона № 152-ФЗ.
          </span>
        </label>

        {/* E-signature step */}
        <section
          className={`rounded-2xl p-4 transition-colors ${
            accessSigned
              ? 'bg-[#ECFDF5]'
              : confirmed
              ? 'bg-cyan-50'
              : 'bg-slate-100 opacity-70'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                accessSigned ? 'bg-emerald-500 text-white' : 'bg-cyan-500 text-white'
              }`}
            >
              {accessSigned ? (
                <Check size={20} strokeWidth={2.4} />
              ) : (
                <ShieldCheck size={20} strokeWidth={2} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-ink-strong leading-snug">
                {accessSigned ? 'Подписано' : 'Подпишите согласие'}
              </p>
              <p className="text-caption text-ink-muted leading-relaxed mt-0.5">
                {accessSigned
                  ? 'Запись о подписи сохранена с временной меткой и хешем документа.'
                  : 'Простая электронная подпись (ПЭП) подтвердит факт выдачи доступа клинике.'}
              </p>
              {!accessSigned && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={sign}
                  disabled={!confirmed || signing}
                  className="mt-3"
                >
                  {signing ? 'Подписываем…' : 'Подписать и продолжить'}
                </Button>
              )}
              {error && (
                <p className="text-caption text-rose-600 mt-2 leading-snug">{error}</p>
              )}
            </div>
          </div>
        </section>

        <p className="text-caption text-ink-muted leading-relaxed text-center px-1">
          Факт выдачи доступа и согласия на передачу данных будет сохранён с временной меткой.
          Отозвать доступ можно в разделе «Настройки → Доступы».
        </p>
      </div>

      <div className="px-5 pb-8 pt-3 border-t border-slate-100 bg-white/85 backdrop-blur">
        <Button full onClick={next} disabled={primaryDisabled}>
          Предоставить доступ клинике
        </Button>
      </div>
    </PhoneFrame>
  )
}
