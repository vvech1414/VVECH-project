import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Mic,
  Send,
  TestTube2,
} from 'lucide-react'
import PhoneFrame from '../../components/patient/PhoneFrame'
import VasilyMascot from '../../components/system/VasilyMascot'

type CtaTarget = 'checklist' | 'upload' | 'plan' | 'docs' | 'home'

interface CannedReply {
  prompt: string
  reply: string
  cta: { label: string; target: CtaTarget }
}

const CTA_ROUTE: Record<CtaTarget, string> = {
  checklist: '/patient/checklist',
  upload: '/patient/upload',
  plan: '/patient/checklist',
  docs: '/patient/checklist',
  home: '/patient/home',
}

const SUGGESTIONS: CannedReply[] = [
  {
    prompt: 'Что взять с собой на приём',
    reply:
      'На приём возьмите паспорт, полис ОМС, направление (если есть) и недавние результаты анализов. Все документы можно загрузить заранее — врач увидит их до визита.',
    cta: { label: 'Открыть чек-лист', target: 'checklist' },
  },
  {
    prompt: 'Как подготовиться к анализам',
    reply:
      'Большинство анализов сдают утром натощак — последний приём пищи за 8–12 часов. За день лучше не нагружать организм спортом и не пить алкоголь. Точные правила для конкретного анализа подскажет ваш врач.',
    cta: { label: 'Загрузить анализ', target: 'upload' },
  },
  {
    prompt: 'Зачем нужны документы',
    reply:
      'Документы нужны, чтобы клиника подтвердила вашу личность и оформила приём без лишних бумаг. Это разовое действие — после первой загрузки они будут доступны на каждом визите.',
    cta: { label: 'Открыть документы', target: 'docs' },
  },
  {
    prompt: 'Что будет на приёме',
    reply:
      'Врач посмотрит анализы и жалобы, задаст уточняющие вопросы и обсудит дальнейшие шаги. Если потребуются дополнительные обследования — они придут запросом в приложение.',
    cta: { label: 'Посмотреть план', target: 'plan' },
  },
]

interface ChatMessage {
  id: string
  role: 'patient' | 'vasily'
  text: string
  cta?: { label: string; target: CtaTarget }
}

function pickReply(input: string): CannedReply {
  const lower = input.toLowerCase()
  if (lower.includes('диагноз') || lower.includes('лечение') || lower.includes('рецепт')) {
    return {
      prompt: input,
      reply:
        'Я не ставлю диагнозы и не назначаю лечение — это работа врача. Но я могу подсказать, что взять с собой и как подготовиться, чтобы приём прошёл продуктивно.',
      cta: { label: 'Открыть чек-лист', target: 'checklist' },
    }
  }
  if (lower.includes('взять') || lower.includes('документ') || lower.includes('паспорт')) {
    return SUGGESTIONS[0]
  }
  if (lower.includes('анализ') || lower.includes('кровь') || lower.includes('сахар')) {
    return SUGGESTIONS[1]
  }
  if (lower.includes('приём') || lower.includes('прием') || lower.includes('визит')) {
    return SUGGESTIONS[3]
  }
  // safe default
  return {
    prompt: input,
    reply:
      'Готов подсказать по подготовке к приёму, документам и анализам. Если хотите, давайте начнём с чек-листа — там видно, что осталось.',
    cta: { label: 'Открыть чек-лист', target: 'checklist' },
  }
}

let _msgSeq = 1
function nextMsgId() {
  return `m-${Date.now().toString(36)}-${(_msgSeq++).toString(36)}`
}

