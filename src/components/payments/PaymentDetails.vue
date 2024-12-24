<template>
    <Dialog
        v-model:visible="props.visible"
        modal
        @update:visible="$emit('closeModal')"
        header="Detalle Del Pago"
        :style="{ width: '35rem' }"
    >
        <div class="flex flex-col gap-4">
            <span
                >Miembro:
                {{
                    paymentData.expand.id_miembro.dni + ' - ' + paymentData.expand.id_miembro.nombre
                }}
            </span>
            <span>Fecha: {{ dayjs(paymentData.fecha_pago).format('DD/MM/YYYY') }}</span>
            <span
                >Plan:
                {{
                    paymentData.expand.id_plan_plazo.expand.id_plan.nombre +
                    ' ' +
                    paymentData.expand.id_plan_plazo.duracion +
                    (paymentData.expand.id_plan_plazo.duracion > 1 ? ' meses' : ' mes')
                }}</span
            >
            <span>Medio de Pago: {{ paymentData.medio_pago }} </span>
            <span>Monto: {{ formatCurrency(paymentData.monto_total) }}</span>
            <Button severity="secondary" label="Cerrar" @click="$emit('closeModal')" />
        </div>
    </Dialog>
</template>
<script setup>
import dayjs from 'dayjs/esm';
import formatCurrency from '@/utils/formatCurrency';
import { ref, defineProps } from 'vue';
const props = defineProps({
    visible: Boolean,
    paymentData: Object
});
</script>
