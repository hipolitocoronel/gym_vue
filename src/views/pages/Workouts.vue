<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Planes de Entrenamiento</h1>
        <div class="flex justify-between mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    @input="searchWorkouts"
                    v-model="searchInput"
                    placeholder="Buscar por nombre..."
                    class="min-w-[350px]"
                />
            </IconField>
            <Button
                severity="contrast"
                label="Agregar Plan de Entrenamiento"
                icon="pi pi-plus"
                as="router-link"
                to="entrenamientos/agregar-entrenamiento"
            />
        </div>
        <WorkoutList ref="workoutsRef" />
    </div>
</template>
<script setup>
import WorkoutList from '@/components/workouts/WorkoutList.vue';
import { useDebounceFn } from '@vueuse/core';
import { ref } from 'vue';
const searchInput = ref('');
const workoutsRef = ref(null);

const searchWorkouts = useDebounceFn(() => {
    workoutsRef.value.getWorkouts({ first: 0, rows: null, search: searchInput.value });
});
</script>
