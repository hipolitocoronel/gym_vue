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
            <Form
                v-slot="$form"
                :initialValues
                :resolver
                @submit="onFormSubmit"
                class="mt-8 flex flex-col gap-4"
            >
                <div class="grid grid-cols-12 gap-4">
                    <div class="flex flex-col gap-1 col-span-7">
                        <label for="nombre">Nombre del Plan</label>
                        <InputText
                            id="nombre"
                            name="nombre"
                            placeholder="Ej: Torso Pierna"
                            fluid
                            autocomplete="off"
                        />
                        <Message
                            v-if="$form.nombre?.invalid"
                            severity="error"
                            size="small"
                            variant="simple"
                        >
                            {{ $form.nombre.error.message }}
                        </Message>
                    </div>
                    <div class="flex flex-col gap-1 col-span-5">
                        <label for="duracion">Duración</label>
                        <Select
                            :options="weeks"
                            optionLabel="label"
                            optionValue="value"
                            labelId="duracion"
                            name="duracion_semanas"
                            placeholder="Selecciona la duración"
                        />
                        <Message
                            v-if="$form.duracion_semanas?.invalid"
                            severity="error"
                            size="small"
                            variant="simple"
                        >
                            {{ $form.duracion_semanas.error.message }}
                        </Message>
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <label for="descripcion">Descripción</label>
                    <Textarea
                        placeholder="Ej: Rutina de Torso y Pierna de 4 días"
                        style="resize: none"
                        name="descripcion"
                        id="descripcion"
                        class="mb-1"
                        rows="5"
                        @blur="onFormSubmit"
                    />
                    <Message
                        v-if="$form.descripcion?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.descripcion.error.message }}
                    </Message>
                </div>
                <div class="flex justify-end">
                    <Button label="Guardar" :loading="loading" type="submit" severity="primary" />
                </div>
            </Form>
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
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Divider, useToast } from 'primevue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { z } from 'zod';
const loadingMuscles = ref(false);
const muscles = ref([]);
const weeks = ref([]);
const routines = ref([]);
const idWorkout = ref(null);
const loading = ref(false);
const totalExercises = ref(0);
const totalSeries = ref(0);
const loadingRoutines = ref(false);
const toast = useToast();
const route = useRoute();
const isEditMode = computed(() => (idWorkout.value != null || route.params?.id ? true : false));
const initialValues = ref({
    nombre: '',
    descripcion: '',
    duracion_semanas: null
});
const resolver = zodResolver(
    z.object({
        nombre: z
            .string()
            .nonempty({ message: 'El nombre es obligatorio.' })
            .min(5, { message: 'Debe tener al menos 5 caracteres' })
            .max(50, { message: 'No debe exceder 50 caracteres' }),
        descripcion: z.string().optional(),
        duracion_semanas: z.coerce
            .number()
            .min(1, { message: 'La duracion es obligatoria.' })
            .max(99999999, { message: 'No debe exceder 8 caracteres' })
    })
);
const onFormSubmit = async (e) => {
    if (!e.valid) return;
    try {
        console.log(e.values);
        loading.value = true;
        const result = isEditMode.value
            ? await pb.collection('planes_entrenamientos').update(idWorkout.value, e.values)
            : await pb.collection('planes_entrenamientos').create(e.values);
        idWorkout.value = result.id;
        toast.add({
            severity: 'success',
            summary: 'Operación exitosa! ',
            detail: 'Los cambios se guardaron correctamente.',
            life: 3000
        });
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};
//Obtiene los datos del plan si esta en modo edicion
const fetchData = async () => {
    if (!isEditMode.value) return;
    try {
        loadingRoutines.value = true;
        idWorkout.value = route.params?.id;
        await pb.collection('planes_entrenamientos').getOne(route.params?.id);
        routines.value = await pb.collection('rutinas').getFullList({
            filter: `plan_entrenamiento_id="${route.params.id}"`,
            fields: 'nombre, id'
        });
        for (const routine of routines.value) {
            routine.ejercicios = await pb.collection('rutina_ejercicios').getFullList({
                filter: `rutina_id="${routine.id}"`,
                expand: 'ejercicio_id',
                fields: 'series, expand.ejercicio_id.nombre, expand.ejercicio_id.musculo_principal, expand.ejercicio_id.musculos_secundarios'
            });
            totalExercises.value += routine.ejercicios.length;
        }
        muscles.value.forEach((muscle) => {
            routines.value.forEach((routine) => {
                const exercises = routine.ejercicios.filter(
                    (e) => e.expand.ejercicio_id.musculo_principal === muscle.id
                );
                muscle.series += exercises.reduce((a, b) => a + b.series, 0);
            });
            totalSeries.value += parseInt(muscle.series);
        });
    } catch (error) {
        console.log(error);
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
        console.log(error);
    } finally {
        loadingMuscles.value = false;
    }
});
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
