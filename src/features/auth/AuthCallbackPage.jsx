import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

function readAuthParams() {
    const searchParams = new URLSearchParams(window.location.search)
    const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash
    const hashParams = new URLSearchParams(hash)

    return {
        accessToken: searchParams.get('access_token') || hashParams.get('access_token'),
        refreshToken: searchParams.get('refresh_token') || hashParams.get('refresh_token'),
        code: searchParams.get('code') || hashParams.get('code'),
    }
}

export function AuthCallbackPage() {
    const navigate = useNavigate()
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelled = false

        async function handleCallback() {
            const { data: existingSession } = await supabase.auth.getSession()

            if (existingSession.session) {
                navigate('/dashboard', { replace: true })
                return
            }

            try {
                const { accessToken, refreshToken, code } = readAuthParams()

                if (accessToken && refreshToken) {
                    const { error: sessionError } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    })

                    if (sessionError) {
                        throw sessionError
                    }
                } else if (code) {
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

                    if (exchangeError) {
                        throw exchangeError
                    }
                } else {
                    throw new Error('Authentication callback is missing session information.')
                }

                if (!cancelled) {
                    navigate('/dashboard', { replace: true })
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'We could not sign you in.')
                }
            }
        }

        handleCallback()

        return () => {
            cancelled = true
        }
    }, [navigate])

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
                <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-soft">
                    {error ? (
                        <>
                            <h1 className="text-2xl font-semibold text-slate-900">Authentication failed</h1>
                            <p className="mt-4 text-sm leading-6 text-slate-600">{error}</p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-semibold text-slate-900">Signing you in…</h1>
                            <p className="mt-4 text-sm leading-6 text-slate-600">
                                We are confirming your email and preparing your session.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
