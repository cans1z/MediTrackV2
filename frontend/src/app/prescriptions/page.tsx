'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import PrescriptionForm from '@/components/prescriptions/PrescriptionForm' 
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { api } from '@/api' 
import { useAuth } from '@/contexts/AuthContext'
import type { 
  PrescriptionResponseDto, 
  PrescriptionRequestDto, 
  UpdatePrescriptionDto 
} from '@/entities/prescriptions/prescription.dto'

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionResponseDto[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  const [editingPrescription, setEditingPrescription] = useState<PrescriptionResponseDto | null>(null)

  const { user } = useAuth()
  const isAllowedToEdit = user?.role === 'Administrator' || user?.role === 'Doctor'

  const fetchPrescriptions = async () => {
    try {
      const data = await api.prescription.getAllPrescriptions()
      setPrescriptions(data.data)
    } catch (err) {
      console.error('Не удалось загрузить рецепты:', err)
      toast.error('Ошибка при загрузке списка рецептов')
    }
  }

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const handleCreatePrescription = async (dto: PrescriptionRequestDto) => {
    try {
      await api.prescription.createPrescription(dto)
      await fetchPrescriptions()
      setIsCreateOpen(false)
      toast.success('Рецепт успешно добавлен')
    } catch {
      toast.error('Не удалось добавить рецепт')
    }
  }

  const handleEditPrescription = async (dto: UpdatePrescriptionDto) => {
    if (!editingPrescription) return
    try {
      await api.prescription.updatePrescription(editingPrescription.id, dto)
      await fetchPrescriptions()
      setEditingPrescription(null)
      toast.success('Рецепт успешно обновлен')
    } catch {
      toast.error('Не удалось обновить рецепт')
    }
  }

  const handleDeletePrescription = async (id: number) => {
    const isConfirmed = window.confirm('Вы уверены, что хотите удалить этот рецепт?')
    if (!isConfirmed) return

    try {
      await api.prescription.deletePrescription(id)
      await fetchPrescriptions()
      toast.success('Рецепт успешно удален')
    } catch {
      toast.error('Не удалось удалить рецепт')
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('ru-RU')
    } catch {
      return dateStr
    }
  }

  // Маппим Response из списка в Update DTO для формы редактирования
  const getInitialValues = (item: PrescriptionResponseDto | null): UpdatePrescriptionDto | undefined => {
    if (!item) return undefined
    return {
      dosage: item.dosage,
      frequency: item.frequency,
      startDate: item.startDate,
      period: item.period,
      isFlexible: item.isFlexible,
      comment: item.comment || '',
    }
  }

  return (
    <ProtectedRoute>
      {/* Форма для создания (ждет полную структуру с ID) */}
      <PrescriptionForm 
        onSubmit={handleCreatePrescription} 
        onCancel={() => setIsCreateOpen(false)} 
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      {/* Форма для редактирования (ждет только изменяемые поля) */}
      <PrescriptionForm 
        onSubmit={handleEditPrescription} 
        onCancel={() => setEditingPrescription(null)} 
        open={Boolean(editingPrescription)}
        onOpenChange={(open) => !open && setEditingPrescription(null)}
        initial={getInitialValues(editingPrescription)}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Назначения и рецепты</h1>
            <p className="text-sm text-gray-500">Управление назначениями лекарственных препаратов для пациентов</p>
          </div>
          {isAllowedToEdit && (
            <Button onClick={() => setIsCreateOpen(true)}>Добавить назначение</Button>
          )}
        </div>

        <div className="bg-white border rounded-lg shadow-sm divide-y">
          {prescriptions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Список назначений пуст.
            </div>
          ) : (
            prescriptions.map((prescription) => (
              <div key={prescription.id} className="p-4 flex justify-between items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 truncate">
                      Дозировка: {prescription.dosage}
                    </h3>
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-700/10 whitespace-nowrap">
                      Период: {prescription.period} дн.
                    </span>
                    {prescription.isFlexible && (
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 whitespace-nowrap">
                        Гибкий график
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium text-gray-900">Препарат:</span> {prescription.medicationName}</p>
                    <p><span className="font-medium text-gray-900">Пациент:</span> {prescription.patientName}</p>
                    <p><span className="font-medium text-gray-900">Врач:</span> {prescription.doctorName}</p>
                    
                    <div className="text-xs text-gray-500 pt-1 space-y-0.5">
                      <p><span className="font-medium">Старт:</span> {formatDate(prescription.startDate)}</p>
                      {prescription.comment && (
                        <p className="italic truncate">
                          <span className="font-medium not-italic text-gray-600">Комментарий:</span> {prescription.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {isAllowedToEdit && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingPrescription(prescription)}
                    >
                      Редактировать
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeletePrescription(prescription.id)}
                    >
                      Удалить
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