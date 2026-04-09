import { Lock } from 'lucide-react'

export function LockBadge({ label = 'Premium only', onClick, className = '' }) {
    const Component = onClick ? 'button' : 'span'

    return (
        <Component
            type={onClick ? 'button' : undefined}
            onClick={onClick}
            className={`inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 transition ${onClick ? 'hover:bg-slate-200' : ''} ${className}`}
        >
            <Lock size={14} />
            {label}
        </Component>
    )
}
