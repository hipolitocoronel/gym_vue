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
                <p class="text-gray-700 dark:text-gray-300 text-lg">Información del Gimnasio</p>
                <div class="mt-3 grid grid-cols-2">
                    <p class="sub-header">NOMBRE</p>
                    <p class="sub-header">CORREO</p>
                    <p class="main-info">
                        {{ paymentData.expand.gimnasio_id.nombre }}
                    </p>
                    <p class="main-info">{{ paymentData.expand.gimnasio_id.correo }}</p>
                </div>
                <div class="mt-3 flex flex-col">
                    <p class="sub-header">TELEFONO</p>
                    <p class="main-info">
                        {{ paymentData.expand.gimnasio_id.telefono }}
                    </p>
                </div>
            </div>
            <div class="flex flex-col gap-4 mt-3">
                <div>
                    <p class="text-gray-700 dark:text-gray-300 text-lg">Detalles del Pago</p>
                    <div class="my-3 flex gap-3 flex-col">
                        <div class="grid grid-cols-2">
                            <p class="sub-header">FECHA</p>
                            <p class="sub-header">PLAN</p>
                            <p class="main-info">
                                {{ dayjs(paymentData.payment_date).format('DD/MM/YYYY') }}
                            </p>
                            <p class="main-info">{{ paymentData.expand.servicio_id.nombre }}</p>
                        </div>
                        <div class="grid grid-cols-2">
                            <p class="sub-header">ESTADO</p>
                            <p class="sub-header">VENCIMIENTO</p>
                            <p class="main-info">
                                {{
                                    paymentData.estado.charAt(0).toUpperCase() +
                                    paymentData.estado.slice(1)
                                }}
                            </p>
                            <p class="main-info">
                                {{ dayjs(paymentData.due_date).format('DD/MM/YYYY') }}
                            </p>
                        </div>
                        <div class="grid grid-cols-2">
                            <p class="sub-header">MONTO COBRADO</p>
                            <p class="sub-header">MONTO RECIBIDO</p>
                            <p class="main-info">
                                {{ formatCurrency(paymentData.monto_recibido) }}
                            </p>
                            <p class="font-bold text-2xl">
                                {{ formatCurrency(paymentData.monto_cobrado) }}
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
