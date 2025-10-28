function getSize (size: 'sm' | 'md' | 'lg' | 'xl'): string {
  switch (size) {
    case 'sm': return 'px-3 py-1.5 text-sm font-medium'
    case 'md': return 'px-4 py-2.5 text-base font-medium'
    case 'lg': return 'px-6 py-3 text-lg font-semibold'
    case 'xl': return 'px-8 py-4 text-xl font-semibold'
  }
}

function getVariant (variant: 'primary' | 'secondary' | 'ghost' | 'underline' | 'outline', disabled = false): string {
  if (disabled) {
    switch (variant) {
      case 'primary': return 'bg-slate-300 text-slate-500 cursor-not-allowed'
      case 'secondary': return 'bg-slate-200 text-slate-400 cursor-not-allowed'
      case 'ghost': return 'bg-transparent text-slate-400 cursor-not-allowed'
      case 'underline': return 'bg-transparent text-slate-400 underline underline-offset-4 cursor-not-allowed'
      case 'outline': return 'bg-transparent text-slate-400 border-2 border-slate-300 cursor-not-allowed'
    }
  }

  switch (variant) {
    case 'primary': return 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 shadow-sm hover:shadow-md'
    case 'secondary': return 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 border border-slate-300'
    case 'ghost': return 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200'
    case 'underline': return 'bg-transparent text-slate-900 underline underline-offset-4 hover:text-slate-700 decoration-2'
    case 'outline': return 'bg-transparent text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white active:bg-slate-950'
  }
}

function Button ({
  children = 'Click me',
  onClick,
  size = 'md',
  variant = 'primary',
  disabled = false,
  type
}: {
  children: React.ReactNode
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'ghost' | 'underline' | 'outline'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}): React.ReactNode {
  return (
    <button
      className={`rounded-lg ${!disabled ? 'transition-all duration-200 cursor-pointer' : ''} ${getSize(size)} ${getVariant(variant, disabled)}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button
