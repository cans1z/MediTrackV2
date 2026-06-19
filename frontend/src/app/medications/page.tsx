'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import MedicationForm from '@/components/medications/MedicationForm'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { api } from '@/api' 
import type { MedicationResponseDto, MedicationRequestDto } from '@/entities/medications/medication.dto'
import { useAuth } from '@/contexts/AuthContext'
import AppPagination from '@/components/Pagination'

const ITEMS_PER_PAGE = 10

export default function MedicationsPage() {
  const [medications, setMedications] = useState<MedicationResponseDto[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  const [editingMedication, setEditingMedication] = useState<MedicationResponseDto | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const { user } = useAuth()

  const fetchMedications = async () => {
    try {
      const data = await api.medication.getAllMedications()
      setMedications(data.data)
    } catch (err) {
      console.error('Не удалось загрузить лекарства:', err)
      toast.error('Ошибка при загрузке списка препаратов')
    }
  }

  useEffect(() => {
    fetchMedications()
  }, [])

  useEffect(() => {
    const totalPages = Math.ceil(medications.length / ITEMS_PER_PAGE)
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [medications, currentPage])

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

  const handleEditMedication = async (dto: MedicationRequestDto) => {
    if (!editingMedication) return
    try {
      await api.medication.updateMedication(editingMedication.id, dto)
      await fetchMedications()
      setEditingMedication(null)
      toast.success('Препарат успешно обновлен')
    } catch {
      toast.error('Не удалось обновить препарат')
    }
  }

  const handleDeleteMedication = async (id: number) => {
    const isConfirmed = window.confirm('Вы уверены, что хотите удалить этот препарат?')
    if (!isConfirmed) return

    try {
      await api.medication.deleteMedication(id)
      await fetchMedications()
      toast.success('Препарат успешно удален')
    } catch {
      toast.error('Не удалось удалить препарат')
    }
  }

  const totalPages = Math.ceil(medications.length / ITEMS_PER_PAGE)
  const paginatedMedications = medications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <ProtectedRoute>
      {/* Форма для СОЗДАНИЯ */}
      <MedicationForm 
        onSubmit={handleCreateMedication} 
        onCancel={() => setIsCreateOpen(false)} 
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <MedicationForm 
        onSubmit={handleEditMedication} 
        onCancel={() => setEditingMedication(null)} 
        open={Boolean(editingMedication)}
        onOpenChange={(open) => !open && setEditingMedication(null)}
        initial={editingMedication ?? undefined}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Шапка страницы */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Мои медикаменты</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Управление списком ваших лекарственных препаратов</p>
          </div>
          {user?.role === 'Administrator' && (
            <Button onClick={() => setIsCreateOpen(true)}>Добавить препарат</Button>
          )}
        </div>

        {/* Список препаратов */}
        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg shadow-sm divide-y dark:divide-zinc-800 mb-6">
          {medications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Список пуст. Добавьте ваш первый препарат!
            </div>
          ) : (
            paginatedMedications.map((med) => (
              <div key={med.id} className="p-4 flex justify-between items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-zinc-100 truncate">{med.name}</h3>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-500/20 whitespace-nowrap">
                      {med.dosageForm}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{med.description || 'Нет описания'}</p>
                </div>
                
                {user?.role === 'Administrator' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingMedication(med)}
                      className="dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:border-zinc-700"
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