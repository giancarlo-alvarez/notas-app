import { connectToDatabase } from '../../utils/database'
import { User } from '../../models/User'
import { comparePassword, generateToken } from '../../utils/auth'
import { userLoginSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase()

    // Obtener datos del cuerpo de la petición
    const body = await readBody(event)

    // Validar datos de entrada
    const { error, value } = userLoginSchema.validate(body)
    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.details[0].message
      })
    }

    const { email, password } = value

    // Buscar usuario por email
    const user = await User.findOne({ email })
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Credenciales inválidas'
      })
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Credenciales inválidas'
      })
    }

    // Generar token JWT
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email
    })

    // Configurar cookie con el token
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    })

    return {
      success: true,
      message: 'Login exitoso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Error en login:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})