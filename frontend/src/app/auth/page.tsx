'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext' 
import type { LoginRequestDto } from '@/entities/auth/auth.dto'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [formData, setFormData] = useState<LoginRequestDto>({
    userName: '',
    password: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await login(formData)
      
      router.push('/medications') 
    } catch (err) {
      setError('Неверный логин или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Авторизация</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Имя пользователя:</label>
          <input
            type="text"
            required
            value={formData.userName}
            onChange={e => setFormData(prev => ({ ...prev, userName: e.target.value }))}
            style={{ width: '100%', padding: '8px', color: 'black' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Пароль:</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
            style={{ width: '100%', padding: '8px', color: 'black' }}
          />
        </div>

        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  )
}