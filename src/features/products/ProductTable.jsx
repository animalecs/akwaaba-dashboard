import { useEffect, useMemo, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Search, Filter, CircleHelp } from 'lucide-react'
import { Button } from '../../components/Button'
import { LockBadge } from '../../components/LockBadge'

function formatMoney(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
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

const tableStyles = {
    table: {
        style: {
            backgroundColor: 'transparent',
        },
    },
    headRow: {
        style: {
            minHeight: '52px',
            borderTopLeftRadius: '1.25rem',
            borderTopRightRadius: '1.25rem',
            border: '1px solid rgb(226 232 240)',
            borderBottomWidth: '1px',
            backgroundColor: 'rgb(248 250 252)',
        },
    },
    headCells: {
        style: {
            color: 'rgb(100 116 139)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
        },
    },
    rows: {
        style: {
            minHeight: '78px',
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
    },
    cells: {
        style: {
            paddingTop: '0.8rem',
            paddingBottom: '0.8rem',
        },
    },
    pagination: {
        style: {
            border: '1px solid rgb(226 232 240)',
            borderTop: '0',
            borderBottomLeftRadius: '1.25rem',
            borderBottomRightRadius: '1.25rem',
            minHeight: '64px',
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
    const brands = useMemo(() => Array.from(new Set(products.map((item) => item.brand).filter(Boolean))), [products])

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = [product.name, product.brand, product.category, product.shortDescription]
                .join(' ')
                .toLowerCase()
                .includes(search.toLowerCase())
            const matchesCategory = categoryFilter ? product.category === categoryFilter : true
            const matchesBrand = brandFilter ? product.brand === brandFilter : true
            const matchesRegistered = registeredFilter ? product.registered === (registeredFilter === 'Yes') : true
            return matchesSearch && matchesCategory && matchesBrand && matchesRegistered
        })
    }, [products, search, categoryFilter, brandFilter, registeredFilter])

    const openUpgrade = () => onUpgrade?.()

    useEffect(() => {
        setResetPaginationToggle((current) => !current)
    }, [search, categoryFilter, brandFilter, registeredFilter])

    const columns = useMemo(() => {
        const shared = [
            {
                name: 'Product',
                grow: 2.2,
                sortable: true,
                sortFunction: (a, b) => a.name.localeCompare(b.name),
                cell: (product) => (
                    <div className="min-w-0 py-1">
                        <div className="truncate text-sm font-semibold text-slate-900">{product.name}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                            <span>{product.category}</span>
                        </div>
                    </div>
                ),
            },
            {
                name: 'Retail Price',
                width: isMobile ? '110px' : '150px',
                sortable: true,
                sortFunction: (a, b) => a.retailPrice - b.retailPrice,
                cell: (product) => <span className="text-sm font-semibold text-slate-900">{formatMoney(product.retailPrice)}</span>,
            },
            {
                name: 'Availability',
                width: isMobile ? '140px' : '160px',
                cell: (product) => (
                    <div className="text-sm">
                        {premiumAccess ? product.availability : <LockBadge label="Premium only" onClick={openUpgrade} />}
                    </div>
                ),
            },
            {
                name: '',
                width: isMobile ? '96px' : '110px',
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
                        className="px-3 py-2 text-xs"
                    >
                        View
                    </Button>
                ),
            },
        ]

        if (isMobile) {
            return shared
        }

        return [
            shared[0],
            {
                name: 'Brand',
                selector: (product) => product.brand,
                sortable: true,
                cell: (product) => <span className="text-sm text-slate-700">{product.brand}</span>,
            },
            {
                name: 'Country',
                sortable: true,
                selector: (product) => product.country ?? '',
                cell: (product) => <span >{product.country}</span>,
                center: true,
            },
            shared[1],
            shared[2],
            shared[3],
        ]
    }, [isMobile, onSelect, premiumAccess])

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Product catalog</h2>
                        <p className="mt-1 text-sm text-slate-600">Search, filter, sort, and open product details from the main catalog.</p>
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
                            <span className="mb-2 flex items-center gap-2 font-medium text-slate-900">
                                <span>Registration</span>
                                <span className="group relative inline-flex">
                                    <button
                                        type="button"
                                        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition hover:text-slate-700"
                                        aria-label="Registration info"
                                    >
                                        <CircleHelp size={15} />
                                    </button>
                                    <span className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-10 w-64 -translate-x-1/2 rounded-2xl bg-slate-900 px-3 py-2 text-xs font-normal leading-5 text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
                                        Registration means the company provided us documents. Other products may be registered too, but we do not have the verified documents yet.
                                    </span>
                                </span>
                            </span>
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
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Filter size={16} />
                        Filtered list · {filteredProducts.length} products
                    </div>
                    <p className="text-xs text-slate-500">Tap a row or use View to open product details.</p>
                </div>

                <div className="overflow-hidden rounded-[1.25rem]">
                    <DataTable
                        columns={columns}
                        data={filteredProducts}
                        customStyles={tableStyles}
                        responsive
                        striped={false}
                        highlightOnHover
                        pointerOnHover
                        dense={isMobile}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={isMobile ? [10, 20] : [10, 20, 50]}
                        paginationResetDefaultPage={resetPaginationToggle}
                        onRowClicked={onSelect}
                        noDataComponent={<div className="px-4 py-10 text-sm text-slate-500">No products match the current filters.</div>}
                    />
                </div>
            </div>
        </div>
    )
}
