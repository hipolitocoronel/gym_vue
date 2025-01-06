<script setup>
import { computed } from 'vue';

const props = defineProps({
    value: Number,
    icon: String,
    activeStep: Number,
    a11yAttrs: Object
});

const getStepClasses = computed(() => [
    'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
    {
        'bg-primary text-primary-contrast border-primary': props.value <= props.activeStep,
        'border-surface-200 dark:border-surface-700': props.value > props.activeStep
    }
]);
</script>

<template>
    <div class="flex flex-row flex-auto gap-2 pl-2" v-bind="props.a11yAttrs.root">
        <button class="inline-flex flex-col gap-2 bg-transparent border-0">
            <span :class="getStepClasses">
                <i :class="props.icon" />
            </span>
        </button>
        <Divider v-if="props.value < 4" />
    </div>
</template>
