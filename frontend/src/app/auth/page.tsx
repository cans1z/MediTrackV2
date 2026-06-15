'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // Нужен для редиректа после логина
import { authApi } from '@/api/auth/auth.api'
import type { LoginRequestDto, LoginResponseDto } from '@/entities/auth/auth.dto';

export default function LoginPage() {
  const router = useRouter()

  // 1. Стейт для данных формы
  const [formData, setFormData] = useState<LoginRequestDto>({
    userName: '',
    password: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 2. Функция отправки данных на бэк
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Отменяем перезагрузку страницы браузером
    setLoading(true)
    setError(null)

    try {
      // Вызываем твой метод из auth.api.ts
      const user = await authApi.login(formData)
      
      localStorage.setItem('access_token', user) // добавь эту строку
      
      console.log('Успешный вход, юзер:', user)
      
      // Перенаправляем пользователя на страницу с лекарствами после успешного входа
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
            // Обновляем только поле userName в стейте
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
            // Обновляем только поле password в стейте
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