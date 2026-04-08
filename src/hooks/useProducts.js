import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/index'

export function useProducts(filters = {}) {
    return useQuery(['products', filters], () => getProducts(filters), {
        staleTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}
