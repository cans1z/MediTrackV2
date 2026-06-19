'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import MedicationForm from '@/components/medications/MedicationForm' // поправил путь в соответствии с вашим комментарием
import { toast } from 'sonner'

// Импорты shadcn/ui компонентов
import { Button } from '@/shared/ui/button'

// Предполагаем импорт вашего API и типов
import { api } from '@/api' 
import type { MedicationResponseDto, MedicationRequestDto } from '@/entities/medications/medication.dto'
import { useAuth } from '@/contexts/AuthContext'

export default function MedicationsPage() {
  // 1. Стейт для списка лекарств
  const [medications, setMedications] = useState<MedicationResponseDto[]>([])
  
  // Стейт для открытия формы (используется для создания нового препарата)
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  
  // Стейт для редактируемого препарата (если не null, форма редактирования открыта)
  const [editingMedication, setEditingMedication] = useState<MedicationResponseDto | null>(null)

  // Функция для получения свежего списка лекарств с бэкенда
  const fetchMedications = async () => {
    try {
      const data = await api.medication.getAllMedications()
      setMedications(data.data)
    } catch (err) {
      console.error('Не удалось загрузить лекарства:', err)
      toast.error('Ошибка при загрузке списка препаратов')
    }
  }

  // Загружаем данные при монтировании страницы
  useEffect(() => {
    fetchMedications()
  }, [])

  // 2. Коллбэк создания препарата
  const handleCreateMedication = async (dto: MedicationRequestDto) => {
    try {
      await api.medication.createMedication(dto)
      await fetchMedications()
      setIsCreateOpen(false)
      toast.success('Препарат успешно добавлен')
    } catch {
      toast.error('Не удалось добавить препарат')
    }
  }

  // 3. Коллбэк редактирования препарата
  const handleEditMedication = async (dto: MedicationRequestDto) => {
    if (!editingMedication) return
    try {
      // Предполагается метод updateMedication(id, dto) в вашем API
      await api.medication.updateMedication(editingMedication.id, dto)
      await fetchMedications()
      setEditingMedication(null)
      toast.success('Препарат успешно обновлен')
    } catch {
      toast.error('Не удалось обновить препарат')
    }
  }

  // 4. Коллбэк удаления препарата
  const handleDeleteMedication = async (id: number) => {
    const isConfirmed = window.confirm('Вы уверены, что хотите удалить этот препарат?')
    if (!isConfirmed) return

    try {
      // Предполагается метод deleteMedication(id) в вашем API
      await api.medication.deleteMedication(id)
      await fetchMedications()
      toast.success('Препарат успешно удален')
    } catch {
      toast.error('Не удалось удалить препарат')
    }
  }

  const { user } = useAuth()

  return (
    <ProtectedRoute>
      {/* Форма для СОЗДАНИЯ */}
      <MedicationForm 
        onSubmit={handleCreateMedication} 
        onCancel={() => setIsCreateOpen(false)} 
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      {/* Форма для РЕДАКТИРОВАНИЯ */}
      <MedicationForm 
        onSubmit={handleEditMedication} 
        onCancel={() => setEditingMedication(null)} 
        open={Boolean(editingMedication)}
        onOpenChange={(open) => !open && setEditingMedication(null)}
        initial={editingMedication ?? undefined}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Шапка страницы с кнопкой добавления */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Мои медикаменты</h1>
            <p className="text-sm text-gray-500">Управление списком ваших лекарственных препаратов</p>
          </div>
          {user?.role === 'Administrator' && (
          <Button onClick={() => setIsCreateOpen(true)}>Добавить препарат</Button>)}
        </div>

        {/* Список препаратов */}
        <div className="bg-white border rounded-lg shadow-sm divide-y">
          {medications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Список пуст. Добавьте ваш первый препарат!
            </div>
          ) : (
            medications.map((med) => (
              <div key={med.id} className="p-4 flex justify-between items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{med.name}</h3>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 whitespace-nowrap">
                      {med.dosageForm}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{med.description || 'Нет описания'}</p>
                </div>
                
                
                {user?.role === 'Administrator' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingMedication(med)}
                    >
                      Редактировать
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteMedication(med.id)}
                    >
                      Удалить
                    </Button>
                  </div>)}
                </div>
              ))
            )}
          </div>

      </div>
    </ProtectedRoute>
  )
}