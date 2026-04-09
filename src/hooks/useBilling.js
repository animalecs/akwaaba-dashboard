import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCustomerPortalSession, registerPremiumInterest } from '../api/index'

export function usePremiumInterest() {
    const queryClient = useQueryClient()
    return useMutation(registerPremiumInterest, {
        onSuccess: () => {
            queryClient.invalidateQueries(['entitlement'], { exact: true })
        },
    })
}

export const useCheckoutSession = usePremiumInterest

export function useCustomerPortal() {
    return useMutation(createCustomerPortalSession, {
        onSuccess: (data) => {
            if (data.url) {
                window.location.href = data.url
            }
        },
    })
}
