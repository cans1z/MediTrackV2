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
import AppPagination from '@/components/Pagination'

const ITEMS_PER_PAGE = 5

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionResponseDto[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  const [editingPrescription, setEditingPrescription] = useState<PrescriptionResponseDto | null>(null)
  
  const [currentPage, setCurrentPage] = useState<number>(1)

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

  // Корректировка страницы при удалении элементов
  useEffect(() => {
    const totalPages = Math.ceil(prescriptions.length / ITEMS_PER_PAGE)
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [prescriptions, currentPage])

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

  const totalPages = Math.ceil(prescriptions.length / ITEMS_PER_PAGE)
  const paginatedPrescriptions = prescriptions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <ProtectedRoute>
      <PrescriptionForm 
        onSubmit={handleCreatePrescription} 
        onCancel={() => setIsCreateOpen(false)} 
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

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
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Назначения и рецепты</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Управление назначениями лекарственных препаратов для пациентов</p>
          </div>
          {isAllowedToEdit && (
            <Button onClick={() => setIsCreateOpen(true)}>Добавить назначение</Button>
          )}
        </div>

        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg shadow-sm divide-y dark:divide-zinc-800 mb-6">
          {prescriptions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Список назначений пуст.
            </div>
          ) : (
            paginatedPrescriptions.map((prescription) => (
              <div key={prescription.id} className="p-4 flex justify-between items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 dark:text-zinc-100 truncate">
                      Дозировка: {prescription.dosage}
                    </h3>
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-700/10 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-500/20 whitespace-nowrap">
                      Период: {prescription.period} дн.
                    </span>
                    {prescription.isFlexible && (
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 dark:bg-purple-950/40 dark:text-purple-400 dark:ring-purple-500/20 whitespace-nowrap">
                        Гибкий график
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p><span className="font-medium text-gray-900 dark:text-zinc-300">Препарат:</span> {prescription.medicationName}</p>
                    <p><span className="font-medium text-gray-900 dark:text-zinc-300">Пациент:</span> {prescription.patientName}</p>
                    <p><span className="font-medium text-gray-900 dark:text-zinc-300">Врач:</span> {prescription.doctorName}</p>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 pt-1 space-y-0.5">
                      <p><span className="font-medium text-gray-600 dark:text-zinc-400">Старт:</span> {formatDate(prescription.startDate)}</p>
                      {prescription.comment && (
                        <p className="italic truncate">
                          <span className="font-medium not-italic text-gray-600 dark:text-zinc-400">Комментарий:</span> {prescription.comment}
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
                      className="dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:border-zinc-700"
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

        <AppPagination  
          currentPage={currentPage}  
          totalPages={totalPages}  
          onPageChange={setCurrentPage}
        />
      </div>
    </ProtectedRoute>
  )
}