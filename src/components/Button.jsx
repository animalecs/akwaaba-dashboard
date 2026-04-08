export function Button({ children, variant = 'primary', className = '', ...props }) {
    const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
    const variants = {
        primary: 'bg-slate-900 text-white shadow-sm hover:bg-slate-800',
        secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
        ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
        premium: 'bg-sky-600 text-white shadow-lg shadow-sky-200/40 hover:bg-sky-500',
    }
    return (
        <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
            {children}
        </button>
    )
}
