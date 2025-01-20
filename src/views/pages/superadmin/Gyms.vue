<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Gimnasios</h1>
        <div class="flex justify-between mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    placeholder="Buscar por nombre o correo..."
                    @input="searchGyms"
                    v-model="searchInput"
                    class="min-w-[350px]"
                />
            </IconField>
        </div>
        <DataTable
            :value="gyms"
            paginator
            :rows="rowsPerPage"
            :lazy="true"
            :totalRecords="totalRecords"
            :first="first"
            :loading="loading"
            @page="getGyms"
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
                            :label="data?.nombre?.substring(0, 1)"
                            v-if="!data?.logo"
                        />
                        <Avatar
                            shape="circle"
                            :image="getGymLogoUrl(data)"
                            v-else
                            class="w-10"
                            alt=""
                        />
                        {{ data.nombre }}
                    </div>
                </template>
            </Column>
            <Column field="correo" header="Correo"> </Column>
            <Column header="Servicio">
                <template #body="{ data }">
                    <span
                        v-if="data.servicio"
                        :class="getTagColor(data.color_servicio)"
                        class="text-sm font-semibold pt-[4px] pb-[5px] px-2 rounded-md"
                        >{{ data.servicio }}</span
                    >
                    <!--Siempre va a tener un servicio asociado pero se agrega por las dudas-->
                    <Tag value="No posee" v-else severity="danger" />
                </template>
            </Column>
            <Column header="Estado del plan">
                <template #body="{ data }">
                    <Tag :value="getPlanValue(data)" :severity="getPlanSeverity(data)" />
                </template>
            </Column>
            <Column
                :field="
                    (data) =>
                        data?.vencimiento ? dayjs(data.vencimiento).format('DD/MM/YYYY') : '-'
                "
                header="Vencimiento"
            >
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
                            @click="
                                visible = true;
                                gymData = data;
                            "
                            v-tooltip.top="'Ver Gimnasio'"
                            size="large"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
        <GymDetails :visible @closeModal="visible = false" :gymData />
    </div>
</template>
<script setup>
import GymDetails from '@/components/superadmin/GymDetails.vue';
import pb from '@/service/pocketbase';
import getTagColor from '@/utils/getTagColor';
import { useDebounceFn } from '@vueuse/core';
import dayjs from 'dayjs/esm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
const gyms = ref([]);
const first = ref(0);
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10); // tamaño de la tabla
const toast = useToast();
const searchInput = ref('');
const backend = import.meta.env.VITE_BACKEND_URL;
//Indica visibilidad del detalle del gimnasio
const visible = ref(false);
const gymData = ref({});

const searchGyms = useDebounceFn(() => {
    getGyms({ first: first.value, rows: rowsPerPage.value, search: searchInput.value });
}, 400);

const getGymLogoUrl = (gym) => `${backend}/api/files/${gym.collectionId}/${gym.id}/${gym.logo}`;

const getPlanValue = (data) => {
    if (!data.servicio) return 'No posee';
    if (data.servicio === 'Plan Gratuito') return 'Gratuito';
    return new Date(data.vencimiento) > new Date() ? 'Vigente' : 'Vencido';
};
const getPlanSeverity = (gym) =>
    gym.servicio === 'Plan Gratuito' || new Date(gym.vencimiento) > new Date()
        ? 'success'
        : 'danger';

const getGyms = async (event) => {
    try {
        // Parámetros de la consulta
        first.value = event.first;
        rowsPerPage.value = event.rows ?? rowsPerPage.value;
        loading.value = true;
        const search = event.search;
        const currentPage = Math.floor(first.value / rowsPerPage.value) + 1;
        const result = await pb
            .collection('gimnasios_pagos')
            .getList(currentPage, rowsPerPage.value, {
                sort: '-created',
                filter: `nombre~'${search ?? ''}' || correo~'${search ?? ''}'`
            });
        totalRecords.value = result.totalItems;
        gyms.value = result.items;
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
onMounted(() => getGyms({ first: first.value, rows: rowsPerPage.value }));
</script>
