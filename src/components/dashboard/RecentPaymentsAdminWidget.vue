<template>
    <div class="card">
        <div class="flex justify-between">
            <h2 class="text-xl font-bold mb-3">Últimos Pagos</h2>
            <Button
                label="Ver Más"
                severity="secondary"
                as="router-link"
                to="/admin/pagos-gimnasios"
                size="small"
            />
        </div>

        <DataTable
            size="large"
            class="mb-4"
            :value="payments"
            :loading="loading"
            @page="getPayments"
        >
            <template #empty> Sin registros. </template>
            <Column header="Gimnasio">
                <template #body="{ data }">
                    {{ data.expand.gimnasio_id.nombre }}
                </template>
            </Column>
            <Column header="Fecha De Pago"
                ><template #body="{ data }">
                    {{ dayjs(data.fecha_pago).format('DD/MM/YYYY') }}
                </template>
            </Column>
            <Column header="Plan">
                <template #body="{ data }"> {{ data.expand.servicio_id.nombre }} </template>
            </Column>
            <Column header="Monto Cobrado">
                <template #body="{ data }">
                    {{ formatCurrency(data.monto_cobrado) }}
                </template>
            </Column>
            <Column header="Monto Recibido">
                <template #body="{ data }">
                    {{ formatCurrency(data.monto_recibido) }}
                </template>
            </Column>
        </DataTable>
    </div>
</template>
<script setup>
import pb from '@/service/pocketbase.js';
import formatCurrency from '@/utils/formatCurrency';
import dayjs from 'dayjs/esm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
const payments = ref([]);
const loading = ref(false);
const toast = useToast();

const getPayments = async () => {
    try {
        loading.value = true;
        const result = await pb.collection('servicios_pagos').getList(1, 5, {
            sort: '-created',
            expand: 'gimnasio_id, servicio_id'
        });
        payments.value = result.items;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo obtener los pagos',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
onMounted(() => getPayments());
</script>
