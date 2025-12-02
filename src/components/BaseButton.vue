<script setup>
import {computed} from 'vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator: v => ['primary', 'success', 'danger'].includes(v),
    },
    type: {type: String, default: 'button'},
    disabled: {type: Boolean, default: false},
    unstyled: {type: Boolean, default: false},
})

const base = 'btn'

const variantClasses = {
    primary: 'btn-primary',
    success: 'btn-success',
    danger: 'btn-danger',
}

const cls = computed(() => props.unstyled ? '' : [base, variantClasses[props.variant] || ''])
</script>

<template>
    <button :type="type" :disabled="disabled" :class="cls" v-bind="$attrs">
        <slot/>
    </button>
</template>
