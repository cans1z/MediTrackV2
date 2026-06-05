import type { FC } from 'react';
import { api } from '../../api';
import type { components } from "../../../schema"; 

type MedicationDto = components["schemas"]["MedicationDto"];

const MedicationsPage: FC = async () => {
  // ЯВНО указываем тип для массива медикаментов: MedicationDto[]
  let medications: MedicationDto[] = [];
  let error: string | null = null;

  try {
    const response = await api.getMedications();
    // На всякий случай проверяем, что бэкенд прислал данные
    medications = response.data || []; 
  } catch (err) {
    console.error("Ошибка при получении лекарств:", err);
    error = "Не удалось загрузить список медикаментов. Проверь, запущен ли .NET бэкенд.";
  }

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Каталог медикаментов</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {!error && medications.length === 0 && (
        <p className="text-gray-500">В базе данных пока нет ни одного лекарства.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Теперь TypeScript точно знает типы med и idx автоматически! */}
        {medications.map((med, idx) => (
          <div key={idx} className="border rounded-lg p-4 shadow-sm bg-card">
            <h2 className="text-xl font-semibold text-blue-600 mb-1">
              {med.name}
            </h2>
            <p className="text-sm text-gray-400 mb-3">
              Форма: {med.dosageForm}
            </p>
            {med.description && (
              <p className="text-sm text-gray-600">
                {med.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
};

export default MedicationsPage;