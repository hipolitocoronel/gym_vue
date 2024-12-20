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
        <Column field="nombre" header="Nombre" style="min-width: 10rem"> </Column>
        <Column field="telefono" header="Telefono"> </Column>
        <Column field="sexo" header="Sexo"> </Column>
        <Column field="dni" header="Dni"> </Column>
        <Column field="membresia" header="Membresia">
            <template #body="{ data }">
                <Tag
                    :value="data.membresia ? 'Activa' : 'Vencida'"
                    :severity="data.membresia ? 'success' : 'danger'"
                />
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
                        @click="$emit('editMember', data)"
                    />
                    <Button
                        icon="pi pi-trash"
                        @click="$emit('deleteMember', data)"
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
<script setup>
import { ref, defineProps, onMounted, defineExpose } from 'vue';
import { useToast } from 'primevue/usetoast';
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
        const filter = search ? `nombre ~ '${search}'` : '';
        const currentPage = Math.floor(first.value / rowsPerPage.value) + 1;
        const result = await pb.collection('miembros').getList(currentPage, rowsPerPage.value, {
            sort: 'nombre',
            filter: filter
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
