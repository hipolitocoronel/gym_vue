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
        <Column header="Horario" v-if="storage?.currentGym?.gestionar_horarios" class="xl:max-w-20"
            ><template #body="{ data }">
                <Tag
                    :value="data.horario ? dayjs(data.horario).format('HH:mm') : 'Libre'"
                    :severity="data.horario ? 'warn' : 'info'"
                    v-if="data.fecha_pago"
                />
                <Tag value="Sin plan" severity="danger" v-else />
            </template>
        </Column>
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
        <Column class="xl:max-w-28">
            <template #header> <p class="mx-auto font-semibold">Acciones</p> </template>
            <template #body="{ data }">
                <div class="flex gap-2 justify-center">
                    <Button
                        icon="pi pi-eye"
                        severity="secondary"
                        variant="outlined"
                        rounded
                        v-tooltip.top="'Ver Miembro'"
                        size="large"
                        @click="$emit('watchMember', data)"
                    />
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
import pb from '@/service/pocketbase.js';
import { useIndexStore } from '@/storage';
import getMembershipStatus from '@/utils/getMembershipStatus';
import dayjs from 'dayjs/esm';
import { useToast } from 'primevue/usetoast';
import { defineExpose, onMounted, ref } from 'vue';
const storage = useIndexStore();
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
                sort: '-created',
                filter: `(nombre~'${search ?? ''}' || dni~'${search ?? ''}' || telefono~'${search ?? ''}') && deleted = null`,
                fields: '*, expand.id_plan_plazo.duracion, expand.id_plan_plazo.precio, expand.id_plan_plazo.expand.id_plan.nombre',
                expand: 'id_plan_plazo, id_plan_plazo.id_plan'
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
