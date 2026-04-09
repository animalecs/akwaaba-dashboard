import { Lock } from 'lucide-react'

export function LockBadge({ label = 'Premium only', onClick, className = '' }) {
    const Component = onClick ? 'button' : 'span'

    return (
        <Component
            type={onClick ? 'button' : undefined}
            onClick={onClick}
            className={`inline-flex items-center gap-2 rounded-full border border-slate-700/20 bg-slate-900 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white shadow-sm transition ${onClick ? 'hover:bg-slate-800' : ''} ${className}`}
        >
            <Lock size={14} className="text-sky-200" />
            {label}
        </Component>
    )
}