export default function VasilyHelper() {
  const nav = useNavigate()
  const location = useLocation()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'vasily',
      text: 'Здравствуйте! Я Василий, ваш цифровой помощник. Чем могу помочь?',
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [recording, setRecording] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, thinking])

  useEffect(() => {
    const state = location.state as { mode?: 'voice' } | null
    if (state?.mode === 'voice') {
      startVoice()
      // Clear the state so a back/forward nav doesn't re-trigger the mic.
      nav(location.pathname, { replace: true, state: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function ask(prompt: string) {
    const text = prompt.trim()
    if (!text) return
    setInput('')
    setMessages((prev) => [
      ...prev,
      { id: nextMsgId(), role: 'patient', text },
    ])
    setThinking(true)
    setTimeout(() => {
      const reply = pickReply(text)
      setMessages((prev) => [
        ...prev,
        {
          id: nextMsgId(),
          role: 'vasily',
          text: reply.reply,
          cta: reply.cta,
        },
      ])
      setThinking(false)
    }, 700)
  }

  function startVoice() {
    // No real Web Speech API in prototype — simulate the recording state and
    // surface the standard fallback so the spec's permission/error path is
    // visible to demo viewers.
    setRecording(true)
    setVoiceError(null)
    setTimeout(() => {
      setRecording(false)
      setVoiceError(
        'Не удалось распознать голос. Попробуйте ещё раз или напишите текстом.',
      )
    }, 1400)
  }

  return (
    <PhoneFrame>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <button
          onClick={() => nav(-1)}
          aria-label="Назад"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-ink" strokeWidth={2} />
        </button>
        <p className="text-[15px] font-bold text-ink-strong">Василий</p>
        <div className="h-9 w-9" />
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 pb-3 flex flex-col gap-3"
      >
        <div className="flex flex-col items-center gap-2 pt-1 pb-2">
          <VasilyMascot size={84} halo />
        </div>

        {messages.length === 1 && (
          <div className="grid grid-cols-3 gap-2 pb-1">
            <HelperTile
              icon={<ClipboardList size={17} strokeWidth={2.2} />}
              label="Чек-лист"
              onClick={() => nav('/patient/checklist')}
            />
            <HelperTile
              icon={<TestTube2 size={17} strokeWidth={2.2} />}
              label="Анализы"
              onClick={() => nav('/patient/upload')}
            />
            <HelperTile
              icon={<FileText size={17} strokeWidth={2.2} />}
              label="Документы"
              onClick={() => nav('/patient/checklist')}
            />
          </div>
        )}

        {messages.map((m) =>
          m.role === 'vasily' ? (
            <div
              key={m.id}
              className="rounded-2xl bg-white px-4 py-3 max-w-[300px] self-start flex flex-col gap-2"
            >
              <p className="text-[10px] font-bold uppercase tracking-caps text-cyan-500">
                Василий
              </p>
              <p className="text-body text-ink-strong leading-relaxed">{m.text}</p>
              {m.cta && (
                <button
                  onClick={() => nav(CTA_ROUTE[m.cta!.target])}
                  className="self-start mt-1 inline-flex items-center gap-1.5 rounded-full bg-cyan-50 text-cyan-600 px-3 py-1.5 text-[12px] font-bold tracking-caps uppercase"
                >
                  {m.cta.label}
                  <ChevronRight size={14} strokeWidth={2.5} />
                </button>
              )}
              <p className="text-caption text-ink-muted leading-snug border-t border-slate-100 pt-2 mt-1">
                Это информационная подсказка. Решения принимает ваш врач.
              </p>
            </div>
          ) : (
            <div
              key={m.id}
              className="self-end max-w-[280px] rounded-2xl bg-cyan-500 text-white px-4 py-3"
            >
              <p className="text-body leading-relaxed">{m.text}</p>
            </div>
          ),
        )}

        <AnimatePresence>
          {thinking && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="self-start rounded-2xl bg-white px-4 py-3"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-cyan-500"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggestion chips — only on the very first turn for guided start. */}
        {messages.length <= 2 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.prompt}
                onClick={() => ask(s.prompt)}
                className="rounded-full bg-white px-3.5 py-2 text-[12px] font-bold tracking-caps text-cyan-600 shadow-[inset_0_0_0_1.5px_var(--blue-200)] hover:bg-cyan-50"
              >
                {s.prompt}
              </button>
            ))}
          </div>
        )}

        {voiceError && (
          <div className="rounded-2xl bg-[#FFF1F2] px-4 py-3 text-rose-700 text-caption leading-relaxed">
            {voiceError}
            <button
              onClick={() => setVoiceError(null)}
              className="ml-2 inline-flex items-center text-[12px] font-bold tracking-caps uppercase text-rose-700"
            >
              Понятно
            </button>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="px-3 pb-6 pt-2 bg-white/85 backdrop-blur border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') ask(input)
              }}
              placeholder="Спросите Василия…"
              className="w-full rounded-full bg-surface-sunken px-4 py-3 text-body text-ink-strong placeholder:text-ink-subtle outline-none focus:shadow-[inset_0_0_0_1.5px_var(--blue-600)]"
            />
          </div>
          <button
            onClick={startVoice}
            disabled={recording}
            aria-label="Голосовой ввод"
            className={`h-12 w-12 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${
              recording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-white text-cyan-500 shadow-[inset_0_0_0_1.5px_var(--blue-200)]'
            }`}
          >
            <Mic size={20} strokeWidth={2} />
          </button>
          <button
            onClick={() => ask(input)}
            disabled={!input.trim()}
            aria-label="Отправить"
            className="h-12 w-12 flex-shrink-0 rounded-full bg-cyan-500 text-white flex items-center justify-center disabled:bg-slate-200 disabled:text-slate-400"
          >
            <Send size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}

function HelperTile({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl bg-white p-3 text-left active:scale-[0.99] transition-transform"
    >
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-500">
        {icon}
      </div>
      <p className="text-[12px] font-bold text-ink-strong leading-tight">{label}</p>
    </button>
  )
}
