<template>
    <Dialog v-model:visible="visible" modal :header="exerciseData.nombre" class="w-[65rem]">
        <div class="flex gap-10">
            <div class="flex flex-col gap-4">
                <video
                    autoplay
                    loop
                    class="rounded-xl"
                    :src="getExerciseVideo(exerciseData)"
                ></video>
                <div class="flex flex-col gap-2">
                    <p class="text-gray-400 font-medium">
                        Músculo Principal:
                        <span class="text-white font-semibold">{{
                            exerciseData.expand.musculo_principal.nombre
                        }}</span>
                    </p>
                    <p class="text-gray-400 font-medium">
                        Músculos Secundarios:
                        <span class="text-white font-semibold">
                            {{
                                exerciseData.expand.musculos_secundarios
                                    .map((musculo) => musculo.nombre)
                                    .join(', ')
                            }}
                        </span>
                    </p>
                </div>
            </div>
            <div class="instrucciones mb-4 w-[130%]" v-html="exerciseData.instrucciones"></div>
        </div>
    </Dialog>
</template>

<script setup>
import { computed, defineEmits, defineProps } from 'vue';
const emit = defineEmits(['closeModal']);
const backend = import.meta.env.VITE_BACKEND_URL;

const getExerciseVideo = (exercise) => {
    return `${backend}/api/files/${exercise.collectionId}/${exercise.id}/${exercise.demostracion}`;
};
const visible = computed({
    get: () => props.visible,
    set: (value) => emit('closeModal', value)
});

const props = defineProps({
    visible: Boolean,
    exerciseData: {
        type: Object,
        default: []
    }
});
</script>
<style>
.instrucciones h3 {
    @apply text-2xl font-bold mb-2;
}

.instrucciones ul {
    @apply list-disc mx-8 space-y-2 mt-2;
}
.instrucciones p {
    @apply leading-7;
}
</style>
