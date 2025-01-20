<template>
    <Dialog
        v-model:visible="props.visible"
        modal
        @update:visible="$emit('closeModal')"
        header="Detalle Del Gimnasio"
        :style="{ width: '36rem' }"
    >
        <div class="flex flex-col gap-4">
            <div>
                <p class="text-gray-700 dark:text-gray-300 text-lg">Información General</p>
                <div class="mt-3 grid grid-cols-2">
                    <p class="sub-header">NOMBRE</p>
                    <p class="sub-header">CORREO</p>
                    <p class="main-info">{{ props.gymData.nombre }}</p>
                    <p class="main-info">
                        {{ props.gymData?.correo ? props.gymData.correo : '-' }}
                    </p>
                </div>
                <div class="mt-3 grid grid-cols-2">
                    <p class="sub-header">TELÉFONO</p>
                    <p class="sub-header">FECHA DE REGISTRO</p>
                    <p class="main-info">{{ props.gymData.telefono }}</p>
                    <p class="main-info">{{ dayjs(props.gymData.created).format('DD/MM/YYYY') }}</p>
                </div>
            </div>
            <div class="flex flex-col gap-4 mt-3">
                <div>
                    <p class="text-gray-700 dark:text-gray-300 text-lg">Detalles del Plan</p>
                    <div class="my-3 flex gap-3 flex-col">
                        <div class="grid grid-cols-2">
                            <p class="sub-header">PLAN</p>
                            <p class="sub-header">FECHA DE PAGO</p>
                            <p class="main-info">{{ props.gymData.servicio }}</p>
                            <p class="main-info">
                                {{
                                    props.gymData.fecha_ultimo_pago
                                        ? dayjs(props.gymData.fecha_ultimo_pago).format(
                                              'DD/MM/YYYY'
                                          )
                                        : '-'
                                }}
                            </p>
                        </div>
                        <div class="grid grid-cols-2">
                            <p class="sub-header">ESTADO</p>
                            <p class="sub-header">VENCIMIENTO</p>
                            <p class="main-info">{{ getPlanValue(props.gymData) }}</p>
                            <p class="main-info">
                                {{
                                    props.gymData.vencimiento
                                        ? dayjs(props.gymData.vencimiento).format('DD/MM/YYYY')
                                        : '-'
                                }}
                            </p>
                        </div>
                    </div>
                </div>
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
import dayjs from 'dayjs/esm';
import { defineProps } from 'vue';
const getPlanValue = (data) => {
    if (!data.servicio) return 'No posee';
    if (data.servicio === 'Plan Gratuito') return 'Gratuito';
    return new Date(data.vencimiento) > new Date() ? 'Vigente' : 'Vencido';
};
const props = defineProps({
    visible: Boolean,
    gymData: Object
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
