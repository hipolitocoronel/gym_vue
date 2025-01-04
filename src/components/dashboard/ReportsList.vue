<template>
    <DataTable
        :value="payments"
        paginator
        :rows="rowsPerPage"
        :lazy="true"
        :totalRecords="totalRecords"
        :first="first"
        :loading="loading"
        ref="dt"
        @page="getPayments"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 30, 50]"
        currentPageReportTemplate="Mostrando {last} de {totalRecords} pagos"
    >
        <template #empty> Sin registros. </template>
        <Column field="expand.id_miembro.nombre" header="Cliente"> </Column>
        <Column
            :field="(data) => dayjs(data.fecha_pago).format('DD/MM/YYYY')"
            header="Fecha De Pago"
        >
        </Column>
        <Column
            :field="
                (data) =>
                    data.expand.id_plan_plazo.expand.id_plan.nombre +
                    ' ' +
                    data.expand.id_plan_plazo.duracion +
                    (data.expand.id_plan_plazo.duracion > 1 ? ' meses' : ' mes')
            "
            header="Plan"
        >
        </Column>
        <Column :field="(data) => formatCurrency(data.monto_total)" header="Monto"> </Column>
        <Column field="medio_pago" header="Medio de pago">
            <template #body="{ data }"
                ><Tag
                    :severity="data.medio_pago == 'Efectivo' ? 'success' : 'primary'"
                    :value="data.medio_pago"
                >
                </Tag>
            </template>
        </Column>
    </DataTable>
</template>
<script setup>
import pb from '@/service/pocketbase.js';
import formatCurrency from '@/utils/formatCurrency';
import dayjs from 'dayjs/esm';
import { useToast } from 'primevue/usetoast';
import { defineExpose, defineProps, nextTick, onMounted, ref } from 'vue';
const props = defineProps({
    startDate: Date,
    endDate: Date
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
        const result = await pb.collection('pagos').getFullList({
            sort: '-fecha_pago',
            expand: 'id_plan_plazo, id_miembro, id_plan_plazo.id_plan',
            fields: 'fecha_pago,monto_total,medio_pago,expand.id_plan_plazo.duracion,expand.id_plan_plazo.expand.id_plan.nombre,expand.id_miembro.nombre',
            filter: `fecha_pago > '${dayjs(props.startDate).subtract(1, 'day').format('YYYY-MM-DD')}' && fecha_pago < '${dayjs(props.endDate).add(1, 'day').format('YYYY-MM-DD')}'  ${filters.value ? '&& ' + filters.value : ''}`
        });

        const csvContent = [
            ['Cliente', 'Fecha', 'Plan', 'Monto', 'Medio de Pago'].join(','),
            ...result.map((item) =>
                [
                    item.expand.id_miembro.nombre,
                    dayjs(item.fecha_pago).format('DD/MM/YYYY'),
                    item.expand.id_plan_plazo.expand.id_plan.nombre +
                        ' ' +
                        item.expand.id_plan_plazo.duracion +
                        ' ' +
                        (item.expand.id_plan_plazo.duracion > 1 ? 'meses' : 'mes'),
                    item.monto_total,
                    item.medio_pago
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
        const result = await pb.collection('pagos').getList(currentPage, rowsPerPage.value, {
            sort: '-fecha_pago',
            expand: 'id_plan_plazo, id_miembro, id_plan_plazo.id_plan',
            fields: 'fecha_pago,monto_total,medio_pago, fecha_vencimiento, expand.id_plan_plazo.duracion, expand.id_plan_plazo.precio, expand.id_plan_plazo.expand.id_plan.nombre, expand.id_miembro.nombre, expand.id_miembro.dni',
            filter: `fecha_pago > '${dayjs(props.startDate).subtract(1, 'day').format('YYYY-MM-DD')}' && fecha_pago < '${dayjs(props.endDate).add(1, 'day').format('YYYY-MM-DD')}'  ${filters.value ? '&& ' + filters.value : ''}`
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
