<template>
    <Dialog
        v-model:visible="props.visible"
        modal
        @update:visible="$emit('closeModal')"
        header="Detalle Del Pago"
        :style="{ width: '36rem' }"
    >
        <div class="flex flex-col gap-4">
            <div>
                <p class="text-gray-700 dark:text-gray-300 text-lg">Información del Miembro</p>
                <div class="mt-3 grid grid-cols-2">
                    <p class="sub-header">DNI</p>
                    <p class="sub-header">Nombre</p>
                    <p class="main-info">
                        {{ paymentData.expand.id_miembro.dni }}
                    </p>
                    <p class="main-info">
                        {{ paymentData.expand.id_miembro.nombre }}
                    </p>
                </div>
            </div>
            <div class="flex flex-col gap-4 mt-3">
                <div>
                    <p class="text-gray-700 dark:text-gray-300 text-lg">Detalles del Pago</p>
                    <div class="my-3 flex gap-3 flex-col">
                        <div class="grid grid-cols-2">
                            <p class="sub-header">Fecha</p>
                            <p class="sub-header">Plan</p>
                            <p class="main-info">
                                {{ dayjs(paymentData.fecha_pago).format('DD/MM/YYYY') }}
                            </p>
                            <p class="col-span-1 font-bold text-[15px]">
                                {{
                                    `${paymentData.expand.id_plan_plazo.expand.id_plan.nombre} ${paymentData.expand.id_plan_plazo.duracion} ${paymentData.expand.id_plan_plazo.duracion > 1 ? 'meses' : 'mes'}`
                                }}
                            </p>
                        </div>
                        <div class="grid grid-cols-2">
                            <p class="sub-header">Método de Pago</p>
                            <p class="sub-header">Vencimiento</p>
                            <p class="main-info">
                                {{ paymentData.medio_pago }}
                            </p>
                            <p class="main-info">
                                {{ dayjs(paymentData.fecha_vencimiento).format('DD/MM/YYYY') }}
                            </p>
                        </div>
                        <div>
                            <p class="sub-header">Monto Total</p>
                            <p class="font-bold text-2xl">
                                {{ formatCurrency(paymentData.monto_total) }}
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
import formatCurrency from '@/utils/formatCurrency';
import dayjs from 'dayjs/esm';
import { defineProps } from 'vue';

const props = defineProps({
    visible: Boolean,
    paymentData: Object
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
