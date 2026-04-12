import { useEffect, useMemo, useState } from 'react'
import DataTable from 'react-data-table-component'
import { AlertTriangle, CircleHelp, Filter, Search, ShieldCheck, TrendingUp } from 'lucide-react'
import { Button } from '../../components/Button'
import { LockBadge } from '../../components/LockBadge'

function formatMoney(value) {
    return `₵${new Intl.NumberFormat('en-GH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value ?? 0)}`
}

function formatPercent(value) {
    return `${Math.round(value)}%`
}

function useIsMobile(breakpoint = 768) {
    const getMatches = () => {
        if (typeof window === 'undefined') return false
        return window.innerWidth < breakpoint
    }

    const [isMobile, setIsMobile] = useState(getMatches)

    useEffect(() => {
        function handleResize() {
            setIsMobile(getMatches())
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [breakpoint])

    return isMobile
}

function getAvailabilityMeta(availability) {
    if (availability === 'In stock') {
        return {
            label: 'High availability',
            className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        }
    }

    if (availability === 'Limited') {
        return {
            label: 'Medium availability',
            className: 'border-amber-200 bg-amber-50 text-amber-700',
        }
    }

    return {
        label: 'Low availability',
        className: 'border-rose-200 bg-rose-50 text-rose-700',
    }
}

function getRegistrationMeta(product) {
    if (product.registered === true) {
        return {
            label: 'Verified docs',
            className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        }
    }

    return {
        label: 'Not verified',
        className: 'border-slate-200 bg-slate-100 text-slate-600',
    }
}

function getMarketSignal(product) {
    const ratio = product.wholesalePrice > 0 ? product.retailPrice / product.wholesalePrice : 0

    if (product.availability === 'Out of stock') {
        return {
            label: 'Low availability',
            className: 'border-rose-200 bg-rose-50 text-rose-700',
        }
    }

    if (ratio >= 1.85) {
        return {
            label: 'Price unstable',
            className: 'border-amber-200 bg-amber-50 text-amber-700',
        }
    }

    if (product.availability === 'In stock' && product.registered) {
        return {
            label: 'Strong distribution',
            className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        }
    }

    if (product.availability === 'Limited') {
        return {
            label: 'High demand',
            className: 'border-amber-200 bg-amber-50 text-amber-700',
        }
    }

    return {
        label: 'Watch closely',
        className: 'border-slate-200 bg-slate-100 text-slate-600',
    }
}

function Badge({ children, className = '' }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>
            {children}
        </span>
    )
}

const tableStyles = {
    table: {
        style: {
            backgroundColor: 'transparent',
        },
    },
    headRow: {
        style: {
            minHeight: '54px',
            borderTopLeftRadius: '1.5rem',
            borderTopRightRadius: '1.5rem',
            border: '1px solid rgb(226 232 240)',
            borderBottomWidth: '1px',
            background: 'linear-gradient(180deg, rgb(255 255 255) 0%, rgb(248 250 252) 100%)',
        },
    },
    headCells: {
        style: {
            color: 'rgb(71 85 105)',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
        },
    },
    rows: {
        style: {
            minHeight: '92px',
            borderLeft: '1px solid rgb(226 232 240)',
            borderRight: '1px solid rgb(226 232 240)',
            borderBottom: '1px solid rgb(226 232 240)',
            backgroundColor: 'rgb(255 255 255)',
            cursor: 'pointer',
        },
        highlightOnHoverStyle: {
            backgroundColor: 'rgb(248 250 252)',
            outline: 'none',
        },
        stripedStyle: {
            backgroundColor: 'rgb(250 250 250)',
        },
    },
    cells: {
        style: {
            paddingTop: '1rem',
            paddingBottom: '1rem',
        },
    },
    pagination: {
        style: {
            border: '1px solid rgb(226 232 240)',
            borderTop: '0',
            borderBottomLeftRadius: '1.5rem',
            borderBottomRightRadius: '1.5rem',
            minHeight: '68px',
        },
    },
}

export function ProductTable({ products, premiumAccess, onSelect, onUpgrade }) {
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [brandFilter, setBrandFilter] = useState('')
    const [registeredFilter, setRegisteredFilter] = useState('')
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
    const isMobile = useIsMobile()

    const categories = useMemo(() => Array.from(new Set(products.map((item) => item.category).filter(Boolean))), [products])
    const brands = useMemo(
        () => Array.from(new Set(products.map((item) => item.brand).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
        [products]
    )

    const enrichedProducts = useMemo(() => {
        return products.map((product) => ({
            ...product,
            availabilityMeta: getAvailabilityMeta(product.availability),
            registrationMeta: getRegistrationMeta(product),
            marketSignal: getMarketSignal(product),
        }))
    }, [products])

    const filteredProducts = useMemo(() => {
        return enrichedProducts.filter((product) => {
            const matchesSearch = [product.name, product.brand, product.category, product.shortDescription, product.description]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(search.trim().toLowerCase())
            const matchesCategory = categoryFilter ? product.category === categoryFilter : true
            const matchesBrand = brandFilter ? product.brand === brandFilter : true
            const matchesRegistered = registeredFilter ? product.registered === (registeredFilter === 'Yes') : true
            return matchesSearch && matchesCategory && matchesBrand && matchesRegistered
        })
    }, [enrichedProducts, search, categoryFilter, brandFilter, registeredFilter])

    const summary = useMemo(() => {
        const total = filteredProducts.length
        const highAvailabilityCount = filteredProducts.filter((item) => item.availability === 'In stock').length
        const lowAvailabilityCount = filteredProducts.filter((item) => item.availability !== 'In stock').length
        const unstablePricesCount = filteredProducts.filter((item) => item.marketSignal.label === 'Price unstable').length

        return {
            total,
            highAvailabilityRate: total ? (highAvailabilityCount / total) * 100 : 0,
            lowAvailabilityRate: total ? (lowAvailabilityCount / total) * 100 : 0,
            unstablePricesCount,
        }
    }, [filteredProducts])

    const openUpgrade = () => onUpgrade?.()

    useEffect(() => {
        setResetPaginationToggle((current) => !current)
    }, [search, categoryFilter, brandFilter, registeredFilter])

    const columns = useMemo(() => {
        const baseColumns = [
            {
                name: 'Product',
                grow: 2.2,
                sortable: true,
                sortFunction: (a, b) => a.name.localeCompare(b.name),
                cell: (product) => (
                    <div className="min-w-0 py-1">
                        <div className="truncate text-[0.98rem] font-semibold leading-6 text-slate-900">{product.name}</div>
                        <div className="mt-1 text-xs text-slate-500">{product.category}</div>

                    </div>
                ),
            },
            {
                name: 'Brand',
                sortable: true,
                selector: (product) => product.brand ?? '',
                cell: (product) => <span className="text-sm font-medium text-slate-700">{product.brand || 'Unknown'}</span>,
            },
            {
                name: 'Retail Price',
                sortable: true,
                sortFunction: (a, b) => a.retailPrice - b.retailPrice,
                cell: (product) => (
                    <div className="space-y-1">
                        <div className="text-sm font-semibold text-slate-900">{formatMoney(product.retailPrice)}</div>
                    </div>
                ),
            },
            {
                name: '',
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
                cell: (product) => (
                    <Button
                        variant="secondary"
                        onClick={(event) => {
                            event.stopPropagation()
                            onSelect(product)
                        }}
                        className="border-slate-300 bg-slate-900 px-3 py-2 text-xs shadow-sm hover:bg-slate-800"
                    >
                        View
                    </Button>
                ),
            },
        ]

        if (isMobile) {
            return baseColumns
        }

        return [
            baseColumns[0],
            baseColumns[1],
            {
                name: 'Country',
                sortable: true,
                selector: (product) => product.country ?? '',
                cell: (product) => (
                    <div className="space-y-1 text-center">
                        {product.country}
                    </div>
                ),
                center: true,
            },
            {
                name: 'Documentation Status',
                sortable: true,
                selector: (product) => product.registrationMeta.label,
                cell: (product) => <Badge className={product.registrationMeta.className}>{product.registrationMeta.label}</Badge>,
            },
            baseColumns[2],
            baseColumns[3],
        ]
    }, [isMobile, onSelect])

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(200,169,81,0.12),transparent_28%),linear-gradient(180deg,#ffffff_0%,#fcfcfb_100%)] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                <div className="space-y-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6b1f]">Market intelligence</p>
                            <h2 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">Products Currently Selling in Kumasi</h2>
                            {/* <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                Track commercial signals across the Kumasi market with pricing, availability, registration evidence, and market-level flags.
                            </p> */}
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
                                    placeholder="Search by product, brand or category"
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
                            <span className="mb-2 flex items-center gap-2 font-medium text-slate-900">
                                <span>Documentation Status</span>
                                <span className="group relative inline-flex">
                                    <button
                                        type="button"
                                        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition hover:text-slate-700"
                                        aria-label="Registration info"
                                    >
                                        <CircleHelp size={15} />
                                    </button>
                                    <span className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-10 w-64 -translate-x-1/2 rounded-2xl bg-slate-900 px-3 py-2 text-xs font-normal leading-5 text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
                                        Documentation status indicates whether the company has provided supporting documents. Other products may also be registered, but their documentation has not yet been verified by us.
                                    </span>
                                </span>
                            </span>
                            <select className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500" value={registeredFilter} onChange={(event) => setRegisteredFilter(event.target.value)}>
                                <option value="">All statuses</option>
                                <option value="Yes">Verified docs</option>
                                <option value="No">Not verified</option>
                            </select>
                        </label>
                    </div>
                </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">

                        <span>· {filteredProducts.length} products with active market signals</span>
                    </div>
                    {/* <p className="text-xs text-slate-500">Tap a row or use View to open product details.</p> */}
                </div>

                <div className="overflow-hidden rounded-[1.5rem]">
                    <DataTable
                        columns={columns}
                        data={filteredProducts}
                        customStyles={tableStyles}
                        responsive
                        striped
                        highlightOnHover
                        pointerOnHover
                        dense={isMobile}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={isMobile ? [10, 20] : [10, 20, 50]}
                        paginationResetDefaultPage={resetPaginationToggle}
                        onRowClicked={onSelect}
                        noDataComponent={<div className="px-4 py-12 text-sm text-slate-500">No products match the current filters.</div>}
                    />
                </div>
            </section>
        </div>
    )
}
