import { verifyToken, type JWTPayload } from '../utils/auth'

export interface AuthenticatedUser {
  userId: string
  email: string
}

export default async (event: any) => {
  // Rutas que no requieren autenticación
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/api/auth/login',
    '/api/auth/register'
  ]
  
  // Si es una ruta pública, no aplicar middleware de autenticación
  if (publicRoutes.includes(event.node.req.url)) {
    return
  }
  
  // Solo aplicar middleware a rutas de API protegidas
  if (!event.node.req.url.startsWith('/api/')) {
    return
  }
  
  try {
    // Obtener token del header Authorization o de las cookies
    let token = ''
    
    const authHeader = getHeader(event, 'authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      // Intentar obtener de cookies
      token = getCookie(event, 'auth-token') || ''
    }

    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Token de acceso requerido'
      })
    }

    // Verificar y decodificar el token
    const decoded = verifyToken(token)
    
    // Agregar información del usuario al contexto del evento
    event.context.user = {
      userId: decoded.userId,
      email: decoded.email
    } as AuthenticatedUser

    return decoded
  } catch (error: any) {
    // Si es un error de JWT específico, dar más detalles
    if (error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        message: 'Token expirado'
      })
    } else if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        message: 'Token inválido'
      })
    }
    
    throw createError({
      statusCode: 401,
      message: 'Token inválido o expirado'
    })
  }
}