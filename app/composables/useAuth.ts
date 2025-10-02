export interface User {
  id: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuth = () => {
  const authState = useState<AuthState>('auth', () => ({
    user: null,
    isAuthenticated: false,
    isLoading: true
  }))

  const login = async (email: string, password: string) => {
    try {
      authState.value.isLoading = true
      
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      // Guardar token en localStorage
      if (response.token && process.client) {
        localStorage.setItem('auth-token', response.token)
      }

      authState.value.user = response.user
      authState.value.isAuthenticated = true
      
      return { success: true, data: response }
    } catch (error: any) {
      console.error('Error en login:', error)
      return { 
        success: false, 
        error: error.data?.statusMessage || error.statusMessage || 'Error en el login' 
      }
    } finally {
      authState.value.isLoading = false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      authState.value.isLoading = true
      
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { name, email, password }
      })

      // Guardar token en localStorage
      if (response.token && process.client) {
        localStorage.setItem('auth-token', response.token)
      }

      authState.value.user = response.user
      authState.value.isAuthenticated = true
      
      return { success: true, data: response }
    } catch (error: any) {
      console.error('Error en registro:', error)
      return { 
        success: false, 
        error: error.data?.statusMessage || error.statusMessage || 'Error en el registro' 
      }
    } finally {
      authState.value.isLoading = false
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })

      authState.value.user = null
      authState.value.isAuthenticated = false
      
      await navigateTo('/auth/login')
      
      return { success: true }
    } catch (error: any) {
      console.error('Error en logout:', error)
      return { 
        success: false, 
        error: error.data?.message || 'Error en el logout' 
      }
    }
  }

  const checkAuth = async () => {
    try {
      authState.value.isLoading = true
      
      const response = await $fetch('/api/auth/me')
      
      authState.value.user = response.user
      authState.value.isAuthenticated = true
      
      return { success: true, user: response.user }
    } catch (error) {
      authState.value.user = null
      authState.value.isAuthenticated = false
      
      return { success: false }
    } finally {
      authState.value.isLoading = false
    }
  }

  return {
    // Estado
    user: readonly(computed(() => authState.value.user)),
    isAuthenticated: readonly(computed(() => authState.value.isAuthenticated)),
    isLoading: readonly(computed(() => authState.value.isLoading)),
    
    // Métodos
    login,
    register,
    logout,
    checkAuth
  }
}