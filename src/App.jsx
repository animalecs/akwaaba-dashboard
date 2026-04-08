import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { BillingPage } from './features/billing/BillingPage'
import { AuthPage } from './features/auth/AuthPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/billing"
                    element={
                        <ProtectedRoute>
                            <BillingPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </AuthProvider>
    )
}

export default App
