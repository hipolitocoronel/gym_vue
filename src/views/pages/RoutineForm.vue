<template>
    <div class="flex gap-8">
        <div class="card h-fit grow">
            <h1 class="text-3xl font-bold">Agregar Rutina</h1>
            <div class="mt-8 space-y-4" v-auto-animate>
                <div class="flex flex-col gap-1">
                    <label for="nombre">Nombre del Plan</label>
                    <InputText
                        id="nombre"
                        name="nombre"
                        placeholder="Ej: Torso A"
                        fluid
                        autocomplete="off"
                    />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="descripcion">Descripción</label>
                    <Textarea
                        placeholder="Agrega la descripción de la rutina"
                        style="resize: none"
                        id="descripcion"
                        class="mb-1"
                        rows="5"
                    />
                </div>

                <Container @drop="onDrop" drag-handle-selector=".column-drag-handle">
                    <Draggable v-for="(exercise, index) in routineExercises" :key="index">
                        <div class="draggable-item mb-4">
                            <span
                                class="column-drag-handle cursor-pointer text-xl pr-1 pl-2 border border-surface-500 rounded-ss-lg border-r-0 rounded-es-lg absolute -left-6 bg-white dark:bg-black border-b-0"
                                v-tooltip.top="'Arrastra para reordenar'"
                                >&#x2630;</span
                            >
                            <div
                                class="bg-white dark:bg-black/90 flex flex-col gap-5 border p-5 border-surface-500 rounded-lg"
                            >
                                <div class="flex justify-between items-center mt-2">
                                    <div class="flex gap-4 items-center">
                                        <img
                                            :src="getExerciseImage(exercise)"
                                            alt=""
                                            class="w-[80px] h-[70px] rounded-xl object-cover"
                                        />
                                        <h3 class="text-lg font-semibold">
                                            {{ exercise.nombre }}
                                        </h3>
                                    </div>
                                    <Button
                                        severity="contrast"
                                        @click="togglePopover($event, exercise.id)"
                                        icon="pi pi-ellipsis-v"
                                        variant="text"
                                    />
                                    <Popover :ref="(el) => (popoverRefs[exercise.id] = el)">
                                        <div class="flex flex-col gap-4">
                                            <div class="flex flex-col">
                                                <Button
                                                    class="!bg-transparent !border-none !text-white hover:!bg-black/60"
                                                    label="Eliminar Ejercicio"
                                                    @click="removeExercise(index)"
                                                />
                                                <Button
                                                    class="!bg-transparent !border-none !text-white hover:!bg-black/60"
                                                    label="Reemplazar Ejercicio"
                                                    @click="replaceExcercise(index)"
                                                />
                                            </div>
                                        </div>
                                    </Popover>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <label :for="'descanso' + index">Tiempo de Descanso</label>
                                    <DatePicker
                                        placeholder="Ingrese el tiempo de descanso"
                                        :id="'descanso' + index"
                                        timeOnly
                                        fluid
                                    />
                                </div>
                                <div class="flex gap-4">
                                    <div class="flex flex-col gap-1 grow">
                                        <label for="series">Series</label>
                                        <InputNumber
                                            id="series"
                                            name="series"
                                            placeholder="Ingrese la cantidad de series"
                                            fluid
                                            autocomplete="off"
                                        />
                                    </div>
                                    <div class="flex flex-col gap-1 grow">
                                        <label for="repeticiones">Repeticiones</label>
                                        <InputNumber
                                            id="repeticiones"
                                            name="repeticiones"
                                            placeholder="Ingrese la cantidad de repeticiones"
                                            fluid
                                            autocomplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Draggable>
                </Container>
            </div>
        </div>
        <div class="w-2/5 max-w-lg">
            <div class="card flex gap-2 justify-between relative">
                <div class="space-y-4 mb-5">
                    <h2 class="text-xl font-bold mb-3">Resumen</h2>
                    <p class="text-muted-color">
                        Total de Ejercicios:
                        <span class="text-white font-semibold">{{ routineExercises.length }}</span>
                    </p>
                    <p class="text-muted-color">
                        Total de Series: <span class="text-white font-semibold">0</span>
                    </p>
                </div>
                <ManMuscles
                    :routine="routineExercises"
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
                <ul class="mt-8 max-h-[48vh] grow overflow-y-auto mb-6" v-else>
                    <li
                        v-for="exercise in exercises"
                        class="mb-5 flex gap-4 items-center"
                        :key="exercise.id"
                    >
                        <Button
                            severity="secondary"
                            class="min-h-9 min-w-9 w-9"
                            @click="addExercise(exercise)"
                            v-tooltip.top="'Agregar ejercicio'"
                            rounded
                            icon="pi pi-plus"
                        />

                        <img :src="getExerciseImage(exercise)" alt="" class="w-[70px] rounded-xl" />
                        <div class="flex flex-col">
                            <span class="xl:text-[14px] text-[12px]">{{ exercise.nombre }}</span>
                            <span class="text-muted-color text-sm">{{
                                exercise.expand.musculo_principal?.nombre
                            }}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script setup>
import pb from '@/service/pocketbase';
import applyDrag from '@/utils/applyDrag';
import { useDebounceFn } from '@vueuse/core';
import { Button } from 'primevue';
import { onMounted, ref } from 'vue';
import { Container, Draggable } from 'vue-dndrop';
const muscles = ref([]);
const exercises = ref([]);
const inputSearch = ref('');
const loadingMuscles = ref(false);
const backend = import.meta.env.VITE_BACKEND_URL;
const routineExercises = ref([]);

const getExerciseImage = (exercise) => {
    return `${backend}/api/files/${exercise.collectionId}/${exercise.id}/${exercise.miniatura}`;
};
const onDrop = (item) => {
    routineExercises.value = applyDrag(routineExercises.value, item);
};
const selectedMuscle = ref(null);
const loadingExercises = ref(false);
const addExercise = (exercise) => {
    routineExercises.value.some((e) => e.id === exercise.id)
        ? null
        : routineExercises.value.push(exercise);
};
const popoverRefs = ref([]);

const togglePopover = (event, exerciseId) => {
    if (popoverRefs.value[exerciseId]) {
        popoverRefs.value[exerciseId].toggle(event);
    }
};

const removeExercise = (index) => {
    const exerciseId = routineExercises.value[index].id;
    console.log(exerciseId);
    routineExercises.value.splice(index, 1);
    delete popoverRefs.value[exerciseId];
};
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
        exercises.value = result;
    } catch (error) {
        console.log(error);
    } finally {
        loadingExercises.value = false;
    }
};
onMounted(async () => {
    try {
        loadingMuscles.value = true;
        const result = await pb.collection('musculos').getFullList({ sort: 'nombre' });
        muscles.value = result;
        fetchExercises();
    } catch (error) {
        console.log(error);
    } finally {
        loadingMuscles.value = false;
    }
});
</script>
