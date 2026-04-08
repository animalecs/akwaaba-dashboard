import { useQuery } from '@tanstack/react-query'
import { getEntitlements } from '../api/index'

export function useEntitlement() {
    return useQuery(['entitlement'], getEntitlements, {
        staleTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}
