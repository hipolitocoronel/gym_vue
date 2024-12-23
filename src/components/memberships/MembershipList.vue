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
        currentPageReportTemplate="Mostrando {last} de {totalRecords} planes"
    >
        <template #empty> Sin registros. </template>
        <Column field="nombre" class="w-2/12" header="Nombre"> </Column>
        <Column header="Plazos" class="w-9/12">
            <template #body="{ data }">
                <div
                    :class="{ 'gap-[200px]': plazo.duracion == 1 }"
                    class="flex gap-52"
                    v-for="plazo in data.plazos"
                >
                    <span>
                        {{ plazo.duracion + (plazo.duracion > 1 ? ' meses' : ' mes') }}
                    </span>
                    <span>{{ formatCurrency(plazo.precio) }}</span>
                </div>
            </template>
        </Column>
        <Column header="Acciones" class="max-w-1/10">
            <template #body="{ data }">
                <div class="flex gap-2">
                    <Button
                        icon="pi pi-pencil"
                        severity="secondary"
                        variant="outlined"
                        rounded
                        v-tooltip.top="'Editar Plan'"
                        size="large"
                        as="router-link"
                        :to="`/planes/editar-plan/${data.id}`"
                    />
                    <Button
                        icon="pi pi-trash"
                        @click="$emit('deleteMembership', data)"
                        severity="danger"
                        variant="outlined"
                        rounded
                        v-tooltip.top="'Eliminar Plan'"
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
import formatCurrency from '@/utils/formatCurrency';
import pb from '@/service/pocketbase.js';
const memberships = ref([]);
const first = ref(0);
const loading = ref(false);
const totalRecords = ref(0);
const rowsPerPage = ref(10); // tamaño de la tabla
const toast = useToast();

onMounted(() => getMemberships({ first: first.value, rows: rowsPerPage.value }));

const getMemberships = async (event) => {
    try {
        // Parámetros de la consulta
        first.value = event.first;
        rowsPerPage.value = event.rows;
        loading.value = true;
        const search = event.search;
        const filter = search ? `nombre ~ '${search}'` : '';
        const currentPage = Math.floor(first.value / rowsPerPage.value) + 1;
        const result = await pb.collection('planes').getList(currentPage, rowsPerPage.value, {
            sort: 'nombre',
            filter: filter
        });

        for (const plan of result.items) {
            const plazos = await pb.collection('planes_plazos').getFullList({
                filter: `id_plan = '${plan.id}'`
            });
            plan.plazos = plazos;
        }

        totalRecords.value = result.totalItems;
        memberships.value = result.items;
    } catch (error) {
        if (!error.message.includes('The request was autocancelled')) {
            toast.add({
                severity: 'error',
                summary: 'Operación fallida',
                detail: 'No se pudo obtener los planes',
                life: 3000
            });
        }
    } finally {
        loading.value = false;
    }
};
defineExpose({ getMemberships });
</script>
