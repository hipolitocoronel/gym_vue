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
                    <Tag
                        v-for="rutina in data.rutinas"
                        :key="rutina"
                        :value="rutina"
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
import { onMounted, ref } from 'vue';
const loading = ref(false);
const workouts = ref([]);
onMounted(async () => {
    try {
        loading.value = true;
        workouts.value = await pb.collection('planes_entrenamientos').getFullList();
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
});
</script>
