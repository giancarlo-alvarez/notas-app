import Joi from 'joi'

// Esquemas de validación para usuarios
export const userRegistrationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es requerido'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es requerida'
    }),
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 50 caracteres',
      'any.required': 'El nombre es requerido'
    })
})

export const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es requerido'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'La contraseña es requerida'
    })
})

// Esquemas de validación para notas
export const noteSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'El título no puede estar vacío',
      'string.max': 'El título no puede exceder 100 caracteres',
      'any.required': 'El título es requerido'
    }),
  description: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'La descripción no puede exceder 1000 caracteres'
    }),
  category: Joi.string()
    .valid('personal', 'academica', 'laboral')
    .required()
    .messages({
      'any.only': 'La categoría debe ser: personal, académica o laboral',
      'any.required': 'La categoría es requerida'
    })
})

export const noteUpdateSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .messages({
      'string.min': 'El título no puede estar vacío',
      'string.max': 'El título no puede exceder 100 caracteres'
    }),
  description: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'La descripción no puede exceder 1000 caracteres'
    }),
  category: Joi.string()
    .valid('personal', 'academica', 'laboral')
    .messages({
      'any.only': 'La categoría debe ser: personal, académica o laboral'
    })
})