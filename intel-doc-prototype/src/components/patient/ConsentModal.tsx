import { useEffect, useRef, useState } from 'react'
import { X, Check } from 'lucide-react'
import Button from '../primitives/Button'
import type { AckMechanism } from '../../store/types'
import type { ConsentSpec } from '../../lib/consent-text'
import { track } from '../../lib/analytics'

interface ConsentModalProps {
  open: boolean
  spec: ConsentSpec
  onClose: () => void
  /** Called when the user explicitly acknowledges. */
  onAcknowledge: (mech: AckMechanism) => void
}

const SCROLL_TOLERANCE_PX = 24

/**
 * Full-height bottom-sheet modal for the read-and-acknowledge consent pattern.
 *
 * Per spec §Modal read-and-acknowledge pattern:
 * - The acknowledgment CTA is disabled until the user scrolls to the bottom
 *   OR ticks the «Прочитал(а)» a11y checkbox at the bottom of the text.
 * - On acknowledge: modal closes, the parent block becomes "accepted",
 *   and a `consent_acknowledged` analytics event fires with the ack mechanism.
 *
 * The "directTick" flag on a spec means the consent doesn't require this
 * pattern at all; consumers should not render this modal for those specs.
 */
export default function ConsentModal({
  open,
  spec,
  onClose,
  onAcknowledge,
}: ConsentModalProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [scrolledToEnd, setScrolledToEnd] = useState(false)
  const [a11yChecked, setA11yChecked] = useState(false)

  // Reset gating when reopened or when the spec changes.
  useEffect(() => {
    if (open) {
      setScrolledToEnd(false)
      setA11yChecked(false)
      // Lock body scroll while modal is up.
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open, spec.id])

  // Edge case: if the text is short enough that no scrolling is needed,
  // count the modal as scrolled-to-end immediately so the user isn't
  // permanently blocked.
  useEffect(() => {
    if (!open) return
    const el = scrollRef.current
    if (!el) return
    const checkInitial = () => {
      if (el.scrollHeight - el.clientHeight <= SCROLL_TOLERANCE_PX) {
        setScrolledToEnd(true)
      }
    }
    // Defer one frame so layout is settled.
    const r = requestAnimationFrame(checkInitial)
    return () => cancelAnimationFrame(r)
  }, [open, spec.id])

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    if (scrolledToEnd) return
    const t = e.currentTarget
    const reachedBottom =
      t.scrollHeight - t.scrollTop - t.clientHeight <= SCROLL_TOLERANCE_PX
    if (reachedBottom) {
      setScrolledToEnd(true)
      track({
        name: 'consent_modal_scrolled_to_end',
        consentId: spec.id,
      })
    }
  }

  function acknowledge() {
    const mech: AckMechanism = scrolledToEnd
      ? 'scroll_to_end'
      : a11yChecked
      ? 'a11y_checkbox'
      : 'scroll_to_end' // never reached, button is gated
    onAcknowledge(mech)
  }

  if (!open) return null

  const ackEnabled = scrolledToEnd || a11yChecked

  return (
    <div
      className="absolute inset-0 z-30 flex items-end bg-[rgba(15,16,20,0.45)]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={spec.title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white rounded-t-[20px] shadow-md flex flex-col"
        style={{
          height: 'calc(100% - 40px)',
          animation: 'ds-slide-up 320ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="min-w-0 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-caps text-cyan-500">
              Согласие · блок {spec.block}
            </p>
            <p className="text-[16px] font-bold text-ink-strong leading-snug mt-1">
              {spec.title}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-slate-100 transition-colors"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable text */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-5 py-4 text-body text-ink-strong leading-relaxed whitespace-pre-line"
        >
          {spec.fullText}

          {/* a11y "mark as read" alternative — for screen-reader users who
              may not trigger scroll events normally. */}
          <label className="mt-6 mb-2 flex cursor-pointer items-start gap-3 rounded-2xl bg-surface-sunken p-4">
            <button
              type="button"
              role="checkbox"
              aria-checked={a11yChecked}
              onClick={() => setA11yChecked((v) => !v)}
              className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md transition-colors ${
                a11yChecked
                  ? 'bg-cyan-500'
                  : 'bg-white shadow-[inset_0_0_0_1.5px_var(--slate-300)]'
              }`}
            >
              {a11yChecked && (
                <Check size={14} strokeWidth={2.5} className="text-white" />
              )}
            </button>
            <span className="text-caption text-ink leading-relaxed">
              Я ознакомился(ась) с полным текстом и готов(а) подтвердить согласие.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-5 pb-7 pt-3 border-t border-slate-100">
          {!ackEnabled && (
            <p className="text-[12px] text-ink-muted text-center mb-3 leading-snug">
              Чтобы продолжить, прочитайте текст до конца или отметьте, что ознакомились.
            </p>
          )}
          <Button full onClick={acknowledge} disabled={!ackEnabled}>
            Я прочитал(а) и согласен(а)
          </Button>
        </div>
      </div>
    </div>
  )
}
