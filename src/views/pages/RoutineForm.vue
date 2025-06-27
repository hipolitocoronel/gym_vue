<template>
    <div class="flex gap-8">
        <form class="card h-fit grow" @submit="onFormSubmit">
            <div class="flex items-center gap-1">
                <Button
                    icon="pi pi-arrow-left"
                    variant="text"
                    rounded
                    as="router-link"
                    :to="`/admin/entrenamientos/editar-entrenamiento/${idWorkout}`"
                    class="!text-white text-6xl"
                    size="large"
                />
                <h1 class="text-3xl font-bold">{{ isEditMode ? 'Editar' : 'Agregar' }} Rutina</h1>
            </div>
            <div class="mt-8 space-y-4" v-auto-animate>
                <div class="flex flex-col gap-1" v-auto-animate>
                    <label for="nombre">Nombre del Plan</label>
                    <InputText
                        id="nombre"
                        v-model="nombre"
                        placeholder="Ej: Torso A"
                        fluid
                        autocomplete="off"
                    />
                    <Message v-if="errors.nombre" severity="error" size="small" variant="simple">
                        {{ errors.nombre }}
                    </Message>
                </div>
                <div class="flex flex-col gap-1">
                    <label for="descripcion">Descripción</label>
                    <Textarea
                        placeholder="Agrega la descripción de la rutina"
                        style="resize: none"
                        id="descripcion"
                        v-model="descripcion"
                        class="mb-1"
                        rows="5"
                    />
                </div>

                <Container @drop="onDrop" drag-handle-selector=".column-drag-handle">
                    <Draggable v-for="(exercise, index) in ejerciciosRutina">
                        <div class="draggable-item mb-4">
                            <span
                                class="column-drag-handle cursor-pointer text-xl pl-2 p-1 border border-surface-500 rounded-ss-lg border-r-0 rounded-es-lg absolute -left-6 bg-white dark:bg-black border-b-0"
                                v-tooltip.top="'Arrastra para reordenar'"
                                >&#x2630;<span></span
                            ></span>
                            <div
                                class="bg-white dark:bg-black/90 flex flex-col gap-5 border p-5 border-surface-500 rounded-lg"
                            >
                                <div class="flex justify-between items-center mt-2">
                                    <div class="flex gap-4 items-center">
                                        <img
                                            :src="getExerciseImage(exercise.value)"
                                            alt=""
                                            class="w-[80px] h-[70px] rounded-xl object-cover"
                                        />
                                        <h3 class="text-lg font-semibold">
                                            {{ exercise.value.nombre }}
                                        </h3>
                                    </div>
                                    <Button
                                        severity="contrast"
                                        @click="togglePopover($event, exercise.value.id)"
                                        icon="pi pi-ellipsis-v"
                                        variant="text"
                                    />
                                    <Popover :ref="(el) => (popoverRefs[exercise.value.id] = el)">
                                        <div class="flex flex-col gap-4">
                                            <div class="flex flex-col">
                                                <Button
                                                    class="!bg-transparent !border-none !text-white hover:!bg-black/60"
                                                    label="Eliminar Ejercicio"
                                                    @click="removeExercise(exercise.value.id)"
                                                />
                                                <Button
                                                    class="!bg-transparent !border-none !text-white hover:!bg-black/60"
                                                    label="Ver Detalles"
                                                    @click="watchDetails($event, exercise.value)"
                                                />
                                            </div>
                                        </div>
                                    </Popover>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <label>Tiempo de Descanso</label>
                                    <Select
                                        :options="restTimes"
                                        v-model="ejerciciosRutina[index].value.descanso"
                                        :default-value="
                                            ejerciciosRutina[index].value.descanso
                                                ? ejerciciosRutina[index].value.descanso
                                                : 'Apagado'
                                        "
                                        placeholder="Selecciona el tiempo de descanso"
                                        fluid
                                    />
                                </div>
                                <div class="flex gap-4">
                                    <div class="flex flex-col gap-1 grow" v-auto-animate>
                                        <label>Series</label>
                                        <InputText
                                            type="number"
                                            v-model="ejerciciosRutina[index].value.series"
                                            placeholder="Ingrese la cantidad de series"
                                            fluid
                                        />
                                        <Message
                                            v-if="errors[`ejerciciosRutina[${index}].series`]"
                                            severity="error"
                                            size="small"
                                            variant="simple"
                                        >
                                            {{ errors[`ejerciciosRutina[${index}].series`] }}
                                        </Message>
                                    </div>

                                    <div class="flex flex-col gap-1 grow" v-auto-animate>
                                        <label>Repeticiones</label>
                                        <InputText
                                            v-model="ejerciciosRutina[index].value.repeticiones"
                                            placeholder="Ingrese la cantidad de repeticiones"
                                            fluid
                                        />
                                        <Message
                                            v-if="errors[`ejerciciosRutina[${index}].repeticiones`]"
                                            severity="error"
                                            size="small"
                                            variant="simple"
                                        >
                                            {{ errors[`ejerciciosRutina[${index}].repeticiones`] }}
                                        </Message>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Draggable>
                </Container>
            </div>
            <div class="flex justify-end gap-4 mt-2">
                <Button
                    :disabled="loading"
                    label="Cancelar"
                    as="router-link"
                    :to="`/admin/entrenamientos/editar-entrenamiento/${idWorkout}`"
                    severity="secondary"
                />
                <Button type="submit" :loading label="Guardar" />
            </div>
        </form>
        <div class="w-2/5 max-w-lg">
            <div class="fixed w-2/5 max-w-lg">
                <div class="card flex gap-2 justify-between relative">
                    <div class="space-y-4 mb-5">
                        <h2 class="text-xl font-bold mb-3">Resumen</h2>
                        <p class="text-muted-color">
                            Total de Ejercicios:
                            <span class="text-white font-semibold">{{
                                ejerciciosRutina.length
                            }}</span>
                        </p>
                        <p class="text-muted-color">
                            Total de Series:
                            <span class="text-white font-semibold">{{ totalSeries }}</span>
                        </p>
                    </div>
                    <ManMuscles
                        :routine="ejerciciosRutina"
                        class="!max-w-32 absolute right-14 -top-14"
                    />
                </div>
                <div class="card !pb-1 h-fit max-w-full">
                    <Select
                        :options="muscles"
                        optionLabel="nombre"
                        :loading="loadingMuscles"
                        v-model="selectedMuscle"
                        @update:model-value="fetchExercises"
                        placeholder="Selecciona un músculo"
                        fluid
                        showClear
                    />

                    <IconField class="mt-4">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText
                            v-model="inputSearch"
                            @input="searchExercises"
                            placeholder="Buscar por ejercicio..."
                            fluid
                        />
                    </IconField>
                    <Divider class="!mt-6 !mb-0 !w-full" />
                    <ProgressSpinner
                        style="width: 80px; height: 80px"
                        strokeWidth="4"
                        class="!my-8 !justify-center !flex"
                        fill="transparent"
                        v-if="loadingExercises"
                    />
                    <ul
                        class="mt-8 max-h-[48vh] grow overflow-y-auto mb-6 informacion card-resumen"
                        v-else
                    >
                        <li
                            v-for="exercise in exercises"
                            class="mb-5 flex gap-4 items-center"
                            :key="exercise.id"
                        >
                            <Button
                                severity="secondary"
                                class="min-h-[36px] min-w-[36px]"
                                @click="addExercise(exercise)"
                                v-tooltip.top="'Agregar ejercicio'"
                                rounded
                                icon="pi pi-plus"
                            />

                            <img
                                :src="getExerciseImage(exercise)"
                                alt=""
                                class="w-[70px] rounded-xl"
                            />
                            <div class="flex flex-col">
                                <span class="xl:text-[14px] text-[12px]">{{
                                    exercise.nombre
                                }}</span>
                                <span class="text-muted-color text-sm">{{
                                    exercise.expand.musculo_principal?.nombre
                                }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <ExerciseInfo
        :visible="modalDetailsVisible"
        :exerciseData
        @closeModal="modalDetailsVisible = false"
    />
</template>
<script setup>
import ExerciseInfo from '@/components/workouts/ExerciseInfo.vue';
import pb from '@/service/pocketbase';
import { toTypedSchema } from '@vee-validate/zod';
import { useDebounceFn } from '@vueuse/core';
import dayjs from 'dayjs/esm';
import { Button, useToast } from 'primevue';
import { useField, useFieldArray, useForm } from 'vee-validate';
import { computed, onMounted, ref, watch } from 'vue';
import { Container, Draggable } from 'vue-dndrop';
import { useRoute, useRouter } from 'vue-router';
import z from 'zod';
const muscles = ref([]);
const exercises = ref([]);
const inputSearch = ref('');
const loading = ref(false);
const exerciseData = ref({});
const toast = useToast();
const loadingMuscles = ref(false);
const backend = import.meta.env.VITE_BACKEND_URL;
const modalDetailsVisible = ref(false);
const route = useRoute();
const router = useRouter();
const selectedMuscle = ref(null);
const idWorkout = ref(null);
const loadingExercises = ref(false);
const isEditMode = computed(() => (route.params?.id ? true : false));
const restTimes = Array.from({ length: 21 }, (_, index) => {
    if (index === 0) return 'Apagado';
    const duration = index * 15;
    return dayjs().minute(0).second(duration).format('mm:ss');
});
const getExerciseImage = (exercise) => {
    return `${backend}/api/files/${exercise.collectionId}/${exercise.id}/${exercise.miniatura}`;
};
const onDrop = async (item) => {
    console.log(item);
    swap(item.removedIndex, item.addedIndex);
    await validateField('ejerciciosRutina');
};

const popoverRefs = ref([]);

const togglePopover = (event, exerciseId) => {
    if (popoverRefs.value[exerciseId]) {
        popoverRefs.value[exerciseId].toggle(event);
    }
};
const addExercise = async (exercise) => {
    if (!ejerciciosRutina.value.some((e) => e.value.id === exercise.id)) {
        push({ ...exercise, series: null, repeticiones: null, descanso: '' });
    }
};
const removedSeries = [];
const removeExercise = (exerciseId) => {
    const exercise = ejerciciosRutina.value.find((e) => e.value.id === exerciseId);
    if (isEditMode.value && exercise.value.id_serie) {
        removedSeries.push(exercise.value.id_serie);
    }
    remove(ejerciciosRutina.value.findIndex((e) => e.value.id === exerciseId));
    delete popoverRefs.value[exerciseId];
};

const watchDetails = (event, exercise) => {
    exerciseData.value = exercise;
    popoverRefs.value[exercise.id]?.toggle(event);
    modalDetailsVisible.value = true;
};

const totalSeries = computed(() => {
    if (!ejerciciosRutina?.value) return 0;
    return ejerciciosRutina.value.reduce((acc, e) => {
        if (e.value.series) acc += parseInt(e.value.series);
        return acc;
    }, 0);
});
//Validaciones
const validationSchema = toTypedSchema(
    z.object({
        nombre: z
            .string({ required_error: 'El nombre es obligatorio.' })
            .min(3, 'Debe tener al menos 3 caracteres')
            .max(50, 'No debe exceder 50 caracteres'),
        descripcion: z.string().optional(),
        ejerciciosRutina: z
            .array(
                z.object({
                    id_serie: z.string().optional(),
                    id: z.string(),
                    descanso: z.string().optional(),
                    series: z.coerce.number().min(1, { message: 'Las series son obligatorias.' }),
                    repeticiones: z
                        .string({
                            required_error: 'Las repeticiones son obligatorias',
                            invalid_type_error: 'Las repeticiones son obligatorias'
                        })
                        .nonempty('Las repeticiones son obligatorias')
                })
            )
            .optional()
    })
);

const { errors, handleSubmit, validateField } = useForm({
    validationSchema,
    initialValues: {
        nombre: '',
        descripcion: '',
        ejerciciosRutina: []
    }
});

const { value: nombre } = useField('nombre');
const { value: descripcion } = useField('descripcion');
const { fields: ejerciciosRutina, push, remove, swap } = useFieldArray('ejerciciosRutina');

const searchExercises = useDebounceFn(() => {
    fetchExercises();
}, 400);
const fetchExercises = async () => {
    try {
        loadingExercises.value = true;
        const result = await pb.collection('ejercicios').getFullList({
            sort: 'nombre',
            expand: 'musculo_principal, musculos_secundarios',
            fields: '*, expand.musculo_principal.nombre, expand.musculos_secundarios.nombre',
            filter: `musculo_principal ~ '${selectedMuscle.value?.id ?? ''}' &&  nombre ~ '${inputSearch.value ?? ''}'`
        });
        result.forEach((exercise) => {
            if (exercise.expand?.musculos_secundarios) {
                exercise.expand.musculos_secundarios.sort((a, b) =>
                    a.nombre.localeCompare(b.nombre)
                );
            }
        });
        exercises.value = result;
    } catch (error) {
        console.log(error);
    } finally {
        loadingExercises.value = false;
    }
};
//Obtiene los datos si esta en modo edicion
const fetchData = async () => {
    idWorkout.value = route.query?.workout;
    if (!isEditMode.value) return;
    try {
        loading.value = true;
        const result = await pb.collection('rutina_ejercicios').getFullList({
            filter: `rutina_id="${route.params.id}"`,
            sort: 'orden',
            fields: '*, expand.ejercicio_id.*, expand.rutina_id.*, expand.ejercicio_id.expand.musculo_principal.nombre, expand.ejercicio_id.expand.musculo_principal.id, expand.ejercicio_id.expand.musculos_secundarios.nombre, expand.ejercicio_id.expand.musculos_secundarios.id',
            expand: 'ejercicio_id, rutina_id, ejercicio_id.musculo_principal, ejercicio_id.musculos_secundarios'
        });
        nombre.value = result[0].expand.rutina_id.nombre;
        descripcion.value = result[0].expand.rutina_id.descripcion ?? null;
        idWorkout.value = result[0].expand.rutina_id.plan_entrenamiento_id;
        result.forEach((exercise) => {
            push({
                ...exercise.expand.ejercicio_id,
                id_serie: exercise.id,
                series: exercise.series,
                repeticiones: exercise.repeticiones,
                descanso: exercise.descanso
            });
        });
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};
const onFormSubmit = handleSubmit(async (values) => {
    if (ejerciciosRutina.value.length === 0) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida! ',
            detail: 'La rutina debe contener al menos un ejercicio.',
            life: 3000
        });
        return;
    }
    try {
        loading.value = true;
        const result = isEditMode.value
            ? await pb.collection('rutinas').update(route.params?.id, values)
            : await pb
                  .collection('rutinas')
                  .create({ ...values, plan_entrenamiento_id: idWorkout.value });
        const batch = pb.createBatch();
        values.ejerciciosRutina.forEach((exercise, index) => {
            const payload = {
                rutina_id: result.id,
                ejercicio_id: exercise.id,
                series: exercise.series,
                repeticiones: exercise.repeticiones,
                orden: index + 1,
                descanso: exercise.descanso === 'Apagado' ? null : exercise.descanso
            };
            if (!isEditMode.value || !exercise.id_serie) {
                batch.collection('rutina_ejercicios').create(payload);
            } else {
                batch.collection('rutina_ejercicios').update(exercise.id_serie, payload);
            }
        });
        removedSeries.forEach((serie) => {
            batch.collection('rutina_ejercicios').delete(serie);
        });

        await batch.send();
        router.push({ name: 'editar-entrenamiento', params: { id: idWorkout.value } });
        toast.add({
            severity: 'success',
            summary: 'Operación exitosa!',
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
watch(() => route.params?.id, fetchData, { immediate: true });
onMounted(async () => {
    try {
        loadingMuscles.value = true;
        const result = await pb
            .collection('musculos')
            .getFullList({ sort: 'nombre', fields: 'id, nombre' });
        muscles.value = result;
        await fetchExercises();
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
</script>
<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
.column-drag-handle span {
    @apply rounded !rounded-ee-none border-b border-surface-500 absolute h-full top-0 left-0 w-[21px];
}
</style>
