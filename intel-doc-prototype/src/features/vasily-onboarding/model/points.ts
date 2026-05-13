import { ClipboardCheck, MessageCircle, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface OnboardingPoint {
  Icon: LucideIcon
  title: string
  body: string
}

export const POINTS: OnboardingPoint[] = [
  {
    Icon: ClipboardCheck,
    title: 'Соберу подготовку в один список',
    body: 'Анализы, документы и вопросы к врачу будут лежать рядом, без поиска по чатам и файлам.',
  },
  {
    Icon: MessageCircle,
    title: 'Можно писать простыми словами',
    body: 'Если не знаете, куда добавить симптом или выписку, просто спросите меня.',
  },
  {
    Icon: ShieldCheck,
    title: 'Решения остаются за врачом',
    body: 'Я помогаю подготовиться и ничего не назначаю вместо специалиста.',
  },
]
