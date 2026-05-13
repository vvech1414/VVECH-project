import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Analysis } from '../../store/types'

interface OCRReviewPanelProps {
  analysis: Analysis
  onChange: (field: string, value: string) => void
}

/**
 * Renders the OCR fields as an editable list, revealing rows with a small
 * stagger so saving a fresh upload feels like the "magic moment" per spec.
 */
export default function OCRReviewPanel({ analysis, onChange }: OCRReviewPanelProps) {
  const [editing, setEditing] = useState<string | null>(null)
  const fields = Object.entries(analysis.ocrFields)

  // Reset edit-state when the analysis changes (e.g. switching items).
  useEffect(() => setEditing(null), [analysis.id])

  return (
    <div className="rounded-2xl bg-white px-5 py-2">
      <AnimatePresence initial>
        {fields.map(([key, value], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between gap-3 py-3 border-b border-slate-100 last:border-0"
          >
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-caps text-ink-muted">
                {key}
              </p>
              {editing === key ? (
                <input
                  autoFocus
                  defaultValue={value}
                  onBlur={(e) => {
                    onChange(key, e.target.value)
                    setEditing(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                    if (e.key === 'Escape') setEditing(null)
                  }}
                  className="w-full mt-0.5 text-body-lg font-bold text-ink-strong font-data bg-transparent outline-none border-b border-cyan-500"
                />
              ) : (
                <button
                  onClick={() => setEditing(key)}
                  className="text-left mt-0.5 text-body-lg font-bold text-ink-strong font-data"
                >
                  {value}
                </button>
              )}
            </div>
            {editing !== key && (
              <button
                onClick={() => setEditing(key)}
                className="text-[12px] font-bold tracking-caps uppercase text-cyan-500"
              >
                Изменить
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
