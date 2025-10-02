export interface Note {
  _id: string
  title: string
  description: string
  category: 'personal' | 'academica' | 'laboral'
  userId: string
  createdAt: string
  updatedAt: string
}

export interface NotesState {
  notes: Note[]
  currentNote: Note | null
  isLoading: boolean
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface CreateNoteData {
  title: string
  description: string
  category: 'personal' | 'academica' | 'laboral'
}

export interface UpdateNoteData {
  title?: string
  description?: string
  category?: 'personal' | 'academica' | 'laboral'
}

export const useNotes = () => {
  const notesState = useState<NotesState>('notes', () => ({
    notes: [],
    currentNote: null,
    isLoading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0
    }
  }))

  const fetchNotes = async (params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    sortBy?: string
  }) => {
    try {
      notesState.value.isLoading = true
      
      const query = new URLSearchParams()
      if (params?.page) query.append('page', params.page.toString())
      if (params?.limit) query.append('limit', params.limit.toString())
      if (params?.category) query.append('category', params.category)
      if (params?.search) query.append('search', params.search)
      if (params?.sortBy) query.append('sortBy', params.sortBy)

      const response = await $fetch(`/api/notes?${query.toString()}`) as any
      
      notesState.value.notes = response.data.notes
      notesState.value.pagination = response.data.pagination
      
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error('Error obteniendo notas:', error)
      return { 
        success: false, 
        error: error.data?.message || 'Error obteniendo notas' 
      }
    } finally {
      notesState.value.isLoading = false
    }
  }

  const fetchNote = async (id: string) => {
    try {
      notesState.value.isLoading = true
      
      const response = await $fetch(`/api/notes/${id}`) as any
      
      notesState.value.currentNote = response.data
      
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error('Error obteniendo nota:', error)
      return { 
        success: false, 
        error: error.data?.message || 'Error obteniendo nota' 
      }
    } finally {
      notesState.value.isLoading = false
    }
  }

  const createNote = async (noteData: CreateNoteData) => {
    try {
      notesState.value.isLoading = true
      
      const response = await $fetch('/api/notes', {
        method: 'POST',
        body: noteData
      }) as any

      // Agregar la nueva nota al inicio de la lista
      notesState.value.notes.unshift(response.data.data)
      
      return { success: true, data: response.data.data }
    } catch (error: any) {
      console.error('Error creando nota:', error)
      return { 
        success: false, 
        error: error.data?.message || 'Error creando nota' 
      }
    } finally {
      notesState.value.isLoading = false
    }
  }

  const updateNote = async (id: string, noteData: UpdateNoteData) => {
    try {
      notesState.value.isLoading = true
      
      const response = await $fetch(`/api/notes/${id}`, {
        method: 'PUT',
        body: noteData
      }) as any

      // Actualizar la nota en la lista
      const index = notesState.value.notes.findIndex(note => note._id === id)
      if (index !== -1) {
        notesState.value.notes[index] = response.data.data
      }

      // Actualizar la nota actual si es la misma
      if (notesState.value.currentNote?._id === id) {
        notesState.value.currentNote = response.data.data
      }
      
      return { success: true, data: response.data.data }
    } catch (error: any) {
      console.error('Error actualizando nota:', error)
      return { 
        success: false, 
        error: error.data?.message || 'Error actualizando nota' 
      }
    } finally {
      notesState.value.isLoading = false
    }
  }

  const deleteNote = async (id: string) => {
    try {
      notesState.value.isLoading = true
      
      await $fetch(`/api/notes/${id}`, {
        method: 'DELETE'
      })

      // Remover la nota de la lista
      notesState.value.notes = notesState.value.notes.filter(note => note._id !== id)

      // Limpiar la nota actual si es la misma
      if (notesState.value.currentNote?._id === id) {
        notesState.value.currentNote = null
      }
      
      return { success: true }
    } catch (error: any) {
      console.error('Error eliminando nota:', error)
      return { 
        success: false, 
        error: error.data?.message || 'Error eliminando nota' 
      }
    } finally {
      notesState.value.isLoading = false
    }
  }

  return {
    // Estado
    notes: readonly(computed(() => notesState.value.notes)),
    currentNote: readonly(computed(() => notesState.value.currentNote)),
    isLoading: readonly(computed(() => notesState.value.isLoading)),
    pagination: readonly(computed(() => notesState.value.pagination)),
    
    // Métodos
    fetchNotes,
    fetchNote,
    createNote,
    updateNote,
    deleteNote
  }
}