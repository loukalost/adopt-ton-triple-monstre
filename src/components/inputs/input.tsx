function InputField ({
  type,
  name,
  label,
  value,
  onChange,
  onChangeText,
  error
}: {
  type?: string
  name?: string
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeText?: (text: string) => void
  error?: string
}): React.ReactNode {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange !== undefined) onChange(e)
    if (onChangeText !== undefined) onChangeText(e.target.value)
  }

  return (
    <div className='flex flex-col space-y-2'>
      {(label != null && label.length > 0) && (
        <label className='text-sm font-semibold text-slate-900'>
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 rounded-lg border bg-white
          transition-all duration-200 text-slate-900 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900
          ${(error != null && error.length > 0) ? 'border-red-500 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
        `}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={`Saisissez votre ${label?.toLowerCase().replace(':', '') ?? 'information'}`}
      />
      {(error != null && error.length > 0) && (
        <span className='text-sm text-red-600 font-medium'>
          {error}
        </span>
      )}
    </div>
  )
}

export default InputField
