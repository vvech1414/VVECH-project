import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark'
type Size = 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  full?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
  children?: ReactNode
}

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-cyan-500 text-white hover:bg-cyan-600 active:bg-cyan-700 disabled:bg-slate-200 disabled:text-slate-400',
  secondary:
    'bg-white text-cyan-500 shadow-[inset_0_0_0_1.5px_currentColor] hover:bg-cyan-50 disabled:text-slate-400 disabled:shadow-[inset_0_0_0_1.5px_rgb(226_232_240)]',
  ghost:
    'bg-transparent text-cyan-500 hover:bg-cyan-50 disabled:text-slate-400',
  dark:
    'bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-950 disabled:bg-slate-200 disabled:text-slate-400',
}

const SIZE: Record<Size, string> = {
  md: 'px-5 py-3 text-body',
  lg: 'px-5 py-[15px] text-[15px]',
}

export default function Button({
  variant = 'primary',
  size = 'lg',
  full,
  icon,
  iconRight,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold tracking-ui transition-all duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 ${
        full ? 'w-full' : ''
      } ${VARIANT[variant]} ${SIZE[size]} ${className}`}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  )
}
