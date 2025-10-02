<template>
  <v-card
    class="note-card"
    elevation="2"
    :class="categoryClass"
    @click="$emit('view', note)"
  >
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon :icon="categoryIcon" :color="categoryColor" class="mr-2" />
        <span class="text-truncate">{{ note.title }}</span>
      </div>
      
      <v-menu>
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            icon="mdi-dots-vertical"
            variant="text"
            size="small"
            @click.stop
          />
        </template>
        
        <v-list>
          <v-list-item @click="$emit('edit', note)">
            <template #prepend>
              <v-icon icon="mdi-pencil" />
            </template>
            <v-list-item-title>Editar</v-list-item-title>
          </v-list-item>
          
          <v-list-item @click="$emit('delete', note)" class="text-error">
            <template #prepend>
              <v-icon icon="mdi-delete" />
            </template>
            <v-list-item-title>Eliminar</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-text>
      <p class="text-body-2 text-medium-emphasis mb-3 note-description">
        {{ truncatedDescription }}
      </p>
      
      <div class="d-flex align-center justify-space-between">
        <v-chip
          :color="categoryColor"
          size="small"
          variant="tonal"
        >
          {{ categoryLabel }}
        </v-chip>
        
        <div class="text-caption text-medium-emphasis">
          <div>{{ formatDate(note.createdAt) }}</div>
          <div v-if="note.updatedAt !== note.createdAt" class="text-success">
            Editado: {{ formatDate(note.updatedAt) }}
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
export interface Note {
  _id: string
  title: string
  description: string
  category: 'personal' | 'academica' | 'laboral'
  userId: string
  createdAt: string
  updatedAt: string
}

interface Props {
  note: Note
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'view': [note: Note]
  'edit': [note: Note]
  'delete': [note: Note]
}>()

// Computed properties para la categoría
const categoryConfig = computed(() => {
  const configs = {
    personal: {
      icon: 'mdi-account',
      color: 'blue',
      label: 'Personal',
      class: 'border-l-4 border-blue'
    },
    academica: {
      icon: 'mdi-school',
      color: 'green',
      label: 'Académica',
      class: 'border-l-4 border-green'
    },
    laboral: {
      icon: 'mdi-briefcase',
      color: 'orange',
      label: 'Laboral',
      class: 'border-l-4 border-orange'
    }
  }
  
  return configs[props.note.category] || configs.personal
})

const categoryIcon = computed(() => categoryConfig.value.icon)
const categoryColor = computed(() => categoryConfig.value.color)
const categoryLabel = computed(() => categoryConfig.value.label)
const categoryClass = computed(() => categoryConfig.value.class)

// Descripción truncada
const truncatedDescription = computed(() => {
  const maxLength = 150
  if (props.note.description.length <= maxLength) {
    return props.note.description
  }
  return props.note.description.substring(0, maxLength) + '...'
})

// Formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return 'Hoy'
  } else if (diffDays === 2) {
    return 'Ayer'
  } else if (diffDays <= 7) {
    return `Hace ${diffDays - 1} días`
  } else {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
}
</script>

<style scoped>
.note-card {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border-radius: 12px;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.note-description {
  line-height: 1.4;
  min-height: 3.5em;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.border-l-4 {
  border-left: 4px solid;
}

.border-blue {
  border-left-color: rgb(var(--v-theme-blue));
}

.border-green {
  border-left-color: rgb(var(--v-theme-green));
}

.border-orange {
  border-left-color: rgb(var(--v-theme-orange));
}
</style>