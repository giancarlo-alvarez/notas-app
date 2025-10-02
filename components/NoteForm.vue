<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon :icon="isEdit ? 'mdi-pencil' : 'mdi-plus'" class="mr-2" />
        {{ isEdit ? 'Editar Nota' : 'Nueva Nota' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
          <!-- Campo Título -->
          <v-text-field
            v-model="formData.title"
            label="Título de la nota"
            prepend-inner-icon="mdi-format-title"
            :rules="titleRules"
            variant="outlined"
            class="mb-3"
            required
          />

          <!-- Campo Categoría -->
          <v-select
            v-model="formData.category"
            label="Categoría"
            prepend-inner-icon="mdi-tag"
            :items="categoryOptions"
            :rules="categoryRules"
            variant="outlined"
            class="mb-3"
            required
          />

          <!-- Campo Descripción -->
          <v-textarea
            v-model="formData.description"
            label="Descripción"
            prepend-inner-icon="mdi-text"
            :rules="descriptionRules"
            variant="outlined"
            rows="6"
            auto-grow
            counter
            class="mb-3"
            required
          />

          <!-- Mensaje de error -->
          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="errorMessage = ''"
          >
            {{ errorMessage }}
          </v-alert>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="closeDialog"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="!valid || loading"
          @click="handleSubmit"
        >
          {{ isEdit ? 'Actualizar' : 'Crear' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Note {
  _id?: string
  title: string
  description: string
  category: 'personal' | 'academica' | 'laboral'
}

interface Props {
  modelValue: boolean
  note?: Note | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  note: null,
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: Omit<Note, '_id'>]
}>()

// Estado del formulario
const form = ref()
const valid = ref(false)
const errorMessage = ref('')

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEdit = computed(() => !!props.note?._id)

const formData = reactive({
  title: '',
  description: '',
  category: 'personal' as 'personal' | 'academica' | 'laboral'
})

// Opciones de categoría
const categoryOptions = [
  { title: 'Personal', value: 'personal', props: { prependIcon: 'mdi-account' } },
  { title: 'Académica', value: 'academica', props: { prependIcon: 'mdi-school' } },
  { title: 'Laboral', value: 'laboral', props: { prependIcon: 'mdi-briefcase' } }
]

// Reglas de validación
const titleRules = [
  (v: string) => !!v || 'El título es requerido',
  (v: string) => v.length >= 3 || 'El título debe tener al menos 3 caracteres',
  (v: string) => v.length <= 100 || 'El título no puede exceder 100 caracteres'
]

const categoryRules = [
  (v: string) => !!v || 'La categoría es requerida'
]

const descriptionRules = [
  (v: string) => !!v || 'La descripción es requerida',
  (v: string) => v.length >= 10 || 'La descripción debe tener al menos 10 caracteres',
  (v: string) => v.length <= 1000 || 'La descripción no puede exceder 1000 caracteres'
]

// Métodos
const handleSubmit = async () => {
  if (!valid.value) return

  try {
    emit('submit', {
      title: formData.title,
      description: formData.description,
      category: formData.category
    })
  } catch (error) {
    console.error('Error en el formulario:', error)
  }
}

const closeDialog = () => {
  dialog.value = false
  resetForm()
}

const resetForm = () => {
  formData.title = ''
  formData.description = ''
  formData.category = 'personal'
  errorMessage.value = ''
  form.value?.resetValidation()
}

// Cargar datos de la nota cuando se abre para editar
watch(() => props.note, (newNote) => {
  if (newNote) {
    formData.title = newNote.title
    formData.description = newNote.description
    formData.category = newNote.category
  } else {
    resetForm()
  }
}, { immediate: true })

// Limpiar formulario cuando se cierra el diálogo
watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) {
    setTimeout(resetForm, 300) // Delay para la animación
  }
})

// Exponer método para mostrar errores
const showError = (message: string) => {
  errorMessage.value = message
}

defineExpose({
  showError
})
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}
</style>