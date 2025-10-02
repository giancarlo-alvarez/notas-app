export default defineEventHandler(async (event) => {
  try {
    // Limpiar la cookie de autenticación
    setCookie(event, 'auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expira inmediatamente
    })

    return {
      success: true,
      message: 'Logout exitoso'
    }
  } catch (error: any) {
    console.error('Error en logout:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})