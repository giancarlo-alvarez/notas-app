<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" dark>
      <v-app-bar-title>Notes App</v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>{{ user?.name || 'Usuario' }}</v-list-item-title>
            <v-list-item-subtitle>{{ user?.email }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="handleLogout">
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <!-- Header -->
        <v-row class="mb-4">
          <v-col cols="12" md="8">
            <h1 class="text-h4 mb-2">Mis Notas</h1>
            <p class="text-subtitle-1 text-medium-emphasis">
              Gestiona tus notas de forma fácil y organizada
            </p>
          </v-col>
          <v-col cols="12" md="4" class="d-flex justify-end align-center">
            <v-btn color="primary" @click="openNoteForm()" prepend-icon="mdi-plus">
              Nueva Nota
            </v-btn>
          </v-col>
        </v-row>

        <!-- Filters -->
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              label="Buscar notas..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="selectedCategory"
              :items="categoryOptions"
              label="Categoría"
              variant="outlined"
              density="compact"
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Ordenar por"
              variant="outlined"
              density="compact"
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="pageSize"
              :items="[5, 10, 20, 50]"
              label="Por página"
              variant="outlined"
              density="compact"
            ></v-select>
          </v-col>
        </v-row>

        <!-- Loading -->
        <v-row v-if="loading">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p class="mt-2">Cargando notas...</p>
          </v-col>
        </v-row>

        <!-- Error -->
        <v-row v-else-if="error">
          <v-col cols="12">
            <v-alert type="error" variant="tonal">
              {{ error }}
            </v-alert>
          </v-col>
        </v-row>

        <!-- Notes Grid -->
        <v-row v-else-if="notes.length > 0">
          <v-col
            v-for="note in notes"
            :key="note._id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="h-100" hover>
              <v-card-title class="text-h6">
                {{ note.title }}
              </v-card-title>
              
              <v-card-text>
                <p class="text-body-2 mb-2">
                  {{ truncateText(note.description) }}
                </p>
                
                <v-chip
                  :color="getCategoryColor(note.category)"
                  size="small"
                  variant="tonal"
                  class="mb-2"
                >
                  {{ note.category }}
                </v-chip>
                
                <div class="text-caption text-medium-emphasis">
                  <div>Creado: {{ formatDate(note.createdAt) }}</div>
                  <div v-if="note.updatedAt !== note.createdAt">
                    Actualizado: {{ formatDate(note.updatedAt) }}
                  </div>
                </div>
              </v-card-text>
              
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="openNoteForm(note)">
                      <v-list-item-title>Editar</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="openDeleteDialog(note)">
                      <v-list-item-title>Eliminar</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Empty State -->
        <v-row v-else>
          <v-col cols="12" class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1">mdi-note-outline</v-icon>
            <h3 class="text-h5 mt-4 mb-2">No hay notas</h3>
            <p class="text-body-1 text-medium-emphasis mb-4">
              Comienza creando tu primera nota
            </p>
            <v-btn color="primary" @click="openNoteForm()" prepend-icon="mdi-plus">
              Crear Primera Nota
            </v-btn>
          </v-col>
        </v-row>

        <!-- Pagination -->
        <v-row v-if="pagination.totalPages > 1" class="mt-4">
          <v-col cols="12" class="d-flex justify-center">
            <v-pagination
              v-model="currentPage"
              :length="pagination.totalPages"
              @update:model-value="changePage"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Note Form Dialog -->
    <v-dialog v-model="showNoteDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          {{ selectedNote ? 'Editar Nota' : 'Nueva Nota' }}
        </v-card-title>
        
        <v-card-text>
           <v-form @submit.prevent="submitNoteForm">
             <v-text-field
               v-model="noteForm.title"
               label="Título"
               variant="outlined"
               :rules="[v => !!v || 'El título es requerido']"
               required
             ></v-text-field>
             
             <v-select
               v-model="noteForm.category"
               :items="categoryOptions.slice(1)"
               label="Categoría"
               variant="outlined"
               :rules="[v => !!v || 'La categoría es requerida']"
               required
             ></v-select>
             
             <v-textarea
               v-model="noteForm.description"
               label="Descripción"
               variant="outlined"
               rows="4"
               :rules="[v => !!v || 'La descripción es requerida']"
               required
             ></v-textarea>
           </v-form>
         </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeNoteForm">Cancelar</v-btn>
          <v-btn
            color="primary"
            @click="submitNoteForm"
            :loading="formLoading"
          >
            {{ selectedNote ? 'Actualizar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que quieres eliminar la nota "{{ noteToDelete?.title }}"?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showDeleteDialog = false">Cancelar</v-btn>
          <v-btn
            color="error"
            @click="confirmDelete"
            :loading="deleteLoading"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      timeout="3000"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted, watch } from 'vue'

// Interfaces
interface User {
  _id: string
  name: string
  email: string
}

interface Note {
  _id: string
  title: string
  description: string
  category: string
  createdAt: string
  updatedAt: string
}

// Auth state
const authState = reactive({
  user: null as User | null,
  isAuthenticated: false
})

// Notes state
const notesState = reactive({
  notes: [] as Note[],
  loading: false,
  error: null as string | null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }
})

// Auth functions
const logout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    authState.user = null
    authState.isAuthenticated = false
    window.location.href = '/auth/login'
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

const checkAuth = async () => {
  try {
    const response: any = await $fetch('/api/auth/me')
    authState.user = response.user
    authState.isAuthenticated = true
    return { success: true, user: response.user }
  } catch (error) {
    authState.user = null
    authState.isAuthenticated = false
    return { success: false }
  }
}

// Notes functions
const fetchNotes = async (params?: {
  page?: number
  limit?: number
  category?: string
  search?: string
  sortBy?: string
}) => {
  notesState.loading = true
  notesState.error = null
  
  try {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.category) query.append('category', params.category)
    if (params?.search) query.append('search', params.search)
    if (params?.sortBy) query.append('sortBy', params.sortBy)
    
    const response: any = await $fetch(`/api/notes?${query.toString()}`)
    
    notesState.notes = response.data.notes
    notesState.pagination = response.data.pagination
  } catch (error: any) {
    notesState.error = error.data?.message || 'Error al cargar las notas'
  } finally {
    notesState.loading = false
  }
}

