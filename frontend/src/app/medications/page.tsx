// src/app/medications/page.tsx
'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import MedicationForm from '@/components/MedicationForm'

// Импорты shadcn/ui компонентов
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'

// Предполагаем импорт вашего API и типов (подставьте ваши реальные пути)
import { api} from '@/api' 
import type { MedicationResponseDto, MedicationRequestDto } from '@/entities/medications/medication.dto'

export default function MedicationsPage() {
  // 1. Стейт для списка лекарств и загрузки
  const [medications, setMedications] = useState<MedicationResponseDto[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Функция для получения свежего списка лекарств с бэкенда
  const fetchMedications = async () => {
    try {
      const data = await api.medication.getAllMedications() // или ваш метод получения списка
      setMedications(data.data)
    } catch (err) {
      console.error('Не удалось загрузить лекарства:', err)
    }
  }

  // Загружаем данные при монтировании страницы
  useEffect(() => {
    fetchMedications()
  }, [])

  // 2. Коллбэк отправки формы создания
  const handleCreateMedication = async (dto: MedicationRequestDto) => {
    try {
      // Отправляем запрос на бэк
      await api.medication.createMedication(dto)
      // Обновляем список на клиенте, чтобы увидеть изменения
      await fetchMedications()
      // Закрываем модальное окно
      setIsOpen(false)
    } catch (err) {
      console.error('Ошибка при создании препарата:', err)
    }
  }

  return (
    <ProtectedRoute>
      <MedicationForm 
                onSubmit={handleCreateMedication} 
                onCancel={() => setIsOpen(false)} 
                open={isOpen}
                onOpenChange={setIsOpen}
              />
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Шапка страницы с кнопкой добавления */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Мои медикаменты</h1>
            <p className="text-sm text-gray-500">Управление списком ваших лекарственных препаратов</p>
          </div>

          <Button
            onClick={() => setIsOpen(true)}>Добавить препарат</Button>
        </div>

        {/* Список препаратов (простой вывод для примера) */}
        <div className="bg-white border rounded-lg shadow-sm divide-y">
          {medications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Список пуст. Добавьте ваш первый препарат!
            </div>
          ) : (
            medications.map((med) => (
              <div key={med.id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{med.name}</h3>
                  <p className="text-sm text-gray-500">{med.description || 'Нет описания'}</p>
                </div>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {med.dosageForm}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </ProtectedRoute>
  )
}