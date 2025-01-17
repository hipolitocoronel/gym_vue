<template>
    <DataTable
        :value="memberships"
        paginator
        :rows="rowsPerPage"
        :lazy="true"
        :totalRecords="totalRecords"
        :first="first"
        :loading="loading"
        @page="getMemberships"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 30, 50]"
        currentPageReportTemplate="Mostrando {last} de {totalRecords} planes"
    >
        <template #empty> Sin registros. </template>
        <Column field="nombre" class="w-2/12" header="Nombre"> </Column>
        <Column header="Plazos" class="w-3/12">
            <template #body="{ data }">
                <div v-for="plazo in data.plazos">
                    <span>
                        {{ plazo.duracion + (plazo.duracion > 1 ? ' meses' : ' mes') }}
                    </span>
                </div>
            </template>
        </Column>
        <Column class="w-7/12">
            <template #body="{ data }">
                <div v-for="plazo in data.plazos">
                    <span> {{ formatCurrency(plazo.precio) }} </span>
                </div>
            </template>
        </Column>
        <Column header="Acciones" class="max-w-1/10">
            <template #body="{ data }">
                <div class="flex gap-2">
                    <Button
                        icon="pi pi-pencil"
                        severity="secondary"
                        variant="outlined"
                        rounded
                        v-tooltip.top="'Editar Plan'"
                        size="large"
                        as="router-link"
                        v-if="hasPermission('plan.update')"
                        :to="`/admin/planes/editar-plan/${data.id}`"
                    />
                    <Button
                        icon="pi pi-trash"
                        @click="$emit('deleteMembership', data)"
                        severity="danger"
                        variant="outlined"
                        rounded
                        v-if="hasPermission('plan.delete')"
                        v-tooltip.top="'Eliminar Plan'"
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
import { hasPermission } from '@/utils/hasPermission';
import { useToast } from 'primevue/usetoast';
import { defineExpose, onMounted, ref } from 'vue';
const memberships = ref([]);
const first = ref(0);
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10); // tamaño de la tabla
const toast = useToast();
const store = useIndexStore();
onMounted(() => getMemberships({ first: first.value, rows: rowsPerPage.value }));

const getMemberships = async (event) => {
    try {
        // Parámetros de la consulta
        first.value = event.first;
        rowsPerPage.value = event.rows ?? rowsPerPage.value;
        loading.value = true;
        const search = event.search;
        const currentPage = Math.floor(first.value / rowsPerPage.value) + 1;
        const result = await pb.collection('planes').getList(currentPage, rowsPerPage.value, {
            sort: '-created',
            filter: `(nombre~'${search ?? ''}') && deleted = null && sucursal_id = '${store.currentSucursal.id}'`,
            fields: 'id,nombre'
        });

        for (const plan of result.items) {
            const plazos = await pb.collection('planes_plazos').getFullList({
                filter: `id_plan = '${plan.id}' && deleted = null`
            });
            plan.plazos = plazos;
        }
        totalRecords.value = result.totalItems;
        memberships.value = result.items;
    } catch (error) {
        if (!error.message.includes('The request was autocancelled')) {
            toast.add({
                severity: 'error',
                summary: 'Operación fallida',
                detail: 'No se pudo obtener los planes',
                life: 3000
            });
        }
    } finally {
        loading.value = false;
    }
};
defineExpose({ getMemberships });
</script>
