'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

// Используем обычную функцию вместо стрелочной с типом FC
export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-lg font-medium text-gray-500 animate-pulse">Загрузка...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-bold leading-6 text-gray-900">
          Рады видеть вас, <span className="text-blue-600">{user.userName}</span>!
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Ваш персональный кабинет для контроля здоровья.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Link 
          href="/medications" 
          className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500 transition-all group"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
            💊 Лекарства &rarr;
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Список ваших медикаментов, дозировки и доступное количество.
          </p>
        </Link>

        <Link 
          href="/prescriptions" 
          className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500 transition-all group"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
            📋 Рецепты &rarr;
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Назначения врачей, направления и длительность курсов лечения.
          </p>
        </Link>

        <Link 
          href="/intakes" 
          className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500 transition-all group"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
            ⏰ Приёмы &rarr;
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Журнал и расписание приема лекарств. Отмечайте, что уже выпито.
          </p>
        </Link>
      </div>
    </div>
  );
}