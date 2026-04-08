export function Card({ title, description, children, className = '' }) {
    return (
        <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-soft ${className}`}>
            {(title || description) && (
                <div className="mb-4">
                    {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
                    {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
                </div>
            )}
            {children}
        </div>
    )
}
