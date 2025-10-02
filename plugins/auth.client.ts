// @ts-ignore - Nuxt auto-imports
export default defineNuxtPlugin(async () => {
  // Inicializar el estado de autenticación en el cliente
  if (process.client) {
    // @ts-ignore - Nuxt auto-imports
    const { checkAuth } = useAuth()
    
    try {
      // Verificar si hay un token antes de hacer la petición
      const hasToken = localStorage.getItem('auth-token') || document.cookie.includes('auth-token')
      
      if (hasToken) {
        await checkAuth()
      }
    } catch (error) {
      // Usuario no autenticado, limpiar cualquier token inválido
      localStorage.removeItem('auth-token')
    }
  }
})