'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const TEST_ACCOUNTS = [
  {
    role: 'Patient',
    email: 'patient@example.com',
    password: 'Password123!',
    color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    badge: '🏥 Patient',
  },
  {
    role: 'Doctor',
    email: 'sarah.jenkins@healthcare.com',
    password: 'Password123!',
    color: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
    badge: '👨‍⚕️ Dr. Jenkins',
  },
  {
    role: 'Admin',
    email: 'admin@healthcare.com',
    password: 'Password123!',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
    badge: '⚡ Admin',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed')
        return
      }

      const role = data.data.user.role
      router.push(`/${role.toLowerCase()}/dashboard`)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = (email: string, password: string) => {
    setForm({ email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-slate-100">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-3 shadow-md shadow-blue-500/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">HealthCare Manager</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to access your portal</p>
        </div>

        {/* Quick Test Accounts Box */}
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
            🔑 Quick Demo Login (Click to Auto-fill)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TEST_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleQuickLogin(acc.email, acc.password)}
                className={`py-2 px-2 border rounded-lg text-xs font-semibold transition text-center shadow-xs ${acc.color}`}
              >
                {acc.badge}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-2">
            Default Password: <code className="font-mono text-slate-600 font-semibold">Password123!</code>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-medium text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-medium text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition shadow-md shadow-blue-600/20 text-sm"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
