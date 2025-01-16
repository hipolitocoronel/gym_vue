<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Consultas</h1>
        <div class="flex justify-between mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    placeholder="Buscar por nombre o correo..."
                    @input="searchInquiries"
                    v-model="searchInput"
                    class="min-w-[350px]"
                />
            </IconField>
        </div>
        <DataTable
            :value="inquiries"
            paginator
            :rows="rowsPerPage"
            :lazy="true"
            :totalRecords="totalRecords"
            :first="first"
            :loading="loading"
            @page="getInquiries"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 30, 50]"
            currentPageReportTemplate="Mostrando {last} de {totalRecords} consultas"
        >
            <template #empty> Sin registros. </template>
            <Column header="Nombre" field="nombre"> </Column>
            <Column
                header="Fecha de Consulta"
                :field="(data) => dayjs(data.created).format('DD/MM/YYYY')"
            >
            </Column>
            <Column field="email" header="Correo"> </Column>
            <Column field="telefono" header="Telefono"> </Column>

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
                                inquiryDetails = data;
                                visible = true;
                            "
                            v-tooltip.top="'Ver Mensaje'"
                            size="large"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
        <InquiriesDetails :visible @closeModal="visible = false" :data="inquiryDetails" />
    </div>
</template>
<script setup>
import InquiriesDetails from '@/components/superadmin/InquiriesDetails.vue';
import pb from '@/service/pocketbase';
import { useDebounceFn } from '@vueuse/core';
import dayjs from 'dayjs/esm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
const inquiries = ref([]);
const first = ref(0);
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10); // tamaño de la tabla
const toast = useToast();
const searchInput = ref('');
const visible = ref(false);
const inquiryDetails = ref({});
onMounted(() => getInquiries({ first: first.value, rows: rowsPerPage.value }));

const searchInquiries = useDebounceFn(() => {
    getInquiries({ first: first.value, rows: rowsPerPage.value, search: searchInput.value });
}, 400);

const getInquiries = async (event) => {
    try {
        // Parámetros de la consulta
        first.value = event.first;
        rowsPerPage.value = event.rows ?? rowsPerPage.value;
        loading.value = true;
        const search = event.search;
        const currentPage = Math.floor(first.value / rowsPerPage.value) + 1;
        const result = await pb.collection('consultas').getList(currentPage, rowsPerPage.value, {
            sort: '-created',
            filter: `nombre~'${search ?? ''}' || email~'${search ?? ''}'`
        });
        totalRecords.value = result.totalItems;
        inquiries.value = result.items;
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
