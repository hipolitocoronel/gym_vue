<template>
    <DataTable
        :value="payments"
        paginator
        :rows="rowsPerPage"
        :lazy="true"
        :totalRecords="totalRecords"
        :first="first"
        :loading="loading"
        @page="getPayments"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 30, 50]"
        currentPageReportTemplate="Mostrando {last} de {totalRecords} pagos"
    >
        <template #empty> Sin registros. </template>
        <Column header="Cliente">
            <template #body="{ data }">
                {{ data.expand.id_miembro.nombre }}
            </template>
        </Column>
        <Column header="Fecha De Pago"
            ><template #body="{ data }">
                {{ dayjs(data.fecha_pago).format('DD/MM/YYYY') }}
            </template>
        </Column>
        <Column header="Plan">
            <template #body="{ data }">
                {{
                    data.expand.id_plan_plazo.expand.id_plan.nombre +
                    ' ' +
                    data.expand.id_plan_plazo.duracion +
                    (data.expand.id_plan_plazo.duracion > 1 ? ' meses' : ' mes')
                }}
            </template>
        </Column>
        <Column header="Monto">
            <template #body="{ data }">
                {{ formatCurrency(data.monto_total) }}
            </template>
        </Column>
        <Column header="Medio de pago">
            <template #body="{ data }"
                ><Tag
                    :severity="data.medio_pago == 'Efectivo' ? 'success' : 'primary'"
                    :value="data.medio_pago"
                >
                </Tag>
            </template>
        </Column>
        <Column header="Acciones" class="xl:max-w-16">
            <template #body="{ data }">
                <div class="flex gap-2 justify-center">
                    <Button
                        icon="pi pi-eye"
                        severity="secondary"
                        variant="outlined"
                        rounded
                        @click="$emit('viewPayment', data)"
                        v-tooltip.top="'Ver Detalle'"
                        size="large"
                    />
                </div>
            </template>
        </Column>
    </DataTable>
</template>
<script setup>
import pb from '@/service/pocketbase.js';
import { useIndexStore } from '@/storage';
import formatCurrency from '@/utils/formatCurrency';
import dayjs from 'dayjs/esm';
import { useToast } from 'primevue/usetoast';
import { defineExpose, onMounted, ref } from 'vue';
const payments = ref([]);
const first = ref(0);
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10); // tamaño de la tabla
const toast = useToast();
const store = useIndexStore();
onMounted(() => getPayments({ first: first.value, rows: rowsPerPage.value }));

const getPayments = async (event) => {
    try {
        // Parámetros de la consulta
        first.value = event.first;
        rowsPerPage.value = event.rows;
        loading.value = true;
        const currentPage = Math.floor(first.value / rowsPerPage.value) + 1;
        const result = await pb.collection('pagos').getList(currentPage, rowsPerPage.value, {
            sort: '-fecha_pago',
            expand: 'id_plan_plazo, id_miembro, id_plan_plazo.id_plan',
            fields: 'fecha_pago,monto_total,medio_pago, fecha_vencimiento, expand.id_plan_plazo.duracion, expand.id_plan_plazo.precio, expand.id_plan_plazo.expand.id_plan.nombre, expand.id_miembro.nombre, expand.id_miembro.dni',
            filter: `id_miembro.nombre ~ '${event.search ?? ''}' && sucursal_id = '${store.currentSucursal.id}' `
        });

        totalRecords.value = result.totalItems;
        payments.value = result.items;
    } catch (error) {
        if (!error.message.includes('The request was autocancelled')) {
            toast.add({
                severity: 'error',
                summary: 'Operación fallida',
                detail: 'No se pudo obtener los pagos',
                life: 3000
            });
        }
    } finally {
        loading.value = false;
    }
};

defineExpose({ getPayments });
</script>
