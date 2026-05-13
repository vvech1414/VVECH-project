import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PhoneFrame from '../../../components/patient/PhoneFrame'
import OnboardingChrome from '../../../components/patient/OnboardingChrome'
import Button from '../../../components/primitives/Button'
import Input from '../../../components/primitives/Input'
import { useInteldoc } from '../../../store/store'
import { saveAccountDraft } from '../../../store/actions'
import type { AccountDraft, Gender } from '../../../store/types'
import { track } from '../../../lib/analytics'

const FIELD_LABELS: Record<keyof AccountDraft, string> = {
  name: 'ПОЛНОЕ ИМЯ',
  dob: 'ДАТА РОЖДЕНИЯ',
  gender: 'ПОЛ',
  phone: 'ТЕЛЕФОН',
  email: 'EMAIL (НЕОБЯЗАТЕЛЬНО)',
}

// ─── Validators ─────────────────────────────────────────────────────────────
function validName(v: string): true | string {
  const trimmed = v.trim()
  if (trimmed.length < 3) return 'Укажите имя и фамилию'
  if (!/^[А-Яа-яЁё\s\-]+$/.test(trimmed)) return 'Только кириллица, пробелы и дефисы'
  if (trimmed.split(/\s+/).filter(Boolean).length < 2) return 'Имя и фамилия — минимум два слова'
  return true
}
function validDob(v: string): true | string {
  if (!v) return 'Укажите дату рождения'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return 'Неверная дата'
  const now = new Date()
  if (d.getTime() > now.getTime()) return 'Дата не может быть в будущем'
  const age = now.getFullYear() - d.getFullYear() - (
    now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0
  )
  if (age < 14) return 'Должно быть не меньше 14 лет'
  return true
}
function validPhone(v: string): true | string {
  // Lenient RU format: tolerate +7 / 8 prefix, brackets, spaces, dashes; require 11 digits.
  const digits = v.replace(/\D/g, '')
  if (digits.length === 0) return 'Укажите номер телефона'
  if (digits.length !== 11) return 'Нужно 11 цифр (формат +7 ...)'
  if (!/^[78]/.test(digits)) return 'Номер должен начинаться с +7 или 8'
  return true
}
function validEmail(v: string): true | string {
  if (!v.trim()) return true // optional
  // Light RFC-5322ish check; sufficient for prototype.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Неверный формат email'
  return true
}

// ─── Account screen ─────────────────────────────────────────────────────────
export default function Account() {
  const nav = useNavigate()
  const existing = useInteldoc((s) => s.accountDraft)
  const [draft, setDraft] = useState<AccountDraft>(
    () =>
      existing ?? {
        name: '',
        dob: '',
        gender: null,
        phone: '',
        email: '',
      },
  )
  const [touched, setTouched] = useState<Partial<Record<keyof AccountDraft, boolean>>>({})

  useEffect(() => {
    track({ name: 'account_viewed' })
  }, [])

  const errors = useMemo(() => {
    const e: Partial<Record<keyof AccountDraft, string>> = {}
    const n = validName(draft.name)
    if (n !== true) e.name = n
    const d = validDob(draft.dob)
    if (d !== true) e.dob = d
    if (!draft.gender) e.gender = 'Выберите пол'
    const p = validPhone(draft.phone)
    if (p !== true) e.phone = p
    const em = validEmail(draft.email)
    if (em !== true) e.email = em
    return e
  }, [draft])

  const allValid = Object.keys(errors).length === 0

  function update<K extends keyof AccountDraft>(key: K, val: AccountDraft[K]) {
    setDraft((d) => ({ ...d, [key]: val }))
  }

  function blur<K extends keyof AccountDraft>(key: K) {
    setTouched((t) => ({ ...t, [key]: true }))
    const isValid = !errors[key]
    track({
      name: 'account_field_blurred',
      field: key,
      valid: isValid,
    })
  }

  function submit() {
    if (!allValid) {
      // Surface all field errors at once.
      setTouched({
        name: true,
        dob: true,
        gender: true,
        phone: true,
        email: true,
      })
      track({
        name: 'account_validation_error',
        fields: Object.keys(errors),
      })
      return
    }
    saveAccountDraft(draft)
    track({ name: 'account_submitted' })
    nav('/patient/entry/access')
  }

  return (
    <PhoneFrame>
      <OnboardingChrome
        showBack
        onBack={() => nav('/patient/entry/welcome')}
        progressLabel="Профиль · Шаг 1 из 3"
        step={1}
        totalSteps={3}
      />

      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-5">
        <div>
          <h1 className="text-h1-ui font-bold text-ink-strong leading-tight">
            Аккаунт
          </h1>
          <p className="text-caption text-ink-muted leading-relaxed mt-2">
            Только необходимое. Медицинские данные заполним на следующем шаге.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label={FIELD_LABELS.name}
            required
            placeholder="Иванова Анна"
            value={draft.name}
            onChange={(e) => update('name', e.target.value)}
            onBlur={() => blur('name')}
            error={touched.name ? errors.name : undefined}
          />
          <Input
            label={FIELD_LABELS.dob}
            required
            type="date"
            value={draft.dob}
            onChange={(e) => update('dob', e.target.value)}
            onBlur={() => blur('dob')}
            error={touched.dob ? errors.dob : undefined}
          />

          {/* Gender — segmented toggle */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-caps text-ink-muted">
              {FIELD_LABELS.gender}
              <span className="text-rose-600 ml-1">*</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(['female', 'male'] as Gender[]).map((g) => {
                const active = draft.gender === g
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      update('gender', g)
                      blur('gender')
                    }}
                    className={`rounded-xl px-4 py-3.5 text-[15px] font-bold tracking-ui transition-all duration-200 ease-out ${
                      active
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white text-ink-strong shadow-[inset_0_0_0_1.5px_var(--slate-200)] hover:bg-cyan-50'
                    }`}
                    aria-pressed={active}
                  >
                    {g === 'female' ? 'Женский' : 'Мужской'}
                  </button>
                )
              })}
            </div>
            {touched.gender && errors.gender && (
              <span className="text-caption text-rose-600 leading-snug">
                {errors.gender}
              </span>
            )}
          </div>

          <Input
            label={FIELD_LABELS.phone}
            required
            type="tel"
            inputMode="tel"
            placeholder="+7 (___) ___-__-__"
            value={draft.phone}
            onChange={(e) => update('phone', e.target.value)}
            onBlur={() => blur('phone')}
            error={touched.phone ? errors.phone : undefined}
            helper="Понадобится для связи и подтверждения юридически значимых действий."
          />
          <Input
            label={FIELD_LABELS.email}
            type="email"
            inputMode="email"
            placeholder="example@mail.ru"
            value={draft.email}
            onChange={(e) => update('email', e.target.value)}
            onBlur={() => blur('email')}
            error={touched.email ? errors.email : undefined}
          />
        </div>
      </div>

      <div className="px-5 pb-8 pt-3 border-t border-slate-100 bg-white/85 backdrop-blur">
        <Button full onClick={submit} disabled={!allValid}>
          Далее
        </Button>
      </div>
    </PhoneFrame>
  )
}
