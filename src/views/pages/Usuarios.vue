<script setup>
import pb from '@/service/pocketbase';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
const toast = useToast();

const users = ref([]);
const first = ref(0); // corresponde al current page
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10);

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
    <div class="card">
        <h1 class="text-3xl font-bold">Usuarios</h1>
        <div class="flex justify-between mt-5 mb-2">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText placeholder="Buscar..." class="min-w-[350px]" />
            </IconField>

            <Button as="router-link" severity="contrast" to="/agregar-miembro">
                <i class="pi pi-plus"></i>
                <span>Nuevo usuario</span>
            </Button>
        </div>

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
            <Column field="name" header="Nombre"></Column>
            <Column field="email" header="Correo"></Column>
            <Column field="phone" header="Teléfono"></Column>
            <Column header="Acciones"></Column>
        </DataTable>
    </div>
</template>
