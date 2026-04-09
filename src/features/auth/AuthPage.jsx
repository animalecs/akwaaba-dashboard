import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { ShieldCheck, ArrowRight, Check, X } from 'lucide-react'
import sankofaLogo from '../../images/sankofa.svg'

const companyTypeOptions = [
    'Brand owner',
    'Manufacturer',
    'Distributor',
    'Retailer',
    'Procurement team',
    'Other',
]

export function AuthPage() {
    const { user, signIn, signUp } = useAuth()
    const navigate = useNavigate()
    const [mode, setMode] = useState('signin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [companyType, setCompanyType] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [signupSuccessEmail, setSignupSuccessEmail] = useState('')

    const passwordValid = password.length >= 8
    const passwordsMatch = password === confirmPassword && password.length > 0
    const companyNameValid = companyName.trim().length >= 2 && /[a-z0-9]/i.test(companyName)
    const companyTypeValid = companyType.trim().length > 0

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true })
        }
    }, [user, navigate])

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')
        if (mode === 'signup' && (!passwordValid || !passwordsMatch)) {
            setError('Password must be at least 8 characters and match confirmation.')
            return
        }
        if (mode === 'signup' && !companyNameValid) {
            setError('Enter a valid company name.')
            return
        }
        if (mode === 'signup' && !companyTypeValid) {
            setError('Select the type of company you work for.')
            return
        }
        setLoading(true)
        try {
            if (mode === 'signin') {
                await signIn({ email, password })
                navigate('/dashboard', { replace: true })
            } else {
                await signUp({
                    email,
                    password,
                    metadata: {
                        first_name: firstName,
                        last_name: lastName,
                        company_name: companyName.trim(),
                        company_type: companyType,
                    },
                })
                setSignupSuccessEmail(email)
            }
        } catch (err) {
            setError(err.message || 'Unable to authenticate')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
                    <div className="mb-8 space-y-3">
                        <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                            <ShieldCheck size={18} />
                            Akwaaba secure login
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Welcome back to Akwaaba</h1>
                            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">Sign in or register to access the portal.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-3xl bg-slate-50 p-2 text-sm text-slate-600">
                        <button
                            type="button"
                            className={`flex-1 rounded-3xl px-4 py-3 ${mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-80 hover:bg-slate-100'}`}
                            onClick={() => setMode('signin')}
                        >
                            Sign in
                        </button>
                        <button
                            type="button"
                            className={`flex-1 rounded-3xl px-4 py-3 ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-80 hover:bg-slate-100'}`}
                            onClick={() => setMode('signup')}
                        >
                            Register
                        </button>
                    </div>

                    {signupSuccessEmail ? (
                        <div className="mt-8 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                                    <Check size={18} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Registration successful</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-700">
                                        Check your email to confirm the email address you used.
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-emerald-700">{signupSuccessEmail}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                {mode === 'signup' && (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Input label="First name" type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} required placeholder="Jane" />
                                        <Input label="Last name" type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} required placeholder="Doe" />
                                    </div>
                                )}
                                {mode === 'signup' && (
                                    <Input label="Company name" type="text" value={companyName} onChange={(event) => setCompanyName(event.target.value)} required placeholder="Acme Ltd" />
                                )}
                                {mode === 'signup' && (
                                    <label className="block w-full text-sm text-slate-600">
                                        <span className="mb-2 block font-medium text-slate-900">Company type</span>
                                        <select
                                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                            value={companyType}
                                            onChange={(event) => setCompanyType(event.target.value)}
                                            required
                                        >
                                            <option value="">Select one</option>
                                            {companyTypeOptions.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </label>
                                )}
                                <Input label="Work email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="jane@company.com" />
                                <div className="relative">
                                    <Input label="Password " type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Enter a secure password" />
                                    {mode === 'signup' && password && (
                                        <div className="absolute right-4 top-10 flex items-center">
                                            {passwordValid ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-rose-600" />}
                                        </div>
                                    )}
                                    {mode === 'signup' && !passwordValid && password && (
                                        <p className="mt-2 text-xs text-rose-600">Password must be at least 8 characters</p>
                                    )}
                                </div>
                                {mode === 'signup' && (
                                    <div className="relative">
                                        <Input label="Confirm password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required placeholder="Confirm your password" />
                                        {confirmPassword && (
                                            <div className="absolute right-4 top-10 flex items-center">
                                                {passwordsMatch ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-rose-600" />}
                                            </div>
                                        )}
                                        {confirmPassword && !passwordsMatch && (
                                            <p className="mt-2 text-xs text-rose-600">Passwords must match</p>
                                        )}
                                    </div>
                                )}
                                {mode === 'signup' && (
                                    <p className="text-xs text-slate-600">• Password must be at least 8 characters • Company details are required</p>
                                )}
                            </div>
                            {error && <div className="rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={loading}>
                                    {loading ? 'Processing…' : mode === 'signin' ? 'Sign in' : 'Create account'}
                                </Button>
                                <button type="button" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                                    Forgot password?
                                </button>
                            </div>
                        </form>
                    )}

                </div>

                <aside className="flex min-h-[420px] items-center justify-center rounded-[2rem] border border-slate-200 bg-slate-950 p-10 shadow-soft text-white lg:w-[420px]">
                    <div className="space-y-8 text-center">
                        <div className="mx-auto h-24 w-24 overflow-hidden rounded-3xl bg-white p-5">
                            <img src={sankofaLogo} alt="Akwaaba logo" className="h-full w-full object-contain" />
                        </div>
                        <div>
                            <p className="text-sm uppercase tracking-[0.22em] text-slate-400"></p>
                            <h2 className="mt-3 text-3xl font-semibold text-white">Akwaaba Ltd</h2>
                        </div>
                        <p className="text-sm leading-6 text-slate-300">Your digital window to the market.</p>
                        {/* <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left text-sm text-slate-300">
                            <p className="font-semibold text-white">Login notes</p>
                            <p className="mt-2">Register with your company details to access entitlement-aware product data and billing controls.</p>
                        </div> */}
                    </div>
                </aside>
            </div>
        </div>
    )
}
