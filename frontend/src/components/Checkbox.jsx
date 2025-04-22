export default function Checkbox({ children, onChange, checked }) {
  return (
    <label className="flex mt-4 items-baseline space-x-2 text-base text-gray-600 cursor-pointer">
      <input
        type="checkbox"
        className="form-checkbox"
        onChange={onChange}
        checked={checked}
      />
      <span>{children}</span>
    </label>
  )
}
