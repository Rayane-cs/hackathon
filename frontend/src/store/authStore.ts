import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface User {
  id: string
  email: string
  role: 'student' | 'academy' | 'teacher'
  is_verified: boolean
  profile?: any
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  setAccessToken: (token: string | null) => void
  clearError: () => void
}

interface RegisterData {
  email: string
  password: string
  role: string
  full_name?: string
  name?: string
  phone?: string
  [key: string]: any
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axios.post(`${API_URL}/auth/login`, { email, password }, {
            withCredentials: true
          })
          const { user, access_token } = response.data
          set({ user, accessToken: access_token, isAuthenticated: true, isLoading: false })
        } catch (error: any) {
          set({ error: error.response?.data?.error || 'Login failed', isLoading: false })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axios.post(`${API_URL}/auth/register`, data, {
            withCredentials: true
          })
          const { user, access_token } = response.data
          set({ user, accessToken: access_token, isAuthenticated: true, isLoading: false })
        } catch (error: any) {
          set({ error: error.response?.data?.error || 'Registration failed', isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true })
        } catch (error) {
          console.error('Logout error:', error)
        }
        set({ user: null, accessToken: null, isAuthenticated: false })
      },

      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isAuthenticated: state.isAuthenticated })
    }
  )
)
