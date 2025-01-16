<template>
    <Dialog
        v-model:visible="props.visible"
        modal
        @update:visible="$emit('closeModal')"
        header="Detalle de la Consulta"
        :style="{ width: '36rem' }"
    >
        <div class="flex flex-col gap-4">
            <div>
                <p class="text-gray-700 dark:text-gray-300 text-lg">Información Personal</p>
                <div class="mt-3 grid grid-cols-2">
                    <p class="sub-header">NOMBRE</p>
                    <p class="sub-header">TELEFONO</p>
                    <p class="main-info">{{ props.data.nombre }}</p>
                    <p class="main-info">{{ props.data.telefono }}</p>
                </div>
                <div class="mt-3 flex flex-col">
                    <p class="sub-header">CORREO</p>
                    <p class="main-info">{{ props.data.email }}</p>
                </div>
            </div>
            <div class="flex flex-col mt-3">
                <p class="text-gray-700 dark:text-gray-300 text-lg">Consulta</p>
                <p class="main-info">{{ props.data.mensaje }}</p>
            </div>

            <div class="flex justify-end">
                <Button
                    severity="secondary"
                    class="w-32"
                    label="Cerrar"
                    @click="$emit('closeModal')"
                />
            </div>
        </div>
    </Dialog>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    visible: Boolean,
    data: Object
});
</script>
<style scope>
.sub-header {
    @apply text-gray-400 col-span-1 font-light !text-sm;
}
.main-info {
    @apply col-span-1 font-bold text-[15px];
}
</style>
