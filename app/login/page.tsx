'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      if (data?.user) {
        router.refresh()
        router.push('/dashboard')
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Sign in to Garden AI</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input
            type="email"
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            Sign in
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/signup" className="text-green-600 hover:text-green-700">
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  )
}