export function Spinner({ size = '6', className = '' }) {
    return (
        <div className={`inline-flex items-center justify-center rounded-full border-2 border-slate-200 border-t-sky-500 ${className}`} style={{ width: `${size}rem`, height: `${size}rem` }}>
            <div className="h-full w-full animate-spin rounded-full border-2 border-transparent border-t-current" />
        </div>
    )
}

export function PageSpinner() {
    return (
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-soft">
            <Spinner size="4" />
        </div>
    )
}
