<template>
    <div class="col-span-12 xl:col-span-4">
        <div class="card rounded-2xl">
            <div class="flex justify-between">
                <div>
                    <span class="block text-muted-color font-semibold mb-5">Ingreso Mensual</span>
                    <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl">
                        {{ formatCurrency(stats.total_recaudado_semanal) }}
                    </div>
                </div>
                <div
                    class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border"
                    style="width: 2.5rem; height: 2.5rem"
                >
                    <i class="pi pi-dollar text-green-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium"> </span>
            <span class="text-muted-color"></span>
        </div>
    </div>
    <div class="col-span-12 xl:col-span-4">
        <div class="card">
            <div class="flex justify-between">
                <div>
                    <span class="block text-muted-color font-semibold mb-5">Pagos</span>
                    <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl">
                        {{ stats.total_pagos }}
                    </div>
                </div>
                <div
                    class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
                    style="width: 2.5rem; height: 2.5rem"
                >
                    <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-span-12 xl:col-span-4">
        <div class="card mb-0">
            <div class="flex justify-between">
                <div>
                    <span class="block text-muted-color font-semibold mb-5">Miembros</span>
                    <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl">
                        {{ stats.total_miembros }}
                    </div>
                </div>
                <div
                    class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border"
                    style="width: 2.5rem; height: 2.5rem"
                >
                    <i class="pi pi-users text-cyan-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium"></span>
            <span class="text-muted-color"> </span>
        </div>
    </div>
</template>
<script setup>
import pb from '@/service/pocketbase';
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import formatCurrency from '@/utils/formatCurrency';
const toast = useToast();
const stats = ref([]);
onMounted(async () => {
    try {
        const result = await pb.collection('dashboard').getFullList();
        stats.value = result[0];
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'Error al cargar los datos',
            life: 3000
        });
    }
});
</script>
