export function Input({ type, value, onChange, placeholder }) {
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="border border-gray-300 p-2 rounded w-full" />;
}