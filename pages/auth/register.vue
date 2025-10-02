<template>
  <v-container fluid class="fill-height auth-container">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <div class="text-center mb-8">
          <h1 class="text-h3 font-weight-bold mb-2">Notes App</h1>
          <p class="text-h6 text-medium-emphasis">Crea tu cuenta y comienza a organizar</p>
        </div>

        <v-card class="mx-auto" max-width="400" elevation="8">
          <v-card-title class="text-center py-6">
            <v-icon icon="mdi-account-plus" size="large" class="mr-2" />
            Registrarse
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="handleRegister">
              <!-- Campo Nombre -->
              <v-text-field
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
                label="Contraseña (mínimo 6 caracteres)"
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
                Registrarse
              </v-btn>

              <!-- Enlace para login -->
              <div class="text-center">
                <v-btn
                  variant="text"
                  color="primary"
                  to="/auth/login"
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  auth: false
})

const { register } = useAuth()

// Estado del formulario
const form = ref()
const valid = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const formData = reactive({
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
const handleRegister = async () => {
  if (!valid.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await register(formData.name, formData.email, formData.password)
    
    if (result.success) {
      await navigateTo('/dashboard')
    } else {
      errorMessage.value = result.error || 'Error en el registro'
    }
  } catch (error) {
    console.error('Error en registro:', error)
    errorMessage.value = 'Error inesperado. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.v-card {
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.text-h3 {
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.text-h6 {
  color: rgba(255, 255, 255, 0.9);
}
</style>