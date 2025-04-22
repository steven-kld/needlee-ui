export default function Button({ children, onClick, icon = null, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-7 pr-8 py-3 w-fit rounded-full text-lg font-semibold transition drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]
        ${disabled
          ? 'bg-blue-300 text-white cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'}
      `}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </button>
  )
}
