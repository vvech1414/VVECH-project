import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUnseenRequests } from '../../store/hooks'

/**
 * Urgent doctor-request banner. Renders only when there's an unseen request;
 * prep progress and appointment state live in dedicated cards on Home.
 */
export default function PrepBanner() {
  const nav = useNavigate()
  const unseen = useUnseenRequests()
  if (unseen.length === 0) return null
  const req = unseen[0]
  return (
    <button
      onClick={() => nav(`/patient/notification/${req.id}`)}
      className="w-full text-left rounded-2xl bg-cyan-500 p-5 text-white shadow-lg active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-caps text-white/85">
          Новый запрос
        </span>
      </div>
      <p className="text-[18px] font-bold leading-tight mb-1.5">Врач отправил запрос</p>
      <p className="text-caption text-white/85 leading-relaxed mb-4">{req.title}</p>
      <span className="inline-flex items-center gap-1 text-[12px] font-bold tracking-caps uppercase">
        Перейти к загрузке <ChevronRight size={14} strokeWidth={2.5} />
      </span>
    </button>
  )
}
