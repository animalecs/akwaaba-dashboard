import { Badge } from '../../components/Badge'
import { LockBadge } from '../../components/LockBadge'
import { Modal } from '../../components/Modal'
import { ArrowUpRight, CalendarDays, Package, CheckCircle2, MapPin, DollarSign } from 'lucide-react'

function formatMoney(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function ProductDetailModal({ product, open, onClose, premiumAccess, onUpgrade }) {
    if (!product) return null

    return (
        <Modal open={open} onClose={onClose} title={product.name} description={product.shortDescription}>
            <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
                <div className="space-y-4">
                    <div className="overflow-hidden rounded-3xl bg-slate-100">
                        {product.image ? (
                            <img src={product.image} alt={product.name} className="h-72 w-full object-cover" />
                        ) : (
                            <div className="flex h-72 items-center justify-center bg-slate-200 text-slate-500">No image available</div>
                        )}
                    </div>
                    <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="muted">{product.category}</Badge>
                            <Badge variant="muted">{product.brand}</Badge>
                            <Badge variant={product.registered === 'Yes' ? 'success' : 'warning'}>{product.registered === 'Yes' ? 'Registered' : 'Unregistered'}</Badge>
                        </div>
                        <p className="text-sm leading-6 text-slate-600">{product.description}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Package size={16} />
                                <span className="text-xs font-semibold uppercase tracking-[0.18em]">Availability</span>
                            </div>
                            <p className="mt-3 text-lg font-semibold text-slate-900">
                                {premiumAccess ? product.availability : <LockBadge label="Premium only" />}
                            </p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center gap-2 text-slate-500">
                                <DollarSign size={16} />
                                <span className="text-xs font-semibold uppercase tracking-[0.18em]">Pricing</span>
                            </div>
                            <div className="mt-3 space-y-2 text-slate-900">
                                <div className="text-sm text-slate-600">Wholesale</div>
                                <div className="text-lg font-semibold">{premiumAccess ? formatMoney(product.wholesalePrice) : <LockBadge label="Premium only" />}</div>
                            </div>
                            <div className="mt-4 space-y-2 text-slate-900">
                                <div className="text-sm text-slate-600">Retail</div>
                                <div className="text-lg font-semibold">{premiumAccess ? formatMoney(product.retailPrice) : <LockBadge label="Premium only" />}</div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Last update</p>
                                <p className="mt-2 text-lg font-semibold text-slate-900">{new Date(product.lastUpdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{product.registered}</div>
                        </div>
                        <div className="mt-6 flex items-center gap-3 text-slate-600">
                            <CheckCircle2 size={18} className="text-sky-600" />
                            <span className="text-sm">Data fields shown exactly as allowed by your current entitlement.</span>
                        </div>
                    </div>

                    {!premiumAccess && (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <div className="flex items-center gap-3 text-slate-900">
                                <ArrowUpRight size={18} className="text-sky-600" />
                                <div>
                                    <p className="text-sm font-semibold">Upgrade to unlock full commercial data</p>
                                    <p className="mt-1 text-sm text-slate-600">Gain access to wholesale pricing, live availability, and deeper product analytics.</p>
                                </div>
                            </div>
                            <button type="button" onClick={onUpgrade} className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
                                Upgrade to premium
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}
