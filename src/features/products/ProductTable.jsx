import { useMemo, useState } from 'react'
import { Search, Filter, ArrowUpDown } from 'lucide-react'
import { Button } from '../../components/Button'
import { Badge } from '../../components/Badge'
import { LockBadge } from '../../components/LockBadge'

function formatMoney(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function formatDate(value) {
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const sortOptions = [
    { key: 'lastUpdate', label: 'Last update' },
    { key: 'brand', label: 'Brand' },
    { key: 'category', label: 'Category' },
]

export function ProductTable({ products, premiumAccess, onSelect, onUpgrade, onRefresh }) {
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [brandFilter, setBrandFilter] = useState('')
    const [registeredFilter, setRegisteredFilter] = useState('')
    const [sortKey, setSortKey] = useState('lastUpdate')

    const categories = useMemo(() => Array.from(new Set(products.map((item) => item.category))), [products])
    const brands = useMemo(() => Array.from(new Set(products.map((item) => item.brand))), [products])

    const filteredProducts = useMemo(() => {
        return products
            .filter((product) => {
                const matchesSearch = [product.name, product.brand, product.category, product.shortDescription]
                    .join(' ')
                    .toLowerCase()
                    .includes(search.toLowerCase())
                const matchesCategory = categoryFilter ? product.category === categoryFilter : true
                const matchesBrand = brandFilter ? product.brand === brandFilter : true
                const matchesRegistered = registeredFilter ? product.registered === registeredFilter : true
                return matchesSearch && matchesCategory && matchesBrand && matchesRegistered
            })
            .sort((a, b) => {
                if (sortKey === 'lastUpdate') {
                    return new Date(b.lastUpdate) - new Date(a.lastUpdate)
                }
                return a[sortKey].localeCompare(b[sortKey])
            })
    }, [products, search, categoryFilter, brandFilter, registeredFilter, sortKey])

    return (
        <div className="space-y-6">
            <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Product catalog</h2>
                            <p className="mt-1 text-sm text-slate-600">Browse products and inspect entitlement-based commercial visibility.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {/* <Button variant="secondary" onClick={onRefresh}>
                                Refresh
                            </Button>
                            <Button variant="premium" onClick={onUpgrade}>
                                Upgrade plan
                            </Button> */}
                        </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <label className="block text-sm text-slate-600">
                            <span className="mb-2 block font-medium text-slate-900">Search products</span>
                            <div className="relative">
                                <Search size={16} className="pointer-events-none absolute left-4 top-4 text-slate-400" />
                                <input
                                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search by name, brand or category"
                                />
                            </div>
                        </label>
                        <label className="block text-sm text-slate-600">
                            <span className="mb-2 block font-medium text-slate-900">Category</span>
                            <select className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                                <option value="">All categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </label>
                        <label className="block text-sm text-slate-600">
                            <span className="mb-2 block font-medium text-slate-900">Brand</span>
                            <select className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500" value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}>
                                <option value="">All brands</option>
                                {brands.map((brand) => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </label>
                        <label className="block text-sm text-slate-600">
                            <span className="mb-2 block font-medium text-slate-900">Registration</span>
                            <select className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500" value={registeredFilter} onChange={(event) => setRegisteredFilter(event.target.value)}>
                                <option value="">All statuses</option>
                                <option value="Yes">Registered</option>
                                <option value="No">Unregistered</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Filter size={16} />
                        Filtered list · {filteredProducts.length} products
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>Sort by</span>
                        <select className="h-10 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500" value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
                            {sortOptions.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                            ))}
                        </select>
                        <ArrowUpDown size={18} />
                    </div>
                </div>

                <div className="hidden lg:block">
                    <div className="overflow-hidden rounded-3xl border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-4 py-4 text-left font-semibold">Product</th>
                                    <th className="px-4 py-4 text-left font-semibold">Category</th>
                                    <th className="px-4 py-4 text-left font-semibold">Brand</th>
                                    <th className="px-4 py-4 text-left font-semibold">Registered</th>
                                    <th className="px-4 py-4 text-left font-semibold">Availability</th>
                                    <th className="px-4 py-4 text-left font-semibold">Wholesale</th>
                                    <th className="px-4 py-4 text-left font-semibold">Retail</th>
                                    <th className="px-4 py-4 text-left font-semibold">Last update</th>
                                    <th className="px-4 py-4 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="transition hover:bg-slate-50">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 overflow-hidden rounded-3xl bg-slate-100">
                                                    {product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400">No image</div>}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{product.name}</div>
                                                    <div className="text-sm text-slate-500">{product.shortDescription}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 font-medium text-slate-700">{product.category}</td>
                                        <td className="px-4 py-4 text-slate-600">{product.brand}</td>
                                        <td className="px-4 py-4"><Badge variant={product.registered === 'Yes' ? 'success' : 'warning'}>{product.registered}</Badge></td>
                                        <td className="px-4 py-4">{premiumAccess ? product.availability : <LockBadge label="Premium" />}</td>
                                        <td className="px-4 py-4">{premiumAccess ? formatMoney(product.wholesalePrice) : <LockBadge label="Premium" />}</td>
                                        <td className="px-4 py-4">{premiumAccess ? formatMoney(product.retailPrice) : <LockBadge label="Premium" />}</td>
                                        <td className="px-4 py-4">{formatDate(product.lastUpdate)}</td>
                                        <td className="px-4 py-4">
                                            <Button variant="secondary" onClick={() => onSelect(product)} className="text-xs px-3 py-2">
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-4 lg:hidden">
                    {filteredProducts.map((product) => (
                        <article key={product.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="h-16 w-16 overflow-hidden rounded-3xl bg-slate-200">
                                    {product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400">No image</div>}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{product.name}</h3>
                                            <p className="text-sm text-slate-600">{product.brand} · {product.category}</p>
                                        </div>
                                        <Badge variant={product.registered === 'Yes' ? 'success' : 'warning'}>{product.registered}</Badge>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
                                </div>
                            </div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-3xl bg-white p-3 text-sm text-slate-600">
                                    <div className="font-semibold text-slate-900">Availability</div>
                                    <div className="mt-1">{premiumAccess ? product.availability : <LockBadge label="Premium" />}</div>
                                </div>
                                <div className="rounded-3xl bg-white p-3 text-sm text-slate-600">
                                    <div className="font-semibold text-slate-900">Pricing</div>
                                    <div className="mt-1">{premiumAccess ? `${formatMoney(product.retailPrice)} / ${formatMoney(product.wholesalePrice)}` : <LockBadge label="Premium" />}</div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between gap-3">
                                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Updated {formatDate(product.lastUpdate)}</div>
                                <Button variant="secondary" onClick={() => onSelect(product)}>
                                    Details
                                </Button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    )
}
