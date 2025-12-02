<script setup>
import {onMounted, ref, computed} from 'vue'
import {listNotes} from '@/services/notes'
import {listPriorities} from '@/services/meta'
import BaseButton from '@/components/BaseButton.vue'
import MenuItem from '@/components/MenuItem.vue'

const props = defineProps({
    modelValue: {type: String, default: null},
})
const emit = defineEmits(['update:modelValue'])

const notes = ref([])
const loading = ref(false)
const error = ref(null)

// Priority filter state
const priorities = ref([])
const selectedPriority = ref(localStorage.getItem('notes.priorityFilter') || '') // '' => All

const filteredNotes = computed(() => {
    const p = (selectedPriority.value || '').trim()
    if (!p) return notes.value
    return notes.value.filter(n => (n?.priority || '') === p)
})

async function load() {
    loading.value = true
    error.value = null
    try {
        // Load notes
        notes.value = (await listNotes()).data
        // Load priorities for filter UI (ignore errors silently)
        try {
            priorities.value = (await listPriorities()).data || []
        } catch (e) {
            priorities.value = []
        }
    } catch (e) {
        error.value = e
    } finally {
        loading.value = false
    }
}

function prepend(note) {
    const now = new Date().toISOString()
    // Normalize minimal fields for a freshly created note so the menu shows sane data immediately
    const n = {
        title: note?.title?.trim?.() ? note.title : 'New note',
        content: note?.content ?? '',
        priority: note?.priority ?? null,
        color: note?.color ?? null,
        deletedAt: note?.deletedAt ?? null,
        createdAt: note?.createdAt ?? now,
        updatedAt: note?.updatedAt ?? now,
        ...note,
    }
    // Remove any existing note with same uid and put this one at the top
    notes.value = [n, ...notes.value.filter(x => x.uid !== n.uid)]
}

function select(uid) {
    emit('update:modelValue', uid)
}

function onPriorityChange(e) {
    const v = e?.target?.value ?? ''
    selectedPriority.value = v
    localStorage.setItem('notes.priorityFilter', v)
}

onMounted(load)

defineExpose({reload: load, prepend})
</script>

<template>
    <div class="bg-gray-900 fixed inset-y-0 z-50 flex w-72 lex-col">
        <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-4">
            <div class="p-4 flex items-center justify-between border-b border-gray-200">
                <h2 class="text-lg font-semibold">Notes</h2>
                <BaseButton variant="primary" @click="$emit('create')">New</BaseButton>
            </div>

            <!-- Priority filter -->
            <div class="px-2">
                <label class="block text-xs text-gray-600 mb-1">Filter by priority</label>
                <select :value="selectedPriority" @change="onPriorityChange" class="w-full border rounded px-2 py-1 text-sm">
                    <option value="">All priorities</option>
                    <option v-for="p in priorities" :key="p.code" :value="p.code">{{ p.label }}</option>
                </select>
            </div>

            <div v-if="loading" class="p-4 text-gray-500 text-sm">Loading…</div>
            <div v-else-if="error" class="p-4 text-red-600 text-sm">Failed to load.</div>
            <nav v-else class="flex flex-1 flex-col">
                <ul role="list" class="flex flex-1 flex-col gap-2">
                    <li v-for="n in filteredNotes" :key="n.uid">
                        <MenuItem
                            :color="n.color"
                            :active="n.uid === modelValue"
                            :deleted="!!n.deletedAt"
                            @click="select(n.uid)"
                        >
                            <div class="flex flex-col gap-0.5">
                                <div class="flex items-center justify-between gap-2">
                                    <div class="flex items-center min-w-0">
                                        <span class="font-medium truncate">{{ n.title }}</span>
                                    </div>
                                    <span v-if="n.priority"
                                          :class="['badge', n.priority]">{{ n.priority }}</span>
                                </div>
                                <div v-if="n.content" class="text-start font-light text-sm line-clamp-2">{{ n.content }}</div>
                                <div class="text-end text-xs text-gray-400 truncate">{{
                                        new Date(n.updatedAt).toLocaleString()
                                    }}
                                </div>
                            </div>
                        </MenuItem>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>
