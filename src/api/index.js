import { supabase } from '../lib/supabaseClient'

export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
}

export async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
}

export async function signUp({ email, password, metadata = {} }) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: metadata.first_name,
                last_name: metadata.last_name,
                company_name: metadata.company_name,
                company_type: metadata.company_type,
            },
        },
    })
    if (error) throw error
    return data
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export async function getEntitlements() {
    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user?.user) {
        throw new Error('User not authenticated')
    }

    const { data: entitlement } = await supabase
        .from('user_entitlements')
        .select('plan, can_view_prices, can_view_availability, next_billing_date')
        .eq('user_id', user.user.id)
        .maybeSingle()

    const isPremium = entitlement
        ? entitlement.plan === 'premium' || entitlement.can_view_prices === true || entitlement.can_view_availability === true
        : false

    return {
        plan: entitlement?.plan || (isPremium ? 'premium' : 'free'),
        premiumAccess: isPremium,
        nextBilling: entitlement?.next_billing_date || null,
    }
}

// Map country codes to flag emoji
function countryToEmoji(countryCode) {
    if (!countryCode) return '🌍'
    const code = countryCode.toUpperCase()
    const codePoints = [...code].map(char => 127397 + char.charCodeAt())
    return String.fromCodePoint(...codePoints)
}

export async function getProducts(params = {}) {
    // Query Supabase products table
    let query = supabase.from('products').select('*')

    // Apply filters if provided
    if (params.category) {
        query = query.eq('category', params.category)
    }
    if (params.brand) {
        query = query.eq('brand', params.brand)
    }
    if (params.registered !== undefined) {
        // Map boolean to smallint: true = 1, false = 0
        query = query.eq('registration_status', params.registered ? 1 : 0)
    }
    if (params.search) {
        query = query.or(
            `brand.ilike.%${params.search}%,category.ilike.%${params.search}%,description.ilike.%${params.search}%`
        )
    }

    // Order by last_update descending by default
    query = query.order('last_update', { ascending: false })

    const { data, error } = await query

    if (error) {
        throw error
    }

    if (!data) {
        return []
    }

    // Map database schema to frontend expected format
    return data.map((product) => ({
        id: product.id,
        name: product.description?.trim() || [product.brand, product.category].filter(Boolean).join(' ') || 'Unnamed product',
        category: product.category,
        brand: product.brand,
        shortDescription: product.category || '',
        description: product.description,
        registered: product.registration_status === 1,
        availability: product.availability === 1 ? 'In stock' : product.availability === 2 ? 'Limited' : 'Out of stock',
        wholesalePrice: product.avg_w_p || 0,
        retailPrice: product.avg_r_p || 0,
        lastUpdate: product.last_update,
        country: product.country,
        countryEmoji: product.country,
        image: '',
    }))
}

export async function upgradeToPaidPlan() {
    const { data: authData, error: userError } = await supabase.auth.getUser()
    if (userError || !authData?.user) {
        throw new Error('User not authenticated')
    }

    const user = authData.user
    const now = new Date().toISOString()
    const { data, error } = await supabase
        .from('user_entitlements')
        .update({
            plan: 'paid',
            can_view_prices: true,
            can_view_availability: true,
            updated_at: now,
        })
        .eq('user_id', user.id)
        .select('user_id')
        .maybeSingle()

    if (error) throw error
    if (!data) {
        throw new Error('No entitlement row found for this user.')
    }

    return {
        success: true,
        message: 'Our beta access is full. You have been added to the waiting list, thank you for your patience!',
    }
}

export async function createCustomerPortalSession() {
    try {
        const response = await fetch('/billing/customer-portal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        if (!response.ok) {
            throw new Error('Billing portal not configured')
        }
        return response.json()
    } catch (error) {
        return { url: null, error: error.message }
    }
}
