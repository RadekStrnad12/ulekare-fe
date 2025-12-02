<script setup>
import {computed} from 'vue'

const props = defineProps({
    color: {type: String, default: null}, // red|amber|emerald|sky|purple|slate
    active: {type: Boolean, default: false},
    deleted: {type: Boolean, default: false},
    type: {type: String, default: 'button'},
    disabled: {type: Boolean, default: false},
})

const colorClass = computed(() => {
    const c = (props.color || '').toLowerCase()
    if (['red', 'amber', 'emerald', 'sky', 'purple', 'slate'].includes(c)) return c
    return ''
})

const cls = computed(() => [
    'menu-item',
    colorClass.value,
    {
        'opacity-50 grayscale': props.deleted,
        'active': props.active,
    },
])
</script>

<template>
    <!-- Always render a native button; forward all attrs (class/style/events merge) -->
    <button :type="type" :disabled="disabled" :class="cls" v-bind="$attrs">
        <slot/>
    </button>
</template>
