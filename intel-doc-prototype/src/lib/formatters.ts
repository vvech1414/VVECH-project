// Russian date / number formatting helpers.

const RU_MONTHS_SHORT = [
  'янв.',
  'февр.',
  'март',
  'апр.',
  'май',
  'июнь',
  'июль',
  'авг.',
  'сент.',
  'окт.',
  'нояб.',
  'дек.',
]
const RU_MONTHS_GEN = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

function parseDate(input: string): Date | null {
  // Accepts ISO yyyy-mm-dd[*] or dd.mm.yyyy
  if (!input) return null
  if (/^\d{4}-\d{2}-\d{2}/.test(input)) return new Date(input)
  const m = input.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]))
  return null
}

/** "12 апреля" — uses genitive month, no year. */
export function formatDateShort(input: string): string {
  const d = parseDate(input)
  if (!d) return input
  return `${d.getDate()} ${RU_MONTHS_GEN[d.getMonth()]}`
}

/** "12 апреля 2026" — with year. */
export function formatDateFull(input: string): string {
  const d = parseDate(input)
  if (!d) return input
  return `${d.getDate()} ${RU_MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`
}

/**
 * "Сегодня" / "Завтра" / "Через 5 дней" / "5 дней назад" — relative day lead.
 * Used as the appointment-date headline strip on Home.
 */
export function formatAppointmentLead(input: string, now: Date = new Date()): string {
  const d = parseDate(input)
  if (!d) return input
  const startOfDay = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const days = Math.round((startOfDay(d) - startOfDay(now)) / 86_400_000)
  if (days === 0) return 'Сегодня'
  if (days === 1) return 'Завтра'
  if (days === -1) return 'Вчера'
  const abs = Math.abs(days)
  const mod10 = abs % 10
  const mod100 = abs % 100
  let suffix: string
  if (mod100 >= 11 && mod100 <= 14) suffix = 'дней'
  else if (mod10 === 1) suffix = 'день'
  else if (mod10 >= 2 && mod10 <= 4) suffix = 'дня'
  else suffix = 'дней'
  return days > 0 ? `Через ${abs} ${suffix}` : `${abs} ${suffix} назад`
}

/** "12 апр." compact form. */
export function formatDateCompact(input: string): string {
  const d = parseDate(input)
  if (!d) return input
  return `${d.getDate()} ${RU_MONTHS_SHORT[d.getMonth()]}`
}

/** "12 апреля, 14:42" — date + time. */
export function formatDateTime(input: string): string {
  const d = parseDate(input)
  if (!d) return input
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${d.getDate()} ${RU_MONTHS_GEN[d.getMonth()]}, ${hh}:${mm}`
}

/**
 * "54 года" — Russian age with correct pluralization.
 * 1 год · 2–4 года · 5–20 лет · 21 год · 22–24 года · 25 лет · …
 */
export function formatAge(dob: string, today: Date = new Date()): string {
  const d = parseDate(dob)
  if (!d) return ''
  let years = today.getFullYear() - d.getFullYear()
  const m = today.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) years--
  if (years < 0) return ''
  const mod10 = years % 10
  const mod100 = years % 100
  let suffix: string
  if (mod100 >= 11 && mod100 <= 14) suffix = 'лет'
  else if (mod10 === 1) suffix = 'год'
  else if (mod10 >= 2 && mod10 <= 4) suffix = 'года'
  else suffix = 'лет'
  return `${years} ${suffix}`
}
