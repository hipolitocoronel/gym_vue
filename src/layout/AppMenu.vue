<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Acciones',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Pagos', icon: 'pi pi-fw pi-dollar', to: '/pagos' },
            { label: 'Miembros', icon: 'pi pi-fw pi-user', to: '/miembros' },
            { label: 'Reportes', icon: 'pi pi-fw pi-chart-bar', to: '/reportes' },
            {
                label: 'Configuración',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'General',
                        to: '/configuracion'
                    },
                    {
                        label: 'Planes',
                        to: '/planes'
                    },

                    {
                        label: 'Usuarios',
                        to: '/usuarios'
                    }
                ]
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
