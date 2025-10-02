// @ts-ignore - Nuxt auto-imports
export default defineNuxtRouteMiddleware(async (to: any, from: any) => {
  // Solo ejecutar en el cliente y evitar bucles infinitos
  // Excluir la página de inicio (landing page) del middleware de autenticación
  // @ts-ignore - process.client is available in Nuxt runtime
  if (process.client && to.path !== '/' && to.path !== '/auth/login' && to.path !== '/auth/register') {
    // @ts-ignore - Nuxt auto-imports
    const { $fetch } = useNuxtApp()
    
    try {
      // Verificar si hay un token válido
      const token = localStorage.getItem('auth-token')
      
      if (!token) {
        // @ts-ignore - Nuxt auto-imports
        return navigateTo('/auth/login')
      }
      
      // Solo verificar autenticación si tenemos un token
      await $fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (error) {
      // Limpiar token inválido y redirigir
      localStorage.removeItem('auth-token')
      // @ts-ignore - Nuxt auto-imports
      return navigateTo('/auth/login')
    }
  }
})