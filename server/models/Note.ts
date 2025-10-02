import mongoose, { Document, Schema } from 'mongoose'

export interface INote extends Document {
  _id: string
  title: string
  description: string
  category: 'personal' | 'academica' | 'laboral'
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const noteSchema = new Schema<INote>({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    minlength: [1, 'El título no puede estar vacío'],
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres'],
    default: ''
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: {
      values: ['personal', 'academica', 'laboral'],
      message: 'La categoría debe ser: personal, académica o laboral'
    }
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario es requerido']
  }
}, {
  timestamps: true
})

// Índices para mejorar performance
noteSchema.index({ userId: 1, createdAt: -1 })
noteSchema.index({ userId: 1, category: 1 })
noteSchema.index({ userId: 1, title: 'text', description: 'text' })

export const Note = mongoose.model<INote>('Note', noteSchema)