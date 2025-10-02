<template>
  <v-card class="mx-auto" max-width="400" elevation="8">
    <v-card-title class="text-center py-6">
      <v-icon :icon="isLogin ? 'mdi-login' : 'mdi-account-plus'" size="large" class="mr-2" />
      {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
    </v-card-title>

    <v-card-text>
      <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
        <!-- Campo Nombre (solo para registro) -->
        <v-text-field
          v-if="!isLogin"
          v-model="formData.name"
          label="Nombre completo"
          prepend-inner-icon="mdi-account"
          :rules="nameRules"
          variant="outlined"
          class="mb-3"
          required
        />

        <!-- Campo Email -->
        <v-text-field
          v-model="formData.email"
          label="Correo electrónico"
          prepend-inner-icon="mdi-email"
          :rules="emailRules"
          variant="outlined"
          class="mb-3"
          type="email"
          required
        />

        <!-- Campo Contraseña -->
        <v-text-field
          v-model="formData.password"
          :label="isLogin ? 'Contraseña' : 'Contraseña (mínimo 6 caracteres)'"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          :rules="passwordRules"
          variant="outlined"
          class="mb-3"
          required
          @click:append-inner="showPassword = !showPassword"
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

        <!-- Botón de envío -->
        <v-btn
          type="submit"
          :loading="loading"
          :disabled="!valid || loading"
          color="primary"
          size="large"
          block
          class="mb-4"
        >
          {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
        </v-btn>

        <!-- Enlace para cambiar entre login y registro -->
        <div class="text-center">
          <v-btn
            variant="text"
            color="primary"
            @click="$emit('toggle-mode')"
          >
            {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

interface FormData {
  name: string
  email: string
  password: string
}

interface Props {
  isLogin: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'toggle-mode': []
  'submit': [data: FormData]
}>()

// Estado del formulario
const form = ref()
const valid = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const formData = reactive<FormData>({
  name: '',
  email: '',
  password: ''
})

// Reglas de validación
const nameRules = [
  (v: string) => !!v || 'El nombre es requerido',
  (v: string) => v.length >= 2 || 'El nombre debe tener al menos 2 caracteres'
]

const emailRules = [
  (v: string) => !!v || 'El email es requerido',
  (v: string) => /.+@.+\..+/.test(v) || 'El email debe ser válido'
]

const passwordRules = [
  (v: string) => !!v || 'La contraseña es requerida',
  (v: string) => v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
]

// Métodos
const handleSubmit = async () => {
  if (!valid.value) return

  try {
    emit('submit', { ...formData })
  } catch (error) {
    console.error('Error en el formulario:', error)
  }
}

// Limpiar formulario cuando cambia el modo
watch(() => props.isLogin, () => {
  formData.name = ''
  formData.email = ''
  formData.password = ''
  errorMessage.value = ''
  form.value?.resetValidation()
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