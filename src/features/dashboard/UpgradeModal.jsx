import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { Check, TrendingUp } from 'lucide-react'

export function UpgradeModal({ open, onClose, onUpgrade, loading }) {
    return (
        <Modal open={open} onClose={onClose} title="" description="">
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500 font-semibold">Premium Plan</p>
                    <h2 className="text-5xl font-bold text-slate-900">$49<span className="text-2xl text-slate-600">/mo</span></h2>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Check size={20} className="text-emerald-600 flex-shrink-0" />
                        <span className="text-sm text-slate-700">Full wholesale and retail pricing</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Check size={20} className="text-emerald-600 flex-shrink-0" />
                        <span className="text-sm text-slate-700">Real-time availability status</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <TrendingUp size={20} className="text-emerald-600 flex-shrink-0" />
                        <span className="text-sm text-slate-700">Price change alerts</span>
                    </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 text-center">
                    <p>This keeps this work possible.</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="premium" onClick={onUpgrade} disabled={loading}>
                        {loading ? 'Processing…' : 'Continue to payment'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
