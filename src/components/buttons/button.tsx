function getSize (size: 'sm' | 'md' | 'lg' | 'xl'): string {
  switch (size) {
    case 'sm': return 'px-2 py-1 text-sm'
    case 'md': return 'px-4 py-2 text-md'
    case 'lg': return 'px-6 py-3 text-lg'
    case 'xl': return 'px-8 py-4 text-xl'
  }
}

function getVariant (variant: 'primary' | 'secondary' | 'ghost' | 'underline' | 'outline', disabled = false): string {
  switch (variant) {
    case 'primary': return disabled ? 'bg-royal-blue-800 text-royal-blue-50' : 'bg-royal-blue-950 text-royal-blue-50'
    case 'secondary': return disabled ? 'bg-black-950 text-black-50' : 'bg-black-950 text-black-50'
    case 'ghost': return disabled ? 'bg-black-950 text-black-50' : 'bg-black-950 text-black-50'
    case 'underline': return disabled ? 'bg-transparent text-black-950 underline-offset-4 underline-2' : 'bg-transparent text-black-950 underline-offset-4 underline-2'
    case 'outline': return disabled ? 'bg-transparent text-black-950 outline-2 outline-offset-2' : 'bg-transparent text-black-950 outline-2 outline-offset-2'
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
      className={`rounded-md ${disabled ? '' : 'transition-all duration-300 cursor-pointer'} ${getSize(size)} ${getVariant(variant)} ${disabled ? 'opacity-50' : ''}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button
