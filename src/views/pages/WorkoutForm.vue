<template>
    <div class="flex gap-4">
        <div class="card grow h-fit">
            <h1 class="text-3xl font-bold flex items-center gap-1">
                <Button
                    icon="pi pi-arrow-left"
                    variant="text"
                    rounded
                    as="router-link"
                    to="/admin/entrenamientos"
                    class="!text-white text-6xl"
                    size="large"
                />
                Agregar Plan de Entrenamiento
            </h1>
            <div class="mt-8 flex flex-col gap-4">
                <div class="grid grid-cols-12 gap-4">
                    <div class="flex flex-col gap-1 col-span-9">
                        <label for="nombre">Nombre del Plan</label>
                        <InputText
                            id="nombre"
                            name="nombre"
                            placeholder="Ej: Torso Pierna"
                            fluid
                            autocomplete="off"
                        />
                    </div>
                    <div class="flex flex-col gap-1 col-span-3">
                        <label for="duracion">Duración</label>
                        <Select
                            id="duracion"
                            :options="weeks"
                            optionLabel="label"
                            placeholder="Selecciona la duración"
                        />
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <label for="descripcion">Descripción</label>
                    <Textarea
                        placeholder="Ej: Rutina de Torso y Pierna de 4 días"
                        style="resize: none"
                        id="descripcion"
                        class="mb-1"
                        rows="5"
                    />
                </div>
                <div class="flex justify-between items-center mt-6">
                    <h3 class="text-2xl">Rutinas</h3>
                    <Button
                        icon="pi pi-plus"
                        label="Agregar Rutina"
                        as="router-link"
                        to="/admin/rutinas/agregar-rutina"
                        severity="secondary"
                    />
                </div>
                <DataTable :value="routines">
                    <template #empty> No hay Rutinas </template>
                    <Column field="nombre" class="w-1/5" header="Nombre"> </Column>
                    <Column header="Ejercicios" class="w-3/5">
                        <template #body="{ data }">
                            <div v-for="ejercicio in data.ejercicios">
                                <span>
                                    {{ ejercicio }}
                                </span>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <div class="card w-[400px] h-[90vh] overflow-y-scroll overflow-x-hidden">
            <h2 class="text-2xl font-bold">Resumen</h2>
            <Divider class="!mt-6 !mb-10 !w-[400px] !-ml-8" />
            <div class="flex justify-between text-lg">
                <p class="text-muted-color font-light">Cantidad de Ejercicios</p>
                <span class="font-semibold">0</span>
            </div>
            <Divider />
            <div class="flex justify-between text-lg mb-12">
                <p class="text-muted-color font-light">Cantidad de Series</p>
                <span class="font-semibold">0</span>
            </div>
            <span class="font-normal text-lg">Distribución Por Músculo</span>
            <ManMuscles />
            <span class="font-normal text-lg">Cantidad de Series Por Músculo</span>
            <DataTable class="mt-4" :loading="loadingMuscles" :value="muscles" size="large">
                <Column field="nombre" header="Músculo"> </Column>
                <Column class="max-w-2" header="Series">
                    <template #body="{ data }">
                        <p class="text-center">0</p>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
<script setup>
import ManMuscles from '@/components/workouts/ManMuscles.vue';
import pb from '@/service/pocketbase';
import { Divider } from 'primevue';
import { onMounted, ref } from 'vue';
const loadingMuscles = ref(false);
const muscles = ref([]);
const weeks = ref([]);
const routines = ref([
    {
        nombre: 'Torso A',
        ejercicios: [
            '3 x Press Banca (Barra)',
            '3 x Press Banca Inclinado (Mancuernas)',
            '4 x Extensiones de Triceps'
        ]
    },
    {
        nombre: 'Pierna A',
        ejercicios: [
            '3 x Sentadilla Hack',
            '2 x Extension de Cuadriceps',
            '2 x Extension de Gluteos'
        ]
    }
]);
onMounted(async () => {
    try {
        loadingMuscles.value = true;
        const result = await pb.collection('musculos').getFullList();
        muscles.value = result;
        for (let i = 1; i <= 52; i++) {
            weeks.value.push({ label: `${i} Semana${i === 1 ? '' : 's'} `, value: i });
        }
    } catch (error) {
        console.log(error);
    } finally {
        loadingMuscles.value = false;
    }
});
</script>