const createNote = async (noteData: { title: string; description: string; category: string }) => {
  try {
    const response: any = await $fetch('/api/notes', {
      method: 'POST',
      body: noteData
    })
    
    await loadNotes()
    return { success: true, note: response.data }
  } catch (error: any) {
    return { success: false, error: error.data?.message || 'Error al crear la nota' }
  }
}

const updateNote = async (id: string, noteData: Partial<{ title: string; description: string; category: string }>) => {
  try {
    const response: any = await $fetch(`/api/notes/${id}`, {
      method: 'PUT',
      body: noteData
    })
    
    await loadNotes()
    return { success: true, note: response.data }
  } catch (error: any) {
    return { success: false, error: error.data?.message || 'Error al actualizar la nota' }
  }
}

const deleteNote = async (id: string) => {
  try {
    await $fetch(`/api/notes/${id}`, { method: 'DELETE' })
    await loadNotes()
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.data?.message || 'Error al eliminar la nota' }
  }
}

// Estado de la página
const currentPage = ref(1)
const selectedCategory = ref('')
const searchQuery = ref('')
const sortBy = ref('createdAt')
const pageSize = ref(10)

// Estado de diálogos
const selectedNote = ref<Note | null>(null)
const showNoteDialog = ref(false)
const noteToDelete = ref<Note | null>(null)
const showDeleteDialog = ref(false)
const formLoading = ref(false)
const deleteLoading = ref(false)

// Form data
const noteForm = reactive({
  title: '',
  description: '',
  category: ''
})

// Estado de notificaciones
const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Destructure reactive state
const { user } = toRefs(authState)
const { notes, loading, error, pagination } = toRefs(notesState)

// Opciones de filtros
const categoryOptions = [
  { title: 'Todas', value: '' },
  { title: 'Personal', value: 'personal' },
  { title: 'Trabajo', value: 'trabajo' },
  { title: 'Ideas', value: 'ideas' },
  { title: 'Recordatorios', value: 'recordatorios' }
]

const sortOptions = [
  { title: 'Fecha de creación', value: 'createdAt' },
  { title: 'Título', value: 'title' },
  { title: 'Última actualización', value: 'updatedAt' }
]

// Métodos
const loadNotes = async () => {
  await fetchNotes({
    page: currentPage.value,
    limit: pageSize.value,
    category: selectedCategory.value || undefined,
    search: searchQuery.value || undefined,
    sortBy: sortBy.value
  })
}

const openNoteForm = (note?: Note) => {
  selectedNote.value = note || null
  if (note) {
    noteForm.title = note.title
    noteForm.description = note.description
    noteForm.category = note.category
  } else {
    noteForm.title = ''
    noteForm.description = ''
    noteForm.category = ''
  }
  showNoteDialog.value = true
}

const closeNoteForm = () => {
  selectedNote.value = null
  showNoteDialog.value = false
  noteForm.title = ''
  noteForm.description = ''
  noteForm.category = ''
}

const openDeleteDialog = (note: Note) => {
  noteToDelete.value = note
  showDeleteDialog.value = true
}

const submitNoteForm = async () => {
  if (!noteForm.title || !noteForm.description || !noteForm.category) {
    showNotification('Por favor completa todos los campos', 'error')
    return
  }

  formLoading.value = true
  
  try {
    let result
    if (selectedNote.value) {
      result = await updateNote(selectedNote.value._id, noteForm)
    } else {
      result = await createNote(noteForm)
    }
    
    if (result.success) {
      closeNoteForm()
      showNotification('Nota guardada exitosamente', 'success')
    } else {
      showNotification(result.error || 'Error al guardar la nota', 'error')
    }
  } finally {
    formLoading.value = false
  }
}

const confirmDelete = async () => {
  if (!noteToDelete.value) return
  
  deleteLoading.value = true
  
  try {
    const result = await deleteNote(noteToDelete.value._id)
    
    if (result.success) {
      showDeleteDialog.value = false
      noteToDelete.value = null
      showNotification('Nota eliminada exitosamente', 'success')
    } else {
      showNotification(result.error || 'Error al eliminar la nota', 'error')
    }
  } finally {
    deleteLoading.value = false
  }
}

const showNotification = (message: string, color: string = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

const handleLogout = async () => {
  await logout()
}

const changePage = (page: number) => {
  currentPage.value = page
  loadNotes()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    personal: 'blue',
    trabajo: 'green',
    ideas: 'purple',
    recordatorios: 'orange'
  }
  return colors[category] || 'grey'
}

const truncateText = (text: string, maxLength: number = 100) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// Watchers para recargar notas cuando cambien los filtros
watch([selectedCategory, searchQuery, sortBy, pageSize], () => {
  currentPage.value = 1
  loadNotes()
})

// Cargar notas al montar el componente
onMounted(async () => {
  await checkAuth()
  await loadNotes()
})
</script>

<style scoped>
.v-main {
  background-color: rgb(var(--v-theme-surface));
}
</style>