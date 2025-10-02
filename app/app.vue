<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Configuración global de la aplicación
useHead({
  title: 'Notes App',
  meta: [
    { name: 'description', content: 'Aplicación para gestionar notas personales, académicas y laborales' }
  ]
})
</script>
