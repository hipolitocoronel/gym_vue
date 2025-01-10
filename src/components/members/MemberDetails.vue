<template>
    <Dialog
        v-model:visible="props.visible"
        modal
        @update:visible="$emit('closeModal')"
        header="Detalle Del Miembro"
        :style="{ width: '36rem' }"
    >
        <div class="flex flex-col gap-4">
            <div>
                <p class="text-gray-700 dark:text-gray-300 text-lg">Información Personal</p>
                <div class="mt-3 grid grid-cols-2">
                    <p class="sub-header">DNI</p>
                    <p class="sub-header">NOMBRE</p>
                    <p class="main-info">
                        {{ memberData.dni }}
                    </p>
                    <p class="main-info">
                        {{ memberData.nombre }}
                    </p>
                </div>
                <div class="mt-3 grid grid-cols-2">
                    <p class="sub-header">SEXO</p>
                    <p class="sub-header">DIRECCIÓN</p>
                    <p class="main-info">
                        {{ memberData.sexo }}
                    </p>
                    <p class="main-info">
                        {{ memberData.direccion ? memberData.direccion : '-' }}
                    </p>
                </div>
                <div class="mt-3 grid grid-cols-2">
                    <p class="sub-header">TELÉFONO</p>
                    <p class="sub-header">FECHA DE INSCRIPCIÓN</p>
                    <p class="main-info">
                        {{ memberData.telefono }}
                    </p>
                    <p class="main-info">
                        {{ dayjs(memberData.created).format('DD/MM/YYYY') }}
                    </p>
                </div>
            </div>
            <div class="flex flex-col gap-4 mt-3" v-if="memberData.fecha_pago">
                <div>
                    <p class="text-gray-700 dark:text-gray-300 text-lg">Detalles del Plan</p>
                    <div class="my-3 flex gap-3 flex-col">
                        <div class="grid grid-cols-2">
                            <p class="sub-header">PLAN</p>
                            <p class="sub-header">HORARIO DE ASISTENCIA</p>
                            <p class="main-info">
                                {{
                                    memberData.expand.id_plan_plazo.expand.id_plan.nombre +
                                    ' ' +
                                    memberData.expand.id_plan_plazo.duracion +
                                    ' ' +
                                    (memberData.expand.id_plan_plazo.duracion > 1 ? 'meses' : 'mes')
                                }}
                            </p>
                            <p class="col-span-1 font-bold text-[15px]">
                                {{
                                    memberData.horario
                                        ? dayjs(memberData.horario).format('HH:mm')
                                        : 'Libre'
                                }}
                            </p>
                        </div>
                        <div class="grid grid-cols-2">
                            <p class="sub-header">FECHA DE PAGO</p>
                            <p class="sub-header">VENCIMIENTO</p>
                            <p class="main-info">
                                {{ dayjs(memberData.fecha_pago).format('DD/MM/YYYY') }}
                            </p>
                            <p class="main-info">
                                {{ dayjs(memberData.fecha_vencimiento).format('DD/MM/YYYY') }}
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
const props = defineProps({
    visible: Boolean,
    memberData: Object
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
