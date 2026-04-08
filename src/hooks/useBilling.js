import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCheckoutSession, createCustomerPortalSession } from '../api/index'

export function useCheckoutSession() {
    const queryClient = useQueryClient()
    return useMutation(createCheckoutSession, {
        onSuccess: (data) => {
            if (data.url) {
                window.location.href = data.url
            }
            queryClient.invalidateQueries(['entitlement'], { exact: true })
        },
    })
}

export function useCustomerPortal() {
    return useMutation(createCustomerPortalSession, {
        onSuccess: (data) => {
            if (data.url) {
                window.location.href = data.url
            }
        },
    })
}
