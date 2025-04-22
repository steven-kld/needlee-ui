export default function Header({ children }) {
  return (
    <h2 className="text-4xl tracking-tight font-medium font-heading text-gray-900 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
      {children}
    </h2>
  )
}
