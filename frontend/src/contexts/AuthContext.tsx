'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authApi } from '@/api/auth/auth.api'
import type { User, LoginRequestDto } from '@/entities/auth/auth.dto'
import { api } from '@/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (dto: LoginRequestDto) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const getMe = async() => {
    try{
      const response = await api.auth.getMe()
      if (response.data){
        setUser(response.data)
        return 
      }
      throw new Error('User not found')
    }
    catch (err) {
      console.error(err)
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      return
    }
    getMe();
  }, [])

  const login = async (dto: LoginRequestDto) => {
    const response = await authApi.login(dto)
    localStorage.setItem('access_token', response.data)
    const me = await authApi.getMe()
    setUser(me.data)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}