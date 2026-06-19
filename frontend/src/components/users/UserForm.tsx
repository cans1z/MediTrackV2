'use client'

import { useState, type FC, type FormEvent } from 'react'
import { Button } from '@/shared/ui/button'
import { api } from '@/api'
import { toast } from 'sonner'
import type { UserRole, CreateUserDto } from '@/entities/user/user.dto'

interface UserFormProps {
  onSuccess: () => void
  onClose: () => void
}

export const UserForm: FC<UserFormProps> = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState<CreateUserDto>({
    userName: '',
    email: '',
    password: '',
    role: 'Patient'
  })
  
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Отправляем чистый объект напрямую без костылей и as any
      await api.user.register(formData)
      
      toast.success('Пользователь успешно создан')
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Не удалось создать пользователя')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Добавить нового пользователя</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-xl font-semibold h-6 w-6 flex items-center justify-center rounded-md hover:bg-gray-100"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя пользователя (Логин)</label>
            <input
              type="text"
              required
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              className="w-full text-sm bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
              placeholder="ivan_ivanov"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-sm bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
              placeholder="example@mail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full text-sm bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Роль в системе</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full text-sm bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 cursor-pointer"
            >
              <option value="Patient">Patient (Пациент)</option>
              <option value="Doctor">Doctor (Врач)</option>
              <option value="Administrator">Administrator (Администратор)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}