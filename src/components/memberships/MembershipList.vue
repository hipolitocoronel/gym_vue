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
        currentPageReportTemplate="Mostrando {last} de {totalRecords} membresías"
    >
        <template #empty> Sin registros. </template>
        <Column field="nombre" header="Nombre"> </Column>
        <Column header="Precio">
            <template #body="{ data }">
                {{ formatCurrency(data.precio) }}
            </template>
        </Column>
        <Column header="Acciones" class="xl:max-w-10 md:max-w-14">
            <template #body="{ data }">
                <div class="flex gap-2">
                    <Button
                        icon="pi pi-pencil"
                        severity="secondary"
                        variant="outlined"
                        rounded
                        v-tooltip.top="'Editar Membresía'"
                        size="large"
                        @click="$emit('editMembership', data)"
                    />
                    <Button
                        icon="pi pi-trash"
                        @click="$emit('deleteMembership', data)"
                        severity="danger"
                        variant="outlined"
                        rounded
                        v-tooltip.top="'Eliminar Membresía'"
                        size="large"
                    />
                </div>
            </template>
        </Column>
    </DataTable>
</template>
<script setup>
import { ref, defineProps, onMounted, defineExpose } from 'vue';
import { useToast } from 'primevue/usetoast';
import pb from '@/service/pocketbase.js';
const memberships = ref([]);
const first = ref(0);
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10); // tamaño de la tabla
const toast = useToast();
onMounted(() => getMemberships({ first: first.value, rows: rowsPerPage.value }));
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
const getMemberships = async (event) => {
    try {
        // Parámetros de la consulta
        first.value = event.first;
        rowsPerPage.value = event.rows;
        loading.value = true;
        const search = event.search;
        const filter = search ? `nombre ~ '${search}'` : '';
        const currentPage = Math.floor(first.value / rowsPerPage.value) + 1;
        const result = await pb.collection('membresias').getList(currentPage, rowsPerPage.value, {
            sort: 'nombre',
            filter: filter
        });
        totalRecords.value = result.totalItems;
        memberships.value = result.items;
    } catch (error) {
        if (!error.message.includes('The request was autocancelled')) {
            toast.add({
                severity: 'error',
                summary: 'Operación fallida',
                detail: 'No se pudo obtener las membresias',
                life: 3000
            });
        }
    } finally {
        loading.value = false;
    }
};
defineExpose({ getMemberships });
</script>
