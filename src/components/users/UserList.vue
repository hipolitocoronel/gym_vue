<script setup>
import pb from '@/service/pocketbase';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
const toast = useToast();

const users = ref([]);
const first = ref(0); // corresponde al current page
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10); // tamaño de la tabla

onMounted(() => getUsuarios({ first: first.value, rows: rowsPerPage.value }));

const getUsuarios = async (event) => {
    try {
        // Parámetros de la consulta
        first.value = event.first;
        rowsPerPage.value = event.rows;

        loading.value = true;
        const result = await pb.collection('users').getList(first.value + 1, rowsPerPage.value);
        totalRecords.value = result.totalItems;
        users.value = result.items;
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo obtener los usuarios',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <DataTable
        :value="users"
        paginator
        :rows="rowsPerPage"
        :lazy="true"
        :totalRecords="totalRecords"
        :first="first"
        :loading="loading"
        @page="getUsuarios"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 30, 50]"
        currentPageReportTemplate="Mostrando {last} de {totalRecords} cuentas"
    >
        <template #empty> Sin registros. </template>
        <Column field="name" header="Nombre"></Column>
        <Column field="email" header="Correo"></Column>
        <Column field="phone" header="Teléfono">
            <template #body="slotProps">
                {{ slotProps.data.phone ? slotProps.data.phone : '-' }}
            </template>
        </Column>
        <Column header="Acciones">
            <template #body="{ data }">
                <div class="flex gap-2">
                    <Button
                        icon="pi pi-pencil"
                        severity="secondary"
                        variant="outlined"
                        rounded
                        size="large"
                    />
                    <Button
                        icon="pi pi-trash"
                        severity="danger"
                        variant="outlined"
                        rounded
                        size="large"
                    />
                </div>
            </template>
        </Column>
    </DataTable>
</template>
