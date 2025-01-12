<script setup>
import { useLayout } from '@/layout/composables/layout';

import { onMounted } from 'vue';
import AppConfigurator from './layout/AppConfigurator.vue';
const { toggleDarkMode } = useLayout();

onMounted(() => {
    const darkModeStorage = localStorage.getItem('darkMode') === 'true';

    if (!darkModeStorage) toggleDarkMode();
});
</script>

<template>
    <div>
        <AppConfigurator />
        <Toast />
        <ConfirmDialog />
        <router-view />
    </div>
</template>

<style scoped></style>
