<template>
  <div class="landing-page">
    <div class="hero-section">
      <div class="container">
        <h1 class="hero-title">Bienvenido a Notes App</h1>
        <p class="hero-subtitle">
          Organiza tus ideas, gestiona tus notas y mantén todo en un solo lugar.
        </p>
        
        <div class="cta-buttons">
          <NuxtLink to="/auth/register" class="btn btn-primary">
            Registrarse
          </NuxtLink>
          <NuxtLink to="/auth/login" class="btn btn-secondary">
            Iniciar Sesión
          </NuxtLink>
        </div>
        
        <div v-if="isAuthenticated" class="authenticated-user">
          <p>¡Ya tienes una sesión activa!</p>
          <NuxtLink to="/dashboard" class="btn btn-success">
            Ir al Dashboard
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <div class="features-section">
      <div class="container">
        <h2>Características principales</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>📝 Crear Notas</h3>
            <p>Crea y edita notas de forma rápida y sencilla</p>
          </div>
          <div class="feature-card">
            <h3>🔒 Seguro</h3>
            <p>Tus notas están protegidas con autenticación segura</p>
          </div>
          <div class="feature-card">
            <h3>📱 Responsive</h3>
            <p>Accede desde cualquier dispositivo</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Verificar si el usuario ya está autenticado
const { isAuthenticated, checkAuth } = useAuth()

onMounted(async () => {
  // Verificar autenticación sin redirigir automáticamente
  await checkAuth()
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero-section {
  padding: 100px 0;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 40px;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.btn {
  padding: 15px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: inline-block;
}

.btn-primary {
  background: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
}

.btn-primary:hover {
  background: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
}

.btn-secondary {
  background: transparent;
  color: white;
  border-color: white;
}

.btn-secondary:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 255, 255, 0.3);
}

.btn-success {
  background: #4ecdc4;
  color: white;
  border-color: #4ecdc4;
}

.btn-success:hover {
  background: #45b7aa;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(78, 205, 196, 0.3);
}

.authenticated-user {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  margin-top: 30px;
}

.features-section {
  padding: 80px 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.features-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.feature-card p {
  opacity: 0.9;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 200px;
  }
}
</style>
