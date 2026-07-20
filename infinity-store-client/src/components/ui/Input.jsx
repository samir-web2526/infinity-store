export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 ${className}`.trim()}
      {...props}
    />
  );
}
