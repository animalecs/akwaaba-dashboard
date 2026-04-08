import { useMemo, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useEntitlement } from '../../hooks/useEntitlement'
import { useProducts } from '../../hooks/useProducts'
import { useCheckoutSession } from '../../hooks/useBilling'
import { ProductTable } from '../products/ProductTable'
import { ProductDetailModal } from '../products/ProductDetailModal'
import { UpgradeModal } from './UpgradeModal'
import { Button } from '../../components/Button'
import { PageSpinner } from '../../components/Spinner'
import { User, ChevronDown, LogOut } from 'lucide-react'

export function DashboardPage() {
    const { user, signOut } = useAuth()
    const { data: entitlement, isLoading: entitlementLoading } = useEntitlement()
    const { data: products = [], isLoading: productsLoading, refetch } = useProducts()
    const checkout = useCheckoutSession()
    const [selected, setSelected] = useState(null)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

    const premiumAccess = entitlement?.premiumAccess === true

    const handleUpgrade = async () => {
        const result = await checkout.mutateAsync()
        if (result?.error) {
            window.alert(result.error)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                    <div>
                        <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Akwaaba dashboard</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="premium" onClick={() => setShowUpgradeModal(true)}>
                            Upgrade to premium
                        </Button>
                        <div className="relative">
                            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
                                <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-200">
                                    <User size={20} className="mt-1 ml-1 text-slate-500" />
                                </div>
                                <span>{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</span>
                                <ChevronDown size={16} />
                            </button>
                            {showUserMenu && (
                                <div className="absolute right-0 top-full mt-2 w-64 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</p>
                                            <p className="text-sm text-slate-600">{user?.email}</p>
                                            <p className="text-sm text-slate-600">{user?.user_metadata?.company_name}</p>
                                        </div>
                                        <button onClick={signOut} className="flex w-full items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
                                            <LogOut size={16} /> Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    {entitlementLoading || productsLoading ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-soft">
                            <PageSpinner />
                            <p className="mt-5 text-sm text-slate-600">Loading your dashboard…</p>
                        </div>
                    ) : (
                        <ProductTable
                            products={products}
                            premiumAccess={premiumAccess}
                            onSelect={(product) => setSelected(product)}
                            onUpgrade={handleUpgrade}
                            onRefresh={refetch}
                        />
                    )}
                </div>
            </div>

            <ProductDetailModal
                product={selected}
                open={Boolean(selected)}
                onClose={() => setSelected(null)}
                premiumAccess={premiumAccess}
                onUpgrade={() => setShowUpgradeModal(true)}
            />

            <UpgradeModal
                open={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                onUpgrade={handleUpgrade}
                loading={checkout.isLoading}
            />
        </div>
    )
}
