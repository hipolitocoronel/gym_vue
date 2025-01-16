<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Pagos</h1>
        <div class="flex justify-between mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    placeholder="Buscar por nombre..."
                    @input="searchPayments"
                    v-model="searchInput"
                    class="min-w-[350px]"
                />
            </IconField>
        </div>
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
            currentPageReportTemplate="Mostrando {last} de {totalRecords} gimnasios"
        >
            <template #empty> Sin registros. </template>
            <Column header="Gimnasio">
                <template #body="{ data }">
                    <div class="flex gap-4 items-center">
                        <Avatar
                            shape="circle"
                            :label="data?.expand.gimnasio_id.nombre?.substring(0, 1)"
                            v-if="!data?.expand.gimnasio_id.logo"
                        />
                        <Avatar
                            shape="circle"
                            :image="getGymLogoUrl(data.expand.gimnasio_id)"
                            v-else
                            class="w-10"
                            alt=""
                        />
                        {{ data.expand.gimnasio_id.nombre }}
                    </div>
                </template>
            </Column>

            <Column header="Servicio">
                <template #body="{ data }">
                    <Tag :value="data.expand.servicio_id.nombre" severity="info" />
                </template>
            </Column>
            <Column
                :field="(data) => dayjs(data.payment_date).format('DD/MM/YYYY')"
                header="Fecha de Pago"
            >
            </Column>

            <Column :field="(data) => formatCurrency(data.monto_cobrado)" header="Monto Cobrado">
            </Column>
            <Column :field="(data) => formatCurrency(data.monto_recibido)" header="Monto Recibido">
            </Column>
            <Column class="xl:max-w-28">
                <template #header> <p class="mx-auto font-semibold">Acciones</p> </template>
                <template #body="{ data }">
                    <div class="justify-center flex">
                        <Button
                            icon="pi pi-eye"
                            severity="secondary"
                            variant="outlined"
                            rounded
                            v-tooltip.top="'Ver Gimnasio'"
                            size="large"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
<script setup>
import pb from '@/service/pocketbase';
import formatCurrency from '@/utils/formatCurrency';
import { useDebounceFn } from '@vueuse/core';
import dayjs from 'dayjs/esm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
const payments = ref([]);
const first = ref(0);
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10); // tamaño de la tabla
const toast = useToast();
const searchInput = ref('');

onMounted(() => getPayments({ first: first.value, rows: rowsPerPage.value }));

const searchPayments = useDebounceFn(() => {
    getPayments({ first: first.value, rows: rowsPerPage.value, search: searchInput.value });
}, 400);
const backend = import.meta.env.VITE_BACKEND_URL;

const getGymLogoUrl = (gym) => `${backend}/api/files/${gym.collectionId}/${gym.id}/${gym.logo}`;
const getPayments = async (event) => {
    try {
        // Parámetros de la consulta
        first.value = event.first;
        rowsPerPage.value = event.rows ?? rowsPerPage.value;
        loading.value = true;
        const search = event.search;
        const currentPage = Math.floor(first.value / rowsPerPage.value) + 1;
        const result = await pb
            .collection('servicios_pagos')
            .getList(currentPage, rowsPerPage.value, {
                sort: '-created',
                fields: '*, expand.gimnasio_id.nombre, expand.gimnasio_id.logo, expand.gimnasio_id.id, expand.gimnasio_id.collectionId ,  expand.servicio_id.nombre',
                filter: `gimnasio_id.nombre~'${search ?? ''}'`,
                expand: 'gimnasio_id, servicio_id'
            });
        totalRecords.value = result.totalItems;
        payments.value = result.items;
    } catch (error) {
        if (!error.message.includes('The request was autocancelled')) {
            toast.add({
                severity: 'error',
                summary: 'Operación fallida',
                detail: 'No se pudo obtener los gimnasios',
                life: 3000
            });
        }
    } finally {
        loading.value = false;
    }
};
</script>
