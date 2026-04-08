export function Badge({ children, variant = 'default', className = '' }) {
    const styles = {
        default: 'bg-slate-100 text-slate-800',
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-amber-100 text-amber-800',
        premium: 'bg-sky-600 text-white',
        muted: 'bg-slate-200 text-slate-600',
    }
    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${styles[variant] || styles.default} ${className}`}>
            {children}
        </span>
    )
}
