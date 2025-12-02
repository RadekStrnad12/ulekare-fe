<script setup>
import { ref } from 'vue'
import SidebarNotes from '@/components/SidebarNotes.vue'
import NoteEditor from '@/components/NoteEditor.vue'

const selectedUid = ref(null)
const sidebarRef = ref(null)

function onCreated(note) {
  selectedUid.value = note.uid || null
  // Prepend the newly created note to the list and ensure it has updatedAt set to now
  sidebarRef.value?.prepend?.(note)
}

function onSaved() {
  sidebarRef.value?.reload?.()
}

function onDeleted() {
  sidebarRef.value?.reload?.()
  selectedUid.value = null
}
</script>

<template>
    <SidebarNotes ref="sidebarRef" v-model="selectedUid" @create="selectedUid = null" />
    <main class="lg:pl-72">
      <NoteEditor :uid="selectedUid" @created="onCreated" @saved="onSaved" @deleted="onDeleted" />
    </main>
</template>

<style scoped>
/* You can refine styles later; layout is handled with Tailwind utility classes */
</style>
