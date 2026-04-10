import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCustomerPortalSession, upgradeToPaidPlan } from '../api/index'

export function usePremiumUpgrade() {
    const queryClient = useQueryClient()
    return useMutation(upgradeToPaidPlan, {
        onSuccess: () => {
            queryClient.invalidateQueries(['entitlement'], { exact: true })
            queryClient.invalidateQueries(['products'])
        },
    })
}

export const useCheckoutSession = usePremiumUpgrade

export function useCustomerPortal() {
    return useMutation(createCustomerPortalSession, {
        onSuccess: (data) => {
            if (data.url) {
                window.location.href = data.url
            }
        },
    })
}
