<script setup>
import Infomation from '@/components/settings/Information.vue';
import Role from '@/components/settings/Role.vue';
import { useIndexStore } from '@/storage';
import { computed, onMounted, ref } from 'vue';
const store = useIndexStore();
const value = ref('');

const options = ref([
    { label: 'Tu información', value: 'tu-informacion' },
    { label: 'Roles', value: 'roles' }
]);

const tabs = {
    'tu-informacion': Infomation,
    roles: Role
};

// Computed para determinar el componente dinámico actual
const currentTab = computed(() => tabs[value.value]);

onMounted(() => {
    value.value = store.activeConfigTab;
});
</script>

<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Configuración</h1>
        <SelectButton
            v-model="value"
            :options="options"
            @update:modelValue="store.activeConfigTab = value"
            optionLabel="label"
            optionValue="value"
            class="mt-2"
        />

        <div class="p-2 mt-2">
            <component :is="currentTab"></component>
        </div>
    </div>
</template>
