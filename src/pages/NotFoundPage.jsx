import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

export function NotFoundPage() {
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-soft">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Page missing</p>
                <h1 className="mt-6 text-4xl font-semibold text-slate-900">We couldn't find that route.</h1>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">Return to the dashboard or sign in again to continue managing product visibility and billing.</p>
                <div className="mt-8">
                    <Link to="/dashboard">
                        <Button variant="primary">Go to dashboard</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
