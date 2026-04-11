'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFE600] rounded-xl mb-5">
            <span className="text-[#0A0A0A] font-bold text-2xl font-condensed tracking-tight">RH</span>
          </div>
          <h1 className="text-white text-2xl font-condensed font-bold tracking-wide">Rewari Hoardings</h1>
          <p className="text-gray-500 text-sm mt-1">Admin Panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            required
            autoComplete="email"
            className="w-full bg-[#141414] border border-[#2a2a2a] text-white placeholder-gray-600 px-4 py-3 rounded-lg focus:outline-none focus:border-[#FFE600] transition-colors text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete="current-password"
            className="w-full bg-[#141414] border border-[#2a2a2a] text-white placeholder-gray-600 px-4 py-3 rounded-lg focus:outline-none focus:border-[#FFE600] transition-colors text-sm"
          />

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFE600] text-[#0A0A0A] font-condensed font-bold py-3 rounded-lg hover:bg-yellow-300 active:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base tracking-wide"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-8">
          Forgot password? Reset it from Supabase Dashboard.
        </p>
      </div>
    </div>
  )
}
