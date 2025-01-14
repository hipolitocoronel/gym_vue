<template>
    <div>
        <div class="flex justify-between mt-6">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    placeholder="Buscar por nombre..."
                    @input="searchRol"
                    v-model="searchInput"
                    class="min-w-[350px]"
                />
            </IconField>
            <Button
                label="Agregar"
                icon="pi pi-plus"
                severity="contrast"
                as="router-link"
                to="configuracion/agregar-rol"
            />
        </div>
        <DataTable
            :value="roles"
            paginator
            :rows="rowsPerPage"
            :lazy="true"
            :totalRecords="totalRecords"
            :first="first"
            class="mt-3"
            :loading="loading"
            @page="getRoles"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 30, 50]"
            currentPageReportTemplate="Mostrando {last} de {totalRecords} roles"
        >
            <template #empty> Sin registros. </template>
            <Column field="nombre" header="Nombre"> </Column>

            <Column class="max-w-16">
                <template #header> <p class="ml-auto font-semibold mr-4">Acciones</p> </template>
                <template #body="{ data }">
                    <div :class="{ 'p-5': data.id_gimnasio != store.currentGym.id }"></div>
                    <div
                        class="flex gap-3 justify-end"
                        v-if="data.id_gimnasio == store.currentGym.id"
                    >
                        <Button
                            icon="pi pi-pencil"
                            severity="secondary"
                            variant="outlined"
                            rounded
                            as="router-link"
                            :to="'configuracion/editar-rol/' + data.id"
                            v-tooltip.top="'Editar Rol'"
                            size="large"
                        />
                        <Button
                            icon="pi pi-trash"
                            @click="deleteRole(data)"
                            severity="danger"
                            variant="outlined"
                            rounded
                            v-tooltip.top="'Eliminar Rol'"
                            size="large"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
<script setup>
import pb from '@/service/pocketbase.js';
import { useIndexStore } from '@/storage';
import { useDebounceFn } from '@vueuse/core';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
const roles = ref([]);
const first = ref(0);
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10); // tamaño de la tabla
const toast = useToast();
const searchInput = ref('');
const store = useIndexStore();
onMounted(() => getRoles({ first: first.value, rows: rowsPerPage.value }));

const searchRol = useDebounceFn(() => {
    getRoles({ first: first.value, rows: rowsPerPage.value, search: searchInput.value });
});
const deleteRole = async (role) => {
    try {
        role.deleted = new Date();
        await pb.collection('roles').update(role.id, role);
        toast.add({
            severity: 'success',
            summary: 'Confirmado',
            detail: 'Rol eliminado',
            life: 3000
        });
        getRoles({ first: first.value, rows: rowsPerPage.value });
        searchInput.value = '';
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo eliminar el rol',
            life: 3000
        });
    }
};
const getRoles = async (event) => {
    try {
        // Parámetros de la consulta
        first.value = event.first;
        rowsPerPage.value = event.rows;
        loading.value = true;
        const search = event.search;
        const currentPage = Math.floor(first.value / rowsPerPage.value) + 1;
        const result = await pb.collection('roles').getList(currentPage, rowsPerPage.value, {
            sort: '-created',
            filter: `nombre~'${search ?? ''}' && (id_gimnasio = null || id_gimnasio = '${store.currentGym.id}') && deleted = null`
        });
        totalRecords.value = result.totalItems;
        roles.value = result.items;
    } catch (error) {
        if (!error.message.includes('The request was autocancelled')) {
            toast.add({
                severity: 'error',
                summary: 'Operación fallida',
                detail: 'No se pudo obtener los roles',
                life: 3000
            });
        }
    } finally {
        loading.value = false;
    }
};
</script>
