<template>
    <DataTable
        :value="members"
        paginator
        :rows="rowsPerPage"
        :lazy="true"
        :totalRecords="totalRecords"
        :first="first"
        :loading="loading"
        @page="getMembers"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 30, 50]"
        currentPageReportTemplate="Mostrando {last} de {totalRecords} miembros"
    >
        <template #empty> Sin registros. </template>
        <Column field="dni" header="DNI"> </Column>
        <Column field="nombre" header="Nombre"> </Column>
        <Column field="telefono" header="Telefono"> </Column>
        <Column field="sexo" header="Sexo"> </Column>
        <Column header="Plan">
            <template #body="{ data }">
                <Tag
                    :value="getMembershipStatus(data) ? 'Vigente' : 'Vencido'"
                    :severity="getMembershipStatus(data) ? 'success' : 'danger'"
                />
            </template>
        </Column>
        <Column header="Acciones" class="xl:max-w-20">
            <template #body="{ data }">
                <div class="flex gap-2">
                    <Button
                        icon="pi pi-pencil"
                        severity="secondary"
                        variant="outlined"
                        rounded
                        v-tooltip.top="'Editar Miembro'"
                        size="large"
                        @click="$emit('editMember', data)"
                    />
                    <Button
                        icon="pi pi-trash"
                        @click="$emit('deleteMember', data)"
                        severity="danger"
                        variant="outlined"
                        rounded
                        v-tooltip.top="'Eliminar Miembro'"
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
import getMembershipStatus from '@/utils/getMembershipStatus';
import pb from '@/service/pocketbase.js';
const members = ref([]);
const first = ref(0);
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10); // tamaño de la tabla
const toast = useToast();
onMounted(() => getMembers({ first: first.value, rows: rowsPerPage.value }));

const getMembers = async (event) => {
    try {
        // Parámetros de la consulta
        first.value = event.first;
        rowsPerPage.value = event.rows;
        loading.value = true;
        const search = event.search;
        const currentPage = Math.floor(first.value / rowsPerPage.value) + 1;
        const result = await pb
            .collection('miembros_pagos')
            .getList(currentPage, rowsPerPage.value, {
                sort: 'nombre',
                filter: `nombre~'${search ?? ''}' || dni~'${search ?? ''}' || telefono~'${search ?? ''}'`
            });
        totalRecords.value = result.totalItems;
        members.value = result.items;
    } catch (error) {
        if (!error.message.includes('The request was autocancelled')) {
            toast.add({
                severity: 'error',
                summary: 'Operación fallida',
                detail: 'No se pudo obtener los miembros',
                life: 3000
            });
        }
    } finally {
        loading.value = false;
    }
};

defineExpose({ getMembers });
</script>
