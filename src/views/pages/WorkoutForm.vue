<template>
    <div class="flex gap-4">
        <div class="card grow h-fit" v-auto-animate>
            <div class="flex items-center gap-2">
                <Button
                    icon="pi pi-arrow-left"
                    variant="text"
                    rounded
                    as="router-link"
                    to="/admin/entrenamientos"
                    class="!text-white text-6xl"
                    size="large"
                />
                <h1 class="text-3xl font-bold">
                    {{ route.params?.id ? 'Editar' : 'Agregar' }} Plan de Entrenamiento
                </h1>
            </div>
            <form @submit="onFormSubmit" class="mt-8 flex flex-col gap-4">
                <div class="grid grid-cols-12 gap-4">
                    <div class="flex flex-col gap-1 col-span-7">
                        <label for="nombre">Nombre del Plan</label>
                        <InputText
                            id="nombre"
                            v-model="nombre"
                            placeholder="Ej: Torso Pierna"
                            fluid
                            autocomplete="off"
                        />
                        <Message
                            v-if="errors.nombre"
                            severity="error"
                            size="small"
                            variant="simple"
                        >
                            {{ errors.nombre }}
                        </Message>
                    </div>
                    <div class="flex flex-col gap-1 col-span-5">
                        <label for="duracion">Duración</label>
                        <Select
                            :options="weeks"
                            optionLabel="label"
                            optionValue="value"
                            labelId="duracion"
                            v-model="duracion_semanas"
                            placeholder="Selecciona la duración"
                        />
                        <Message
                            v-if="errors.duracion_semanas"
                            severity="error"
                            size="small"
                            variant="simple"
                        >
                            {{ errors.duracion_semanas }}
                        </Message>
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <label for="descripcion">Descripción</label>
                    <Textarea
                        placeholder="Ej: Rutina de Torso y Pierna de 4 días"
                        style="resize: none"
                        v-model="descripcion"
                        id="descripcion"
                        class="mb-1"
                        rows="5"
                        @blur="onFormSubmit"
                    />
                </div>
                <div class="flex justify-end">
                    <Button label="Guardar" :loading="loading" type="submit" severity="primary" />
                </div>
            </form>
            <div v-if="idWorkout">
                <div class="flex justify-between items-center mt-6">
                    <h3 class="text-2xl">Rutinas</h3>
                    <Button
                        icon="pi pi-plus"
                        label="Agregar Rutina"
                        as="router-link"
                        :to="`/admin/rutinas/agregar-rutina?workout=${idWorkout}`"
                        severity="secondary"
                    />
                </div>
                <DataTable :value="routines" size="large" :loading="loadingRoutines">
                    <template #empty> No hay Rutinas </template>
                    <Column class="w-1/5" field="nombre" header="Nombre"> </Column>
                    <Column header="Ejercicios" class="w-3/5">
                        <template #body="{ data }">
                            <div class="flex flex-col gap-1">
                                <div v-for="ejercicio in data.ejercicios">
                                    <span>{{ ejercicio.series }} x </span>
                                    <span> {{ ejercicio.expand.ejercicio_id.nombre }} </span>
                                </div>
                            </div>
                        </template>
                    </Column>
                    <Column>
                        <template #header> <p class="mx-auto font-semibold">Acciones</p> </template>
                        <template #body="{ data }">
                            <div class="flex gap-2 justify-center">
                                <Button
                                    icon="pi pi-pencil"
                                    severity="secondary"
                                    variant="outlined"
                                    rounded
                                    as="router-link"
                                    :to="`/admin/rutinas/editar-rutina/${data.id}`"
                                    v-tooltip.top="'Editar Rutina'"
                                    size="large"
                                />
                                <Button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    variant="outlined"
                                    rounded
                                    @click="deleteRoutine(data)"
                                    v-tooltip.top="'Eliminar Rutina'"
                                    size="large"
                                />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <div class="!w-[400px]">
            <div
                class="card !w-[400px] h-[85vh] fixed overflow-y-scroll overflow-x-hidden card-resumen"
            >
                <h2 class="text-2xl font-bold">Resumen</h2>
                <Divider class="!mt-6 !mb-6 !w-[400px] !-ml-8" />
                <div class="flex justify-between">
                    <p class="text-muted-color font-medium">Cantidad de Ejercicios</p>
                    <span class="font-semibold">{{ totalExercises }}</span>
                </div>
                <Divider />
                <div class="flex justify-between mb-12">
                    <p class="text-muted-color font-medium">Cantidad de Series</p>
                    <span class="font-semibold">{{ totalSeries }}</span>
                </div>
                <span class="font-medium text-lg">Distribución Por Músculo</span>
                <ManMuscles class="mt-2" :muscles />
                <span class="font-medium text-lg">Cantidad de Series Por Músculo</span>
                <DataTable class="mt-2" :loading="loadingMuscles" :value="muscles" size="large">
                    <Column field="nombre" header="Músculo"> </Column>
                    <Column class="max-w-2" header="Series">
                        <template #body="{ data }">
                            <p class="text-center">{{ data.series }}</p>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
