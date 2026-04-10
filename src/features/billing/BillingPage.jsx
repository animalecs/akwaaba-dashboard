import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useEntitlement } from '../../hooks/useEntitlement'
import { useCheckoutSession, useCustomerPortal } from '../../hooks/useBilling'
import { Button } from '../../components/Button'
import { Badge } from '../../components/Badge'
import { Card } from '../../components/Card'
import { ArrowRight, CreditCard, ShieldCheck, Clock3 } from 'lucide-react'

const planFeatures = [
    { label: 'View public product catalog', free: true, premium: true },
    { label: 'Inspect commercial pricing', free: false, premium: true },
    { label: 'Live availability status', free: false, premium: true },
    { label: 'Billing portal access', free: false, premium: true },
    { label: 'Entitlement-backed controls', free: true, premium: true },
]

export function BillingPage() {
    const { user, signOut } = useAuth()
    const { data: entitlement } = useEntitlement()
    const checkout = useCheckoutSession()
    const portal = useCustomerPortal()

    const premiumAccess = entitlement?.premiumAccess === true
    const planLabel = useMemo(() => (premiumAccess ? 'Premium' : 'Free'), [premiumAccess])

    const handleUpgrade = async () => {
        const result = await checkout.mutateAsync()
        if (result?.error) {
            window.alert(result.error)
        }
    }

    const handlePortal = async () => {
        const result = await portal.mutateAsync()
        if (result?.error) {
            window.alert(result.error)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Subscription</p>
                        <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Billing center</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            <ArrowRight size={16} /> Back to dashboard
                        </Link>
                        <button onClick={signOut} className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            Sign out
                        </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                    <aside className="space-y-6">
                        <Card title="Your plan" description="Current entitlement status managed by the backend.">
                            <div className="space-y-4">
                                <div className="rounded-3xl bg-slate-50 p-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Plan</p>
                                            <p className="mt-2 text-2xl font-semibold text-slate-900">{planLabel}</p>
                                        </div>
                                        <Badge variant={premiumAccess ? 'premium' : 'muted'}>{planLabel}</Badge>
                                    </div>
                                    <p className="mt-4 text-sm leading-6 text-slate-600">{premiumAccess ? 'Your team currently has premium access to commercial product fields.' : 'Upgrade to premium for wholesale pricing, availability, and billing controls.'}</p>
                                </div>
                                <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5">
                                    <div className="flex items-center gap-3 text-slate-700"><CreditCard size={18} /> <span className="text-sm font-semibold">Billing workflow</span></div>
                                    <p className="text-sm text-slate-600">Use the customer portal for recurring billing, payment methods, and subscription details once your backend supports it.</p>
                                </div>
                            </div>
                        </Card>
                    </aside>

                    <main className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <Card title="Billing actions">
                                <div className="space-y-4">
                                    {!premiumAccess ? (
                                        <Button variant="premium" className="w-full" onClick={handleUpgrade} disabled={checkout.isLoading}>
                                            {checkout.isLoading ? 'Preparing checkout…' : 'Upgrade to premium'}
                                        </Button>
                                    ) : (
                                        <Button variant="secondary" className="w-full" onClick={handlePortal} disabled={portal.isLoading}>
                                            {portal.isLoading ? 'Opening portal…' : 'Manage subscription'}
                                        </Button>
                                    )}
                                    <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                                        <p className="font-semibold text-slate-900">Note</p>
                                        <p className="mt-2">Billing actions currently rely on backend endpoints. The frontend is prepared to call /billing/checkout-session and /billing/customer-portal.</p>
                                    </div>
                                </div>
                            </Card>
                            <Card title="Usage guidance">
                                <div className="space-y-4 text-sm text-slate-600">
                                    <p className="font-semibold text-slate-900">Premium unlocks:</p>
                                    <ul className="space-y-2 list-disc pl-5">
                                        <li>Wholesale and retail pricing data</li>
                                        <li>Live stock availability</li>
                                        <li>Customer portal subscription management</li>
                                    </ul>
                                </div>
                            </Card>
                        </div>

                        <Card title="Feature comparison" description="Compare what is accessible on each plan.">
                            <div className="space-y-4">
                                {planFeatures.map((feature) => (
                                    <div key={feature.label} className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1fr_auto_auto]">
                                        <div className="text-sm text-slate-700">{feature.label}</div>
                                        <div className="flex items-center justify-end text-sm font-semibold text-slate-700">{feature.free ? 'Yes' : 'No'}</div>
                                        <div className="flex items-center justify-end text-sm font-semibold text-slate-700">{feature.premium ? 'Yes' : 'No'}</div>
                                    </div>
                                ))}
                                <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_auto_auto] text-sm font-semibold text-slate-800">
                                    <span>Plan</span>
                                    <span className="text-right">Free</span>
                                    <span className="text-right">Premium</span>
                                </div>
                            </div>
                        </Card>
                    </main>
                </div>
            </div>

            <footer className="border-t border-slate-200 bg-white px-4 py-5 sm:px-6">
                <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-slate-900">Akwaaba Ltd</p>
                    <p>For feedbacks, bugs or suggestions write at <a href="mailto:amina@akwaabaltd.com" className="text-blue-500 hover:underline">amina@akwaabaltd.com</a></p>
                </div>
            </footer>
        </div>
    )
}
