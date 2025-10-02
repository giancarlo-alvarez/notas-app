import { connectToDatabase } from '../../utils/database'
import { User } from '../../models/User'
import { hashPassword, generateToken } from '../../utils/auth'
import { userRegistrationSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase()

    // Obtener datos del cuerpo de la petición
    const body = await readBody(event)

    // Validar datos de entrada
    const { error, value } = userRegistrationSchema.validate(body)
    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.details[0].message
      })
    }

    const { name, email, password } = value

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'El usuario ya existe con este email'
      })
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password)

    // Crear nuevo usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })

    await newUser.save()

    // Generar token JWT
    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email
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
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      },
      token
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Error en registro:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})