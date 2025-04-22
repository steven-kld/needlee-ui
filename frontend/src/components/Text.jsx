export default function Text({ children, size = "lg" }) {
  return (
    <p className={`text-${size} text-gray-900 mt-2 leading-snug drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]`}>
      {children}
    </p>
  )
}
