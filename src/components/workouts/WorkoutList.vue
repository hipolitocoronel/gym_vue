<template>
    <DataTable
        :value="workouts"
        paginator
        :rows="rowsPerPage"
        :lazy="true"
        :totalRecords="totalRecords"
        :first="first"
        :loading
        @page="getWorkouts"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 30, 50]"
        currentPageReportTemplate="Mostrando {last} de {totalRecords} planes de entrenamiento"
        size="large"
    >
        <template #empty> No hay Planes de Entrenamiento. </template>
        <Column field="nombre" header="Programa"></Column>
        <Column header="Rutinas">
            <template #body="{ data }">
                <Tag
                    v-for="rutina in data.expand['rutinas(plan_entrenamiento_id)']"
                    :value="rutina.nombre"
                    class="mr-2"
                />
            </template>
        </Column>
        <Column class="w-28">
            <template #header> <p class="mx-auto font-semibold">Acciones</p> </template>
            <template #body="{ data }">
                <div class="flex gap-2 justify-center">
                    <Button
                        icon="pi pi-pencil"
                        severity="secondary"
                        variant="outlined"
                        rounded
                        as="router-link"
                        :to="`/admin/entrenamientos/editar-entrenamiento/${data.id}`"
                        v-tooltip.top="'Editar Plan de Entrenamiento'"
                        size="large"
                    />
                    <Button
                        icon="pi pi-trash"
                        severity="danger"
                        variant="outlined"
                        rounded
                        @click="deleteWorkout(data)"
                        v-tooltip.top="'Eliminar Plan de Entrenamiento'"
                        size="large"
                    />
                </div>
            </template>
        </Column>
    </DataTable>
</template>

<script setup>
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { useConfirm } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
const confirm = useConfirm();
const toast = useToast();
const store = useIndexStore();
const workouts = ref([]);
const loading = ref(false);
const first = ref(0);
const totalRecords = ref(0);
const rowsPerPage = ref(10); // tamaño de la tabla
const getWorkouts = async (event) => {
    try {
        const search = event.search;
        const currentPage = Math.floor(first.value / rowsPerPage.value) + 1;
        first.value = event.first;
        rowsPerPage.value = event.rows ?? rowsPerPage.value;
        loading.value = true;
        const result = await pb
            .collection('planes_entrenamientos')
            .getList(currentPage, rowsPerPage.value, {
                filter: `sucursal_id = "${store?.currentSucursal.id}" && (nombre~'${search ?? ''}')`,
                fields: 'id, nombre, expand.rutinas(plan_entrenamiento_id).nombre',
                expand: 'rutinas(plan_entrenamiento_id)'
            });
        workouts.value = result.items;
        totalRecords.value = result.totalItems;
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo obtener los planes de entrenamiento',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
onMounted(() => getWorkouts({ first: first.value, rows: rowsPerPage.value }));
const deleteWorkout = (workout) => {
    confirm.require({
        message: `Seguro que quieres eliminar el plan ${workout.nombre}?`,
        header: 'Confirmar Eliminación',
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Eliminar',
            severity: 'danger'
        },
        accept: async () => {
            try {
                await pb.collection('planes_entrenamientos').delete(workout.id);
                if (workout.rutinas.length > 0) {
                    const routinesIds = workout.rutinas.map((r) => r.id);
                    const batch = pb.createBatch();
                    const series = await pb.collection('rutina_ejercicios').getFullList({
                        filter: `rutina_id ~ "${routinesIds.join(',')}"`,
                        fields: 'id'
                    });
                    for (const serie of series) {
                        batch.collection('rutina_ejercicios').delete(serie.id);
                    }
                    for (const routine of workout.rutinas) {
                        batch.collection('rutinas').delete(routine.id);
                    }
                    await batch.send();
                }
                toast.add({
                    severity: 'success',
                    summary: 'Confirmado',
                    detail: 'Plan de entrenamiento eliminado',
                    life: 3000
                });
                getWorkouts({ first: 0, rows: null });
            } catch (error) {
                console.log(error);
                toast.add({
                    severity: 'error',
                    summary: 'Operación fallida',
                    detail: 'Intentelo nuevamente',
                    life: 3000
                });
            }
        }
    });
};
defineExpose({ getWorkouts });
</script>
