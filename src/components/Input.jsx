export function Input({ label, ...props }) {
    return (
        <label className="block w-full text-sm text-slate-600">
            {label && <span className="mb-2 block font-medium text-slate-900">{label}</span>}
            <input
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                {...props}
            />
        </label>
    )
}
