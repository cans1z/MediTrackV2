'use client' // это нужно чтобы использовать useState и useEffect

import { useEffect, useState } from 'react'
import { medicationApi } from '@/api/medications/medication.api'
import type { MedicationResponseDto } from '@/entities/medications/medication.dto'

export default function MedicationsPage() {
  const [medications, setMedications] = useState<MedicationResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const data = await medicationApi.getAll()
        setMedications(data)
      } catch {
        setError('Не удалось загрузить препараты')
      } finally {
        setLoading(false)
      }
    }
    fetchMedications()
  }, [])

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>{error}</div>

 return (
  <div className="max-w-7xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-6">Препараты</h1>

    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left py-3 px-4">Название</th>
          <th className="text-left py-3 px-4">Описание</th>
          <th className="text-left py-3 px-4">Форма выпуска</th>
        </tr>
      </thead>
      <tbody>
        {medications.map(m => (
          <tr key={m.id} className="border-b hover:bg-muted/50">
            <td className="py-3 px-4">{m.name}</td>
            <td className="py-3 px-4">{m.description}</td>
            <td className="py-3 px-4">{m.dosageForm}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
}