<script setup>
import ManMuscles from '@/components/workouts/ManMuscles.vue';
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { toTypedSchema } from '@vee-validate/zod';
import { Divider, useConfirm, useToast } from 'primevue';
import { useField, useForm } from 'vee-validate';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { z } from 'zod';
const loadingMuscles = ref(false);
const store = useIndexStore();
const muscles = ref([]);
const weeks = ref([]);
const routines = ref([]);
const idWorkout = ref(null);
const loading = ref(false);
const confirm = useConfirm();
const loadingRoutines = ref(false);
const toast = useToast();
const route = useRoute();
const totalExercises = computed(() =>
    routines.value.reduce((acc, r) => acc + r?.ejercicios?.length, 0)
);
const totalSeries = computed(() => muscles.value.reduce((a, b) => a + b.series, 0));
const isEditMode = computed(() => !!(idWorkout.value || route.params?.id));

const validationSchema = toTypedSchema(
    z.object({
        nombre: z
            .string({ required_error: 'El nombre es obligatorio.' })
            .nonempty({ message: 'El nombre es obligatorio.' })
            .min(5, { message: 'Debe tener al menos 5 caracteres' })
            .max(50, { message: 'No debe exceder 50 caracteres' }),
        descripcion: z.string().optional(),
        duracion_semanas: z.coerce
            .number({ invalid_type_error: 'La duracion es obligatoria.' })
            .min(1, { message: 'La duracion es obligatoria.' })
            .max(99999999, { message: 'No debe exceder 8 caracteres' })
    })
);
const { handleSubmit, errors } = useForm({
    validationSchema
});

const { value: nombre } = useField('nombre');
const { value: descripcion } = useField('descripcion');
const { value: duracion_semanas } = useField('duracion_semanas');
const onFormSubmit = handleSubmit(async (values) => {
    try {
        loading.value = true;
        const result = isEditMode.value
            ? await pb.collection('planes_entrenamientos').update(idWorkout.value, values)
            : await pb
                  .collection('planes_entrenamientos')
                  .create({ ...values, sucursal_id: store?.currentSucursal.id });
        idWorkout.value = result.id;
        toast.add({
            severity: 'success',
            summary: 'Operación exitosa! ',
            detail: 'Los cambios se guardaron correctamente.',
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'Intentelo nuevamente',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
});
//Obtiene los datos del plan si esta en modo edicion
const fetchData = async () => {
    if (!isEditMode.value) return;
    try {
        loadingRoutines.value = true;
        idWorkout.value = route.params?.id;
        const workout = await pb.collection('planes_entrenamientos').getOne(idWorkout.value);
        descripcion.value = workout.descripcion;
        duracion_semanas.value = workout.duracion_semanas;
        nombre.value = workout.nombre;
        routines.value = await pb.collection('rutinas').getFullList({
            filter: `plan_entrenamiento_id="${route.params.id}"`,
            fields: 'nombre, id'
        });
        for (const routine of routines.value) {
            routine.ejercicios = await pb.collection('rutina_ejercicios').getFullList({
                filter: `rutina_id="${routine.id}"`,
                expand: 'ejercicio_id',
                sort: 'orden',
                fields: 'id, series, expand.ejercicio_id.nombre, expand.ejercicio_id.musculo_principal, expand.ejercicio_id.musculos_secundarios'
            });
        }
        updateMuscleSeries();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo obtener el plan',
            life: 3000
        });
    } finally {
        loadingRoutines.value = false;
    }
};

const updateMuscleSeries = () => {
    muscles.value = muscles.value.map((muscle) => ({
        ...muscle,
        series: routines.value
            .flatMap((routine) => routine.ejercicios)
            .filter((e) => e.expand.ejercicio_id.musculo_principal === muscle.id)
            .reduce((acc, e) => acc + e.series, 0)
    }));
};
onMounted(async () => {
    try {
        loadingMuscles.value = true;
        for (let i = 1; i <= 52; i++) {
            weeks.value.push({ label: `${i} Semana${i === 1 ? '' : 's'} `, value: i });
        }
        const result = await pb
            .collection('musculos')
            .getFullList({ sort: 'nombre', fields: 'id, nombre' });
        muscles.value = result.map((m) => ({ ...m, series: 0 }));
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo obtener los músculos',
            life: 3000
        });
    } finally {
        loadingMuscles.value = false;
    }
});

const deleteRoutine = async (data) => {
    console.log(data);
    confirm.require({
        message: `Seguro que quieres eliminar la rutina ${data.nombre} ?`,
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
                await pb.collection('rutinas').delete(data.id);
                const batch = pb.createBatch();
                for (const exercise of data.ejercicios) {
                    batch.collection('rutina_ejercicios').delete(exercise.id);
                }
                await batch.send();
                routines.value = routines.value.filter((r) => r.id !== data.id);
                toast.add({
                    severity: 'success',
                    summary: 'Confirmado',
                    detail: 'Rutina eliminada',
                    life: 3000
                });
                updateMuscleSeries();
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
watch(() => route.params?.id, fetchData, { immediate: true });
</script>

<style scoped>
.card-resumen::-webkit-scrollbar {
    width: 9px;
}
.card-resumen::-webkit-scrollbar-thumb {
    background: #7c7c7c;
}
.card-resumen::-webkit-scrollbar-track {
    background: #3a3a3a;
}
.card-resumen::-webkit-scrollbar-thumb,
.card-resumen::-webkit-scrollbar-track {
    border-radius: 4px;
    border-start-start-radius: 0;
    border-end-start-radius: 0;
}
</style>
