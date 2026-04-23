import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

export const CURRENCY_OPTIONS = [
    { code: 'GHS', label: 'GHS', locale: 'en-GH' },
    { code: 'USD', label: 'USD', locale: 'en-US' },
    { code: 'EUR', label: 'EUR', locale: 'en-IE' },
]

const DEFAULT_CURRENCY = 'GHS'
const STORAGE_KEY = 'akwaaba.currency'
const RATE_URL = 'https://api.openexchangeapi.com/v1/latest?base=GHS&symbol=USD&symbol=EUR'

function getStoredCurrency() {
    if (typeof window === 'undefined') return DEFAULT_CURRENCY

    const storedCurrency = window.localStorage.getItem(STORAGE_KEY)
    return CURRENCY_OPTIONS.some((option) => option.code === storedCurrency) ? storedCurrency : DEFAULT_CURRENCY
}

async function fetchGhsExchangeRates() {
    const response = await fetch(RATE_URL)

    if (!response.ok) {
        throw new Error('Unable to load exchange rates.')
    }

    const data = await response.json()

    if (!data.rates?.USD || !data.rates?.EUR) {
        throw new Error('Exchange rate response is missing USD or EUR rates.')
    }

    return {
        base: 'GHS',
        rates: {
            GHS: 1,
            USD: data.rates.USD,
            EUR: data.rates.EUR,
        },
        updatedAt: data.timestamp ? new Date(data.timestamp * 1000).toUTCString() : null,
    }
}

export function useCurrency() {
    const [currency, setCurrencyState] = useState(getStoredCurrency)

    const ratesQuery = useQuery({
        queryKey: ['exchange-rates', 'GHS'],
        queryFn: fetchGhsExchangeRates,
        staleTime: 60 * 60 * 1000,
        cacheTime: 6 * 60 * 60 * 1000,
        retry: 1,
    })

    const setCurrency = (nextCurrency) => {
        if (!CURRENCY_OPTIONS.some((option) => option.code === nextCurrency)) return
        setCurrencyState(nextCurrency)
    }

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, currency)
    }, [currency])

    const value = useMemo(() => ({
        currency,
        setCurrency,
        rates: ratesQuery.data?.rates ?? { GHS: 1 },
        ratesUpdatedAt: ratesQuery.data?.updatedAt ?? null,
        ratesLoading: ratesQuery.isLoading,
        ratesError: ratesQuery.error,
    }), [currency, ratesQuery.data, ratesQuery.error, ratesQuery.isLoading])

    return value
}

export function formatGhsAmount(value, currency, rates) {
    const selectedOption = CURRENCY_OPTIONS.find((option) => option.code === currency) ?? CURRENCY_OPTIONS[0]
    const hasSelectedRate = selectedOption.code === 'GHS' || Boolean(rates?.[selectedOption.code])
    const formatOption = hasSelectedRate ? selectedOption : CURRENCY_OPTIONS[0]
    const rate = rates?.[formatOption.code]
    const amount = Number(value ?? 0)
    const convertedAmount = formatOption.code === 'GHS' || !rate ? amount : amount * rate

    return new Intl.NumberFormat(formatOption.locale, {
        style: 'currency',
        currency: formatOption.code,
        minimumFractionDigits: formatOption.code === 'GHS' ? 0 : 2,
        maximumFractionDigits: formatOption.code === 'GHS' ? 0 : 2,
    }).format(convertedAmount)
}
