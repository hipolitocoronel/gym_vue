<script setup>
import Infomation from '@/components/settings/Information.vue';
import { computed, ref } from 'vue';

const value = ref('tu-informacion');

const options = ref([
    { label: 'Tu información', value: 'tu-informacion' },
    { label: 'Roles', value: 'roles' }
]);

const tabs = {
    'tu-informacion': Infomation
};

// Computed para determinar el componente dinámico actual
const currentTab = computed(() => tabs[value.value]);
</script>

<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Configuración</h1>

        <SelectButton
            v-model="value"
            :options="options"
            optionLabel="label"
            optionValue="value"
            class="mt-2"
        />

        <div class="p-2 mt-2">
            <component :is="currentTab"></component>
        </div>
    </div>
</template>
