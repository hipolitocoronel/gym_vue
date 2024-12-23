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
        <Column field="medio_pago" header="Medio de pago"> </Column>
        <Column header="Fecha Pago"
            ><template #body="{ data }">
                {{ data.fecha_pago.split(' ')[0] }}
            </template>
        </Column>
        <Column header="Acciones" class="xl:max-w-20">
            <template #body="{ data }">
                <div class="flex gap-2 justify-center">
                    <Button
                        icon="pi pi-eye"
                        severity="secondary"
                        variant="outlined"
                        rounded
                        v-tooltip.top="'Ver Detalle'"
                        size="large"
                        @click="$emit('editMember', data)"
                    />
                </div>
            </template>
        </Column>
    </DataTable>
</template>
<script setup>
import { ref, defineProps, onMounted, defineExpose } from 'vue';
import { useToast } from 'primevue/usetoast';
import formatCurrency from '@/utils/formatCurrency';
import pb from '@/service/pocketbase.js';
const payments = ref([]);
const first = ref(0);
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10); // tamaño de la tabla
const toast = useToast();
onMounted(() => getPayments({ first: first.value, rows: rowsPerPage.value }));

const getPayments = async (event) => {
    try {
        // Parámetros de la consulta
        first.value = event.first;
        rowsPerPage.value = event.rows;
        loading.value = true;
        const search = event.search;
        const currentPage = Math.floor(first.value / rowsPerPage.value) + 1;
        const result = await pb.collection('pagos').getList(currentPage, rowsPerPage.value, {
            sort: '-fecha_pago',
            expand: 'id_plan_plazo, id_miembro, id_plan_plazo.id_plan'
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
