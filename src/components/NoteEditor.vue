<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {getNote, createNote, updateNote, deleteNote} from '@/services/notes'
import {listColors, listPriorities} from '@/services/meta'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps({
    uid: {type: String, default: null},
})
const emit = defineEmits(['saved', 'deleted', 'created'])

const isNew = computed(() => !props.uid)

const loading = ref(false)
const saving = ref(false)
const error = ref(null)

const title = ref('')
const content = ref('')
const priority = ref(null)
const color = ref(null)
const deletedAt = ref(null)

const priorities = ref([])
const colors = ref([])

async function loadMeta() {
    priorities.value = (await listPriorities()).data
    colors.value = (await listColors()).data
}

async function loadNote() {
    if (!props.uid) {
        title.value = ''
        content.value = ''
        priority.value = null
        color.value = null
        deletedAt.value = null
        return
    }
    loading.value = true
    error.value = null
    try {
        const n = (await getNote(props.uid))?.data || {}
        title.value = n.title || ''
        content.value = n.content || ''
        priority.value = n.priority || null
        color.value = n.color || null
        deletedAt.value = n.deletedAt || null
    } catch (e) {
        error.value = e
    } finally {
        loading.value = false
    }
}

async function save() {
    saving.value = true
    error.value = null
    try {
        if (isNew.value) {
            const created = (await createNote({
                title: title.value,
                content: content.value,
                priority: priority.value,
                color: color.value
            }))?.data
            emit('created', created)
        } else {
            await updateNote(props.uid, {
                title: title.value,
                content: content.value,
                priority: priority.value,
                color: color.value
            })
            emit('saved')
        }
    } catch (e) {
        error.value = e
    } finally {
        saving.value = false
    }
}

async function removeNote() {
    if (!props.uid) return
    if (!confirm('Really delete this note?')) return
    saving.value = true
    error.value = null
    try {
        await deleteNote(props.uid)
        emit('deleted')
    } catch (e) {
        error.value = e
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    loadMeta()
    loadNote()
})

watch(() => props.uid, () => {
    loadNote()
})
</script>

<template>
    <div class="p-6">
        <div v-if="!uid && !isNew" class="text-gray-500">Select a note.</div>

        <div v-if="loading">Loading…</div>
        <div v-else>
            <div class="flex items-center justify-between mb-4">
                <h1 class="text-xl font-semibold">{{ isNew ? 'New note' : 'Note detail' }}</h1>
                <div class="space-x-2">
                    <BaseButton
                        variant="primary"
                        :disabled="saving || (!title && !content)"
                        @click="save"
                    >Save</BaseButton>
                    <BaseButton v-if="!isNew"
                            variant="danger"
                            :disabled="saving"
                            @click="removeNote"
                    >Delete</BaseButton>
                </div>
            </div>

            <div v-if="error" class="mb-3 text-sm text-red-600">An error occurred.</div>

            <div class="grid gap-4 max-w-3xl">
                <div class="border-b border-gray-200">
                    <input v-model="title" type="text"
                           class="w-full bg-transparent border-0 outline-none focus:ring-0 px-0 py-2 text-2xl font-semibold placeholder:text-gray-400"
                           placeholder="Title"/>
                </div>

                <div>
                    <textarea v-model="content" rows="12"
                              class="w-full bg-transparent border-0 outline-none focus:ring-0 px-0 py-2 placeholder:text-gray-400"
                              placeholder="Start writing your note..."></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm text-gray-700 mb-1">Priority</label>
                        <select v-model="priority" class="w-full border rounded px-3 py-2">
                            <option :value="null">(none)</option>
                            <option v-for="p in priorities" :key="p.code" :value="p.code">{{ p.label }}</option>
                        </select>
                    </div>
                    <div class="flex flex-col">
                        <label class="block text-sm text-gray-700 mb-1">Color</label>
                        <div class="flex items-center gap-x-3">
                            <div v-for="c in colors" :key="c.code" class="flex rounded-full outline -outline-offset-1 outline-black/10">
                                <input type="radio" name="color" :value="c.code" v-model="color" :aria-label="c.label" :class="['color-select', c.code]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="deletedAt" class="text-sm text-gray-500">Deleted: {{
                        new Date(deletedAt).toLocaleString()
                    }}
                </div>
                <div v-else-if="!isNew" class="text-sm text-gray-500">Last updated: {{
                        new Date().toLocaleString()
                    }}
                </div>
            </div>
        </div>
    </div>
</template>
