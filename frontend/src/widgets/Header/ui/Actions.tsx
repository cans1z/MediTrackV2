'use client'

import type { FC } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export const Actions: FC = () => {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span>{user.userName}</span>
        <button onClick={logout}>Выйти</button>
      </div>
    );
  }

  return (
    <Link href="/auth">
      <button>Войти</button>
    </Link>
  );
};