'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RootPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Если вошел в систему — отправляем на дашборд
        router.replace('/dashboard');
      } else {
        // Если не вошел — отправляем на авторизацию
        router.replace('/auth');
      }
    }
  } , [user, loading, router]);

  // Пока идет проверка и редирект, показываем пустой экран со спиннером
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-lg text-gray-500 animate-pulse">Перенаправление...</div>
    </div>
  );
}