'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { api } from '@/api' 
import { useAuth } from '@/contexts/AuthContext'
import type { UserResponseDto } from '@/entities/user/user.dto'
import { UserForm } from '@/components/users/UserForm'
import AppPagination from '@/components/Pagination' // Твой компонент

const ITEMS_PER_PAGE = 10

export default function UsersPage() {
  const [users, setUsers] = useState<UserResponseDto[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1) 
  const { user: currentUser } = useAuth()

  const isAdmin = currentUser?.role === 'Administrator'

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await api.user.getAllUsers()
      setUsers(data.data)
    } catch (err) {
      console.error('Не удалось загрузить пользователей:', err)
      toast.error('Ошибка при загрузке списка пользователей')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE)
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [users, currentPage])

  const handleRoleChange = async (id: number, newRole: string) => {
    const isConfirmed = window.confirm(`Вы уверены, что хотите изменить роль пользователя на "${newRole}"?`)
    if (!isConfirmed) return

    try {
      await api.user.changeRole(id, newRole)
      await fetchUsers()
      toast.success(`Роль успешно изменена на ${newRole}`)
    } catch (err) {
      console.error(err)
      toast.error('Не удалось изменить роль.')
    }
  }

  const handleBanUser = async (id: number) => {
    const isConfirmed = window.confirm('Вы уверены?')
    if (!isConfirmed) return

    try {
      await api.user.banUser(id)
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === id ? { ...u, isBanned: !u.isBanned } : u)
      )
      toast.success('Статус блокировки изменен')
    } catch (err) {
      console.error(err)
      toast.error('Не удалось изменить статус блокировки')
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (id === currentUser?.id) {
      toast.error('Вы не можете удалить самого себя')
      return
    }

    const isConfirmed = window.confirm('Вы уверены, что хотите безвозвратно удалить этого пользователя?')
    if (!isConfirmed) return

    try {
      await api.user.deleteUser(id)
      await fetchUsers()
      toast.success('Пользователь успешно удален')
    } catch {
      toast.error('Не удалось удалить пользователя')
    }
  }

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE)
  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Пользователи системы</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Управление учетными записями, правами доступа и блокировками</p>
          </div>
          {isAdmin && (
            <Button onClick={() => setIsFormOpen(true)} className="shrink-0">
              Добавить пользователя
            </Button>
          )}
        </div>

        {isFormOpen && <UserForm onClose={() => setIsFormOpen(false)} onSuccess={fetchUsers} />}

        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg shadow-sm divide-y dark:divide-zinc-800 mb-6">
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Загрузка данных...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Пользователи не найдены.</div>
          ) : (
            paginatedUsers.map((userItem) => (
              <div key={userItem.id} className="p-4 flex justify-between items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900 dark:text-zinc-100 truncate">{userItem.userName}</h3>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      userItem.role === 'Administrator' 
                        ? 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-500/20' 
                        : userItem.role === 'Doctor'
                        ? 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-500/20'
                        : 'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700'
                    }`}>
                      {userItem.role}
                    </span>
                    {userItem.isBanned && (
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-500/20">
                        Заблокирован
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{userItem.email}</p>
                </div>
                
                {isAdmin && (
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <select
                      value={userItem.role}
                      onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                      className="text-sm bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 border border-gray-300 dark:border-zinc-700 rounded-md px-2 py-1 h-9 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
                    >
                      <option value="Patient" className="bg-white dark:bg-zinc-800">Patient</option>
                      <option value="Doctor" className="bg-white dark:bg-zinc-800">Doctor</option>
                      <option value="Administrator" className="bg-white dark:bg-zinc-800">Administrator</option>
                    </select>

                    {userItem.role !== 'Administrator' && (
                      <Button
                        variant="secondary" size="sm" disabled={userItem.id === currentUser?.id} 
                        onClick={() => handleBanUser(userItem.id)}
                        className="dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                      >
                        {userItem.isBanned ? 'Разбан' : 'Бан'}
                      </Button>
                    )}
                    
                    <Button variant="destructive" size="sm" disabled={userItem.id === currentUser?.id} onClick={() => handleDeleteUser(userItem.id)}>
                      Удалить
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <AppPagination  
          currentPage={currentPage}  
          totalPages={totalPages}  
          onPageChange={setCurrentPage}
        />
      </div>
    </ProtectedRoute>
  )
}