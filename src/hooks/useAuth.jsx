import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getCurrentUser, signIn as authSignIn, signUp as authSignUp, signOut as authSignOut } from '../api/index'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadUser() {
      try {
        const session = await supabase.auth.getSession()
        if (mounted) {
          setUser(session.data?.session?.user ?? null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadUser()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null)
      }
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn: authSignIn,
      signUp: authSignUp,
      signOut: authSignOut,
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
