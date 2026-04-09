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

    // Since user_entitlements table doesn't exist, use user metadata
    const isPremium = user.user.user_metadata?.premium_access === true
    return {
        plan: isPremium ? 'premium' : 'free',
        premiumAccess: isPremium,
        nextBilling: null,
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

export async function registerPremiumInterest() {
    const { data: authData, error: userError } = await supabase.auth.getUser()
    if (userError || !authData?.user) {
        throw new Error('User not authenticated')
    }

    const user = authData.user
    const payload = {
        user_id: user.id,
        email: user.email,
        company_name: user.user_metadata?.company_name ?? null,
        company_type: user.user_metadata?.company_type ?? null,
        status: 'ready_to_pay',
        updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('premium_interest').upsert(payload, {
        onConflict: 'user_id',
    })

    if (error) {
        throw error
    }

    return {
        success: true,
        message: 'Thank you, we will notify when the paid version is available',
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
