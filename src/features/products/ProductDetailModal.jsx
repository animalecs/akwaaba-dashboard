import { Badge } from '../../components/Badge'
import { LockBadge } from '../../components/LockBadge'
import { Modal } from '../../components/Modal'
import { ArrowUpRight, DollarSign, ImageIcon, Package, ShieldCheck } from 'lucide-react'

function formatMoney(value) {
    return `₵${new Intl.NumberFormat('en-GH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value ?? 0)}`
}

export function ProductDetailModal({ product, open, onClose, premiumAccess, onUpgrade }) {
    if (!product) return null

    const lastUpdate = new Date(product.lastUpdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    return (
        <Modal
            open={open}
            onClose={onClose}
            header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h2 className="truncate text-xl font-semibold text-slate-900 sm:text-2xl">{product.name}</h2>
                        <p className="mt-1 text-sm text-slate-600">{product.brand}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-left sm:text-right">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Last update</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{lastUpdate}</p>
                    </div>
                </div>
            }
        >
            <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5">
                        <div className="flex items-center gap-2 text-slate-500">
                            <DollarSign size={16} />
                            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Retail price</span>
                        </div>
                        <p className="mt-3 text-2xl font-semibold text-slate-900">{formatMoney(product.retailPrice)}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant="muted">{product.category}</Badge>
                            <Badge variant="muted">{product.countryEmoji}</Badge>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={!premiumAccess ? onUpgrade : undefined}
                        className={`overflow-hidden rounded-3xl border border-slate-200 text-left ${!premiumAccess ? 'transition hover:border-slate-300 hover:bg-slate-50' : ''}`}
                    >
                        <div className="flex min-h-[13rem] items-center justify-center bg-slate-100">
                            {premiumAccess && product.image ? (
                                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,#f8fafc,transparent_60%),linear-gradient(180deg,#e2e8f0_0%,#cbd5e1_100%)] px-6 text-center text-slate-500">
                                    <ImageIcon size={28} />
                                    {premiumAccess ? (
                                        <span className="text-sm font-medium">No image available</span>
                                    ) : (
                                        <LockBadge label="Premium only" />
                                    )}
                                </div>
                            )}
                        </div>
                    </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <button
                        type="button"
                        onClick={!premiumAccess ? onUpgrade : undefined}
                        className={`rounded-3xl border border-slate-200 bg-white p-5 text-left ${!premiumAccess ? 'transition hover:border-slate-300 hover:bg-slate-50' : ''}`}
                    >
                        <div className="flex items-center gap-2 text-slate-500">
                            <Package size={16} />
                            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Availability</span>
                        </div>
                        <div className="mt-3 text-lg font-semibold text-slate-900">
                            {premiumAccess ? product.availability : <LockBadge label="Premium only" />}
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={!premiumAccess ? onUpgrade : undefined}
                        className={`rounded-3xl border border-slate-200 bg-white p-5 text-left ${!premiumAccess ? 'transition hover:border-slate-300 hover:bg-slate-50' : ''}`}
                    >
                        <div className="flex items-center gap-2 text-slate-500">
                            <DollarSign size={16} />
                            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Wholesale Price</span>
                        </div>
                        <div className="mt-3 text-lg font-semibold text-slate-900">
                            {premiumAccess ? formatMoney(product.wholesalePrice) : <LockBadge label="Premium only" />}
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={!premiumAccess ? onUpgrade : undefined}
                        className={`rounded-3xl border border-slate-200 bg-white p-5 text-left ${!premiumAccess ? 'transition hover:border-slate-300 hover:bg-slate-50' : ''}`}
                    >
                        <div className="flex items-center gap-2 text-slate-500">
                            <ShieldCheck size={16} />
                            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Distributors</span>
                        </div>
                        <div className="mt-3 text-lg font-semibold text-slate-900">
                            {premiumAccess ? (product.registered ? 'Registered' : 'Not registered') : <LockBadge label="Premium only" />}
                        </div>
                    </button>
                </div>

                {!premiumAccess && (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-start gap-3 text-slate-900">
                            <ArrowUpRight size={18} className="mt-0.5 text-sky-600" />
                            <div>
                                <p className="text-sm font-semibold">Unlock the full product record</p>
                                <p className="mt-1 text-sm text-slate-600">Image, wholesale price, availability, and registration are available in premium.</p>
                            </div>
                        </div>
                        <button type="button" onClick={onUpgrade} className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
                            Unlock premium
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    )
}
