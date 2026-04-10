import { Modal } from '../../components/Modal'
import { Check, FileCheck2, PackageSearch, Sparkles } from 'lucide-react'

export function UpgradeModal({ open, onClose, onUpgrade, loading, successMessage, errorMessage }) {
    return (
        <Modal open={open} onClose={onClose} title="" description="">
            <div className="space-y-6">
                <div className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top,#dbeafe_0%,transparent_30%),linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#334155_100%)] p-6 text-white">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Premium Plan</p>
                            <h2 className="mt-3 text-5xl font-bold">€49<span className="text-2xl text-slate-300">/mo</span></h2>
                            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                                Unlock the commercial fields that matter when you are actively evaluating the Ghana market.
                            </p>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                            + VAT
                        </div>
                    </div>

                    <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-400/12 px-3 py-2 text-xs font-semibold text-emerald-200">
                        <Check size={14} />
                        Be first to access the paid release
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                            <PackageSearch size={18} />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-slate-900">Real market visibility</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">Understand what is actually selling, where, and how products move across the Ghanaian market.</p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                            <Sparkles size={18} />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-slate-900">Pricing & margins</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">See real retail and wholesale prices to evaluate margins and position your product correctly.</p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <FileCheck2 size={18} />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-slate-900">De-risk your entry</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">Validate products and avoid costly mistakes before committing to import, distribution, or registration.</p>
                    </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 text-center">
                    <p>This helps us keep field collection active and ship the paid version sooner.</p>
                </div>

                {successMessage ? (
                    <div className="rounded-3xl bg-emerald-50 px-4 py-4 text-center text-sm font-medium text-emerald-700">
                        {successMessage}
                    </div>
                ) : errorMessage ? (
                    <div className="rounded-3xl bg-rose-50 px-4 py-4 text-center text-sm font-medium text-rose-700">
                        {errorMessage}
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={onUpgrade}
                        disabled={loading}
                        className="flex w-full items-center justify-between rounded-2xl bg-[#635bff] px-4 py-3.5 text-left text-white shadow-[0_18px_40px_rgba(99,91,255,0.32)] transition hover:bg-[#564ee8] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <span className="flex items-center gap-3">
                            <span className="text-base font-semibold">Pay</span>
                            <span className="rounded-full bg-white/14 px-2 py-0.5 text-xs font-medium text-white/88">Powered by Stripe</span>
                        </span>
                        <span className="text-sm font-medium">{loading ? 'Sending…' : '€49/month'}</span>
                    </button>
                )}
            </div>
        </Modal>
    )
}
