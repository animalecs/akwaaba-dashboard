import { Modal } from '../../components/Modal'
import { ArrowRight, Check, Lock, ScanSearch, Sparkles } from 'lucide-react'

export function UpgradeModal({ open, onClose, onUpgrade, loading, successMessage, errorMessage }) {
    return (
        <Modal open={open} onClose={onClose} title="" description="">
            <div className="relative space-y-6">
                <div className="pointer-events-none absolute left-1/2 top-16 hidden h-px w-16 -translate-x-1/2 border-t-2 border-dashed border-slate-300 lg:block" />

                <div className="grid gap-4 lg:grid-cols-2">
                    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xl font-semibold text-white">
                                1
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-[2.25rem]">
                                    Join the paid beta
                                </h2>
                                <p className="mt-4 text-base leading-8 text-slate-700 sm:text-lg">
                                    Pretotype the upgrade flow and reserve premium access to live Ghana market data collected by our local team.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
                            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-4">
                                <span className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Monthly</span>
                                <span className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">+ VAT</span>
                                <span className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">Beta access</span>
                            </div>

                            <div className="space-y-4 px-4 py-5">
                                <div className="flex items-center justify-between rounded-[1.25rem] bg-white px-4 py-4 shadow-sm ring-1 ring-slate-200/80">
                                    <span className="text-sm font-medium text-slate-500">Plan</span>
                                    <span className="text-lg font-semibold text-slate-900">Paid</span>
                                </div>
                                <div className="flex items-center justify-between rounded-[1.25rem] bg-white px-4 py-4 shadow-sm ring-1 ring-slate-200/80">
                                    <span className="text-sm font-medium text-slate-500">Access</span>
                                    <span className="text-lg font-semibold text-slate-900">Prices + availability</span>
                                </div>
                                <div className="flex items-end justify-between px-1 pt-2">
                                    <span className="text-base text-slate-500">Total due</span>
                                    <span className="text-[2.5rem] font-semibold tracking-[-0.04em] text-slate-900">€49</span>
                                </div>
                            </div>
                        </div>

                        {!successMessage && (
                            <button
                                type="button"
                                onClick={onUpgrade}
                                disabled={loading}
                                className="mt-5 flex w-full items-center justify-between rounded-2xl bg-[#635bff] px-4 py-3.5 text-left text-white shadow-[0_18px_40px_rgba(99,91,255,0.32)] transition hover:bg-[#564ee8] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="text-base font-semibold">{loading ? 'Sending…' : 'Pay'}</span>
                                    <span className="rounded-full bg-white/14 px-2 py-0.5 text-xs font-medium text-white/88">Powered by Stripe</span>
                                </span>
                                <span className="text-sm font-medium">{loading ? 'Please wait' : '€49/month'}</span>
                            </button>
                        )}
                    </section>

                    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xl font-semibold text-white">
                                2
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-[2.25rem]">
                                    Unlock the intelligence layer
                                </h2>
                                <p className="mt-4 text-base leading-8 text-slate-700 sm:text-lg">
                                    The paid view opens the commercial fields that matter most when you assess the Ghana opportunity.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-[1rem] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
                                        <div className="flex items-center gap-3 text-slate-900">
                                            <ScanSearch size={18} />
                                            <span className="text-sm font-semibold">Verified market checks</span>
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-slate-600">
                                            Track retail pricing and verified shelf presence collected on the ground.
                                        </p>
                                    </div>
                                    <div className="rounded-[1rem] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
                                        <div className="flex items-center gap-3 text-slate-900">
                                            <Lock size={18} />
                                            <span className="text-sm font-semibold">Premium fields</span>
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-slate-600">
                                            See wholesale price, registration evidence and availability signals in one place.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between rounded-[1rem] bg-slate-900 px-4 py-4 text-white">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Status</p>
                                        <p className="mt-2 text-lg font-semibold">Premium dashboard ready</p>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                                        {successMessage ? <Check size={18} /> : <ArrowRight size={18} />}
                                    </div>
                                </div>
                            </div>

                            <p className="mt-5 text-base leading-8 text-slate-700">
                                For full examples and deeper commercial validation, the paid beta gives early access to the richer product intelligence view.
                            </p>
                        </div>

                        {successMessage ? (
                            <div className="mt-5 rounded-[1.5rem] bg-emerald-50 px-5 py-4 text-sm font-medium leading-7 text-emerald-700 ring-1 ring-emerald-200">
                                {successMessage}
                            </div>
                        ) : errorMessage ? (
                            <div className="mt-5 rounded-[1.5rem] bg-rose-50 px-5 py-4 text-sm font-medium leading-7 text-rose-700 ring-1 ring-rose-200">
                                {errorMessage}
                            </div>
                        ) : (
                            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 ring-1 ring-amber-200">
                                <Sparkles size={14} />
                                Early beta access
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </Modal>
    )
}
