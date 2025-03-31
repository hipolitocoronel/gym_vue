<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Planes de Entrenamiento</h1>
        <div class="flex justify-between mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText placeholder="Buscar por nombre..." class="min-w-[350px]" />
            </IconField>
            <Button
                severity="contrast"
                label="Agregar Plan de Entrenamiento"
                icon="pi pi-plus"
                as="router-link"
                to="entrenamientos/agregar-entrenamiento"
            />
        </div>

        <DataTable :value="workouts" size="large" :loading>
            <Column field="nombre" header="Programa"></Column>
            <Column header="Rutinas">
                <template #body="{ data }">
                    <Tag v-for="rutina in data.rutinas" :value="rutina.nombre" class="mr-2" />
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
    </div>
</template>
<script setup>
import pb from '@/service/pocketbase';
import { useConfirm, useToast } from 'primevue';
import { onMounted, ref } from 'vue';
const confirm = useConfirm();
const toast = useToast();
const loading = ref(false);
const workouts = ref([]);

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
                    for (const routine of workout.rutinas) {
                        batch.collection('rutinas').delete(routine.id);
                    }
                    for (const serie of series) {
                        batch.collection('rutina_ejercicios').delete(serie.id);
                    }
                    await batch.send();
                }
                toast.add({
                    severity: 'success',
                    summary: 'Confirmado',
                    detail: 'Plan de entrenamiento eliminado',
                    life: 3000
                });
                fetchWorkouts();
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
const fetchWorkouts = async () => {
    try {
        loading.value = true;
        workouts.value = await pb.collection('planes_entrenamientos').getFullList({
            fields: 'id, nombre'
        });
        for (const workout of workouts.value) {
            workout.rutinas = await pb.collection('rutinas').getFullList({
                filter: `plan_entrenamiento_id = "${workout.id}"`,
                fields: 'id, nombre'
            });
        }
    } catch (error) {
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
onMounted(async () => fetchWorkouts());
</script>
