<template>
    <DataTable
        :value="payments"
        paginator
        :rows="rowsPerPage"
        :lazy="true"
        ref="dt"
        :totalRecords="totalRecords"
        :first="first"
        :loading="loading"
        @page="getPayments"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 30, 50]"
        currentPageReportTemplate="Mostrando {last} de {totalRecords} gimnasios"
    >
        <template #empty> Sin registros. </template>
        <Column field="expand.gimnasio_id.nombre" header="Gimnasio"> </Column>
        <Column field="estado" header="Estado">
            <template #body="{ data }">
                <Tag
                    :value="`${data.estado.charAt(0).toUpperCase()}${data.estado.slice(1)}`"
                    :severity="getPaymentStatus(data.estado)"
                />
            </template>
        </Column>
        <Column
            :field="(data) => dayjs(data.payment_date).format('DD/MM/YYYY')"
            header="Fecha de Pago"
        >
        </Column>
        <Column field="expand.servicio_id.nombre" header="Servicio">
            <template #body="{ data }">
                <span
                    :class="getTagColor(data.expand.servicio_id.color)"
                    class="text-sm font-semibold pt-[4px] pb-[5px] px-2 rounded-md"
                    >{{ data.expand.servicio_id.nombre }}</span
                >
            </template>
        </Column>

        <Column :field="(data) => formatCurrency(data.monto_cobrado)" header="Monto Cobrado">
        </Column>
        <Column :field="(data) => formatCurrency(data.monto_recibido)" header="Monto Recibido">
        </Column>
    </DataTable>
</template>
<script setup>
import pb from '@/service/pocketbase.js';
import formatCurrency from '@/utils/formatCurrency';
import getPaymentStatus from '@/utils/getPaymentStatus';
import getTagColor from '@/utils/getTagColor';
import dayjs from 'dayjs/esm';
import { useToast } from 'primevue/usetoast';
import { defineExpose, defineProps, nextTick, onMounted, ref } from 'vue';
const props = defineProps({
    startDate: String,
    endDate: String
});
const dt = ref();
const payments = ref([]);
const filters = ref(null);
const first = ref(0);
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10); // tamaño de la tabla
const toast = useToast();

const exportCSV = async () => {
    try {
        const result = await pb.collection('servicios_pagos').getFullList({
            sort: '-created',
            fields: '*, expand.gimnasio_id.nombre, expand.gimnasio_id.logo, expand.gimnasio_id.id, expand.gimnasio_id.collectionId ,  expand.servicio_id.nombre',
            filter: `(created > '${props.startDate}' && created < '${props.endDate}')  ${filters.value ? '&& ' + filters.value : ''}`,
            expand: 'gimnasio_id, servicio_id'
        });

        const csvContent = [
            [
                'Gimnasio',
                'Estado',
                'Fecha de Pago',
                'Servicio',
                'Monto Cobrado',
                'Monto Recibido'
            ].join(','),
            ...result.map((item) =>
                [
                    item.expand.gimnasio_id.nombre,
                    item.estado.charAt(0).toUpperCase() + item.estado.slice(1),
                    dayjs(item.created).format('DD/MM/YYYY'),
                    item.expand.servicio_id.nombre,
                    item.monto_cobrado,
                    item.monto_recibido
                ].join(',')
            )
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Reporte_pagos_${dayjs().format('DD-MM-YYYY')}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al exportar',
            life: 3000
        });
    }
};
onMounted(() => getPayments({ first: first.value, rows: rowsPerPage.value }));

const getPayments = async (event) => {
    await nextTick();
    try {
        // Parámetros de la consulta
        first.value = event.first;
        rowsPerPage.value = event.rows;
        loading.value = true;
        filters.value = event.filter;

        const currentPage = Math.floor(first.value / rowsPerPage.value) + 1;
        const result = await pb
            .collection('servicios_pagos')
            .getList(currentPage, rowsPerPage.value, {
                sort: '-created',
                fields: '*, expand.gimnasio_id.nombre, expand.gimnasio_id.logo, expand.gimnasio_id.id, expand.gimnasio_id.collectionId ,  expand.servicio_id.nombre, expand.servicio_id.color',
                filter: `(created > '${props.startDate}' && created < '${props.endDate}')  ${filters.value ? '&& ' + filters.value : ''}`,
                expand: 'gimnasio_id, servicio_id'
            });

        totalRecords.value = result.totalItems;
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

defineExpose({ getPayments, exportCSV });
</script>
