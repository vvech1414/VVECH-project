import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronRight,
  Eye,
  FileText,
  History as HistoryIcon,
  LogOut,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  ShieldOff,
  Smartphone,
} from 'lucide-react'
import PhoneFrame from '../../components/patient/PhoneFrame'
import TopHeader from '../../components/patient/TopHeader'
import RevokeAccessSheet from '../../components/patient/RevokeAccessSheet'
import DoctorViewSheet, {
  type DoctorViewField,
} from '../../components/patient/DoctorViewSheet'
import TabBar from '../../components/primitives/TabBar'
import Avatar from '../../components/primitives/Avatar'
import Button from '../../components/primitives/Button'
import { useActivePatient } from '../../store/hooks'
import { useInteldoc } from '../../store/store'
import { resetToSeed, revokeAccess } from '../../store/actions'
import { formatAge, formatDateShort } from '../../lib/formatters'

interface ToggleProps {
  label: string
  description?: string
  value: boolean
  onChange: (v: boolean) => void
  Icon?: typeof Bell
}

function Toggle({ label, description, value, onChange, Icon }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center gap-3 py-3 text-left"
      aria-pressed={value}
    >
      {Icon && (
        <div className="h-9 w-9 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center flex-shrink-0">
          <Icon size={18} strokeWidth={2} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-ink-strong leading-tight">{label}</p>
        {description && (
          <p className="text-caption text-ink-muted leading-snug mt-0.5">
            {description}
          </p>
        )}
      </div>
      <span
        className={`h-6 w-10 rounded-full transition-colors flex items-center px-0.5 ${
          value ? 'bg-cyan-500' : 'bg-slate-200'
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  )
}

function SectionHeader({
  Icon,
  title,
}: {
  Icon: typeof Bell
  title: string
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={18} className="text-cyan-500" strokeWidth={2} />
      <p className="text-[15px] font-bold text-ink-strong">{title}</p>
    </div>
  )
}

export default function Profile() {
  const nav = useNavigate()
  const patient = useActivePatient()
  const grant = useInteldoc((s) =>
    s.accessGrants.find(
      (g) => g.patientId === s.currentPatientId && !g.revokedAt,
    ),
  )

  // Local-only notification settings (no contract field — see follow-up).
  const [pushOn, setPushOn] = useState(true)
  const [emailOn, setEmailOn] = useState(false)
  const [reminderOn, setReminderOn] = useState(true)

  const [revokeOpen, setRevokeOpen] = useState(false)
  const [doctorViewOpen, setDoctorViewOpen] = useState(false)

  function logout() {
    resetToSeed()
    nav('/patient/entry/welcome', { replace: true })
  }

  function confirmRevoke() {
    if (grant) revokeAccess(grant.id)
    setRevokeOpen(false)
  }

  const dobLine = patient?.dob
    ? `${formatAge(patient.dob)} · ${formatDateShort(patient.dob)}`
    : 'Дата рождения не указана'

  const doctorViewFields: DoctorViewField[] = [
    {
      label: 'Пол',
      value: patient?.gender
        ? patient.gender === 'female'
          ? 'женский'
          : 'мужской'
        : undefined,
    },
    { label: 'Рост' },
    { label: 'Вес' },
    { label: 'Аллергии' },
    { label: 'Хронические заболевания' },
  ]

  return (
    <PhoneFrame>
      <TopHeader title="Профиль" />

      <div className="flex-1 overflow-y-auto px-5 pb-[110px] flex flex-col gap-4">
        {/* 1 · Identity card */}
        <div className="rounded-2xl bg-surface p-5">
          <div className="flex items-center gap-4">
            <Avatar name={patient?.name ?? 'А П'} size={56} />
            <div className="min-w-0 flex-1">
              <p className="text-[18px] font-bold text-ink-strong leading-tight truncate">
                {patient?.name ?? 'Анна Петрова'}
              </p>
              <p className="text-caption text-ink-muted font-data mt-0.5">
                {dobLine}
              </p>
            </div>
          </div>

          <button
            onClick={() => setDoctorViewOpen(true)}
            className="mt-4 w-full flex items-center gap-3 rounded-xl bg-surface-sunken px-3 py-2.5 text-left hover:bg-slate-100 transition-colors"
          >
            <Eye size={16} className="text-ink-muted flex-shrink-0" strokeWidth={2} />
            <p className="flex-1 text-caption text-ink-strong leading-snug">
              Что видит врач
            </p>
            <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
          </button>
        </div>

        {/* 2 · Clinic / partner block — highest-trust */}
        <div className="rounded-2xl bg-surface p-5">
          <SectionHeader Icon={ShieldCheck} title="Связь с клиникой" />

          <div className="flex items-center justify-between text-caption mb-2">
            <span className="text-ink-muted">Получатель</span>
            <span className="text-ink-strong font-bold">ЭНЦ</span>
          </div>
          <div className="flex items-center justify-between text-caption mb-2">
            <span className="text-ink-muted">Срок</span>
            <span className="text-ink-strong font-bold">
              {grant?.expiresAt
                ? `до ${formatDateShort(grant.expiresAt)}`
                : 'бессрочно'}
            </span>
          </div>
          <div className="flex items-center justify-between text-caption mb-2">
            <span className="text-ink-muted">Распространяется на</span>
            <span className="text-ink-strong font-bold">всех врачей клиники</span>
          </div>
          {grant?.lastViewedAt && (
            <div className="flex items-center justify-between text-caption">
              <span className="text-ink-muted">Последний просмотр</span>
              <span className="text-ink-strong font-bold">
                {formatDateShort(grant.lastViewedAt)}
              </span>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="md"
              full
              icon={<ShieldOff size={16} strokeWidth={2.4} />}
              onClick={() => setRevokeOpen(true)}
              disabled={!grant}
            >
              Отозвать доступ
            </Button>
            <button
              onClick={() => nav('/patient/history')}
              className="flex items-center justify-center gap-1.5 py-1.5 text-caption font-bold text-cyan-500 hover:text-cyan-600 transition-colors"
            >
              <HistoryIcon size={14} strokeWidth={2.4} />
              История доступа
              <ChevronRight size={14} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {/* 3 · Contacts */}
        <div className="rounded-2xl bg-surface p-5">
          <SectionHeader Icon={Phone} title="Контакты" />

          <div className="flex flex-col gap-3">
            {patient?.phone && (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} strokeWidth={2} />
                </div>
                <p className="text-body text-ink-strong font-data">
                  {patient.phone}
                </p>
              </div>
            )}

            {patient?.email ? (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} strokeWidth={2} />
                </div>
                <p className="text-body text-ink-strong">{patient.email}</p>
              </div>
            ) : (
              <button
                type="button"
                className="flex items-center gap-3 text-left rounded-xl -mx-1 px-1 py-1 hover:bg-slate-50 transition-colors"
              >
                <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-1.5">
                  <Plus size={14} className="text-ink-muted" strokeWidth={2.4} />
                  <p className="text-body text-ink-muted">Добавить email</p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* 4 · Notification settings */}
        <div className="rounded-2xl bg-surface p-5">
          <SectionHeader Icon={Bell} title="Уведомления" />

          <Toggle
            Icon={Smartphone}
            label="Push-уведомления"
            description="Сообщим о запросах врача и обновлениях плана"
            value={pushOn}
            onChange={setPushOn}
          />
          <div className="border-t border-slate-100" />
          <Toggle
            Icon={Mail}
            label="Email-уведомления"
            description="Дублируем важные события на почту"
            value={emailOn}
            onChange={setEmailOn}
          />
          <div className="border-t border-slate-100" />
          <Toggle
            Icon={Bell}
            label="Напоминания о подготовке"
            description="Заранее напомним, что осталось загрузить"
            value={reminderOn}
            onChange={setReminderOn}
          />
        </div>

        {/* 5 · Account-related entry points */}
        <div className="rounded-2xl bg-surface overflow-hidden">
          <button
            onClick={() => nav('/patient/history')}
            className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="h-9 w-9 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center">
              <FileText size={18} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-ink-strong">История действий</p>
              <p className="text-caption text-ink-muted">
                Что и когда происходило с вашими данными
              </p>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>

        {/* 6 · System zone — visually recessed, dev tooling */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col items-center gap-2">
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-caption font-bold text-ink-muted hover:text-ink-strong transition-colors"
          >
            <LogOut size={14} strokeWidth={2.4} />
            Сбросить демо-профиль
          </button>
          <p className="text-[11px] text-ink-muted leading-relaxed text-center px-4">
            Это демо-режим. Реальные данные не передаются.
          </p>
        </div>
      </div>

      <RevokeAccessSheet
        open={revokeOpen}
        clinicName="ЭНЦ"
        onClose={() => setRevokeOpen(false)}
        onConfirm={confirmRevoke}
      />
      <DoctorViewSheet
        open={doctorViewOpen}
        onClose={() => setDoctorViewOpen(false)}
        fields={doctorViewFields}
      />

      <TabBar />
    </PhoneFrame>
  )
}
