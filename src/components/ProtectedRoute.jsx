import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { PageSpinner } from './Spinner'

export function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center bg-slate-50">
                <PageSpinner />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/auth" replace />
    }

    return children
}
