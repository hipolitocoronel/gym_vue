<script setup>
import { useIndexStore } from '@/storage';
import { hasPermission } from '@/utils/hasPermission';
import { computed } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const store = useIndexStore();

const model = computed(() => {
    if (!store.userLogged?.expand?.role?.expand?.permisos) {
        return [];
    }
    return [
        {
            label: 'Acciones',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-home',
                    to: '/admin/dashboard'
                },
                {
                    label: 'Pagos',
                    icon: 'pi pi-fw pi-dollar',
                    to: '/admin/pagos',
                    visible: hasPermission('payments.index')
                },
                {
                    label: 'Miembros',
                    icon: 'pi pi-fw pi-user',
                    to: '/admin/miembros',
                    visible: hasPermission('members.index')
                },
                {
                    label: 'Reportes',
                    icon: 'pi pi-fw pi-chart-bar',
                    to: '/admin/reportes',
                    visible: hasPermission('reports.index')
                },
                {
                    label: 'Configuración',
                    icon: 'pi pi-fw pi-cog',
                    items: [
                        {
                            label: 'General',
                            to: '/admin/configuracion',
                            visible: hasPermission('settings.index')
                        },
                        {
                            label: 'Planes',
                            to: '/admin/planes',
                            visible: hasPermission('plan.index')
                        },
                        {
                            label: 'Usuarios',
                            to: '/admin/usuarios',
                            visible: hasPermission('users.index')
                        }
                    ]
                }
            ]
        }
    ];
});
</script>

<template>
    <div>
        <ul class="layout-menu">
            <template v-for="(item, i) in model" :key="i">
                <app-menu-item :item="item" :index="i">
                    {{ item }}
                </app-menu-item>
            </template>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.my-4 {
    margin: 1rem 0;
}
</style>
