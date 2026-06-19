'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import IntakeForm from '@/components/intakes/IntakeForm'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { api } from '@/api' // Предполагается, что внутри лежит intakeApi как api.intake
import { useAuth } from '@/contexts/AuthContext'
import type { IntakeResponseDto, IntakeRequestDto } from '@/entities/intakes/intake.dto'

export default function IntakesPage() {
  const [intakes, setIntakes] = useState<IntakeResponseDto[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  const [editingIntake, setEditingIntake] = useState<IntakeResponseDto | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const { user } = useAuth()

  const fetchIntakes = async () => {
    setLoading(true)
    try {
      // Подключаем ваш созданный метод getAllIntakes
      const data = await api.intake.getAllIntakes()
      setIntakes(data.data)
    } catch (err) {
      console.error('Не удалось загрузить историю приемов:', err)
      toast.error('Ошибка при загрузке списка приемов')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIntakes()
  }, [])

  const handleCreateIntake = async (dto: IntakeRequestDto) => {
    try {
      await api.intake.createIntake(dto)
      await fetchIntakes()
      setIsCreateOpen(false)
      toast.success('Запись о приеме добавлена')
    } catch {
      toast.error('Не удалось добавить запись')
    }
  }

  const handleEditIntake = async (dto: IntakeRequestDto) => {
    if (!editingIntake) return
    try {
      await api.intake.updateIntake(editingIntake.id, dto)
      await fetchIntakes()
      setEditingIntake(null)
      toast.success('Запись обновлена')
    } catch {
      toast.error('Не удалось обновить запись')
    }
  }


  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  const getInitialValues = (item: IntakeResponseDto | null): IntakeRequestDto | undefined => {
    if (!item) return undefined
    return {
      scheduledAt: item.scheduledAt,
      takenAt: item.takenAt,
      comment: item.comment || '',
      prescriptionId: 0, // Передаем заглушку, так как бэкенд на PUT-методе ожидает полный DTO
    }
  }

  return (
    <ProtectedRoute>
      <IntakeForm 
        onSubmit={handleCreateIntake} 
        onCancel={() => setIsCreateOpen(false)} 
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <IntakeForm 
        onSubmit={handleEditIntake} 
        onCancel={() => setEditingIntake(null)} 
        open={Boolean(editingIntake)}
        onOpenChange={(open) => !open && setEditingIntake(null)}
        initial={getInitialValues(editingIntake)}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Журнал приемов лекарств</h1>
            <p className="text-sm text-gray-500">Отслеживание запланированных и фактических приемов медицинских препаратов</p>
          </div>
          {/* Любой авторизованный пользователь (включая пациентов) может нажать кнопку создания */}
          {user && (
            <Button onClick={() => setIsCreateOpen(true)}>Внести прием</Button>
          )}
        </div>

        <div className="bg-white border rounded-lg shadow-sm divide-y">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Загрузка данных...</div>
          ) : intakes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              График приемов пуст или записей не найдено.
            </div>
          ) : (
            intakes.map((intake) => (
              <div key={intake.id} className="p-4 flex justify-between items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {intake.medicationName}
                    </h3>
                    
                    {intake.isTaken ? (
                      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-700/10">
                        Принято
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-700/10">
                        Запланировано
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium text-gray-900">Врач:</span> {intake.doctorName}</p>
                    <p><span className="font-medium text-gray-900">План:</span> {formatDateTime(intake.scheduledAt)}</p>
                    <p><span className="font-medium text-gray-900">Факт:</span> {formatDateTime(intake.takenAt)}</p>
                    
                    {intake.comment && (
                      <p className="text-xs italic text-gray-500 pt-0.5 truncate">
                        <span className="font-medium not-italic text-gray-600">Комментарий:</span> {intake.comment}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Кнопки видны всем авторизованным юзерам согласно ТЗ. Бэкенд сам отсечет чужие записи пациентов */}
                {user && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingIntake(intake)}
                    >
                      Редактировать
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}