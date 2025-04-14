<template>
    <Dialog v-model:visible="visible" modal :header="workoutData?.nombre" class="w-[25rem]">
        <p>{{ workoutData.descripcion }}</p>
        <h2 class="text-xl font-bold">Rutinas</h2>
        <div class="space-y-2 mt-4">
            <div
                v-for="routine in routines"
                class="flex justify-between items-center bg-black p-4 rounded-xl"
            >
                <h3 class="text-lg">{{ routine?.nombre }}</h3>
                <Button label="Ver Rutina" severity="secondary" />
            </div>
        </div>
    </Dialog>
</template>

<script setup>
import pb from '@/service/pocketbase';
import { computed, defineEmits, defineProps, ref, watch } from 'vue';
const emit = defineEmits(['closeModal']);
const routines = ref([]);
const visible = computed({
    get: () => props.visible,
    set: (value) => emit('closeModal', value)
});

const props = defineProps({
    visible: Boolean,
    workoutData: {
        type: Object,
        default: []
    }
});
watch(
    () => props.workoutData,
    async () => {
        routines.value = [];
        try {
            const result = await pb.collection('rutinas').getFullList({
                sort: 'nombre',
                fields: 'id, nombre',
                filter: `plan_entrenamiento_id="${props.workoutData.id}"`
            });
            routines.value = result;
        } catch (error) {
            console.log(error);
        }
    }
);
</script>
