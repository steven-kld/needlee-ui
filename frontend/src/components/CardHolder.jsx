export default function CardHolder({ children, additional = "" }) {
  return (
    <div className={`z-10 w-full max-w-4xl rounded-3xl bg-gradient-to-br from-white/90 via-[#ecf2ff]/70 to-[#d8e8ff]/70 backdrop-blur shadow-[0_16px_32px_rgba(0,0,0,0.05),0_8px_16px_rgba(0,0,0,0.05)] ring-1 ring-white/70 overflow-hidden ${additional}`}>
      {children}
    </div>
  )
}
