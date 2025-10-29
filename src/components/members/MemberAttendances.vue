<template>
    <div class="flex gap-4">
        <div class="border border-slate-400 rounded-md px-8 py-6 w-[500px]">
            <p>Estado del Miembro: Dentro del Gimnasio</p>
            <p class="text-muted-color mt-1">Entró hace 5 minutos</p>
            <p class="mt-4 mb-3">Info de la Asistencia</p>
            <div class="flex gap-4">
                <div
                    class="border border-slate-400 rounded-md p-2 flex flex-col items-center gap-2 grow"
                >
                    <i class="pi pi-clock text-primary-400 mt-1"></i>
                    <span class="text-muted-color">Hora de Entrada</span>
                    <span>17:30</span>
                </div>
                <div
                    class="border border-slate-400 rounded-md p-2 flex flex-col items-center gap-2 grow"
                >
                    <i class="pi pi-hourglass text-primary-400 mt-1"></i>
                    <span class="text-muted-color">Tiempo en el Gimnasio</span>
                    <span>55 min</span>
                </div>
            </div>
            <p
                class="text-center mt-4 p-3 rounded-md !bg-gray-50/20 text-muted-color font-semibold"
            >
                Tipo de Acceso: QR
            </p>
        </div>
        <div
            class="border border-slate-400 grow rounded-md flex items-center justify-center py-6 px-8 flex-col"
        >
            <div class="flex flex-col gap-2 justify-center items-center w-full">
                <i class="pi pi-sign-out !text-2xl text-primary-300"></i>
                <p class="font-semibold">Confirmar Salida?</p>
                <Divider />
            </div>
            <p>Quieres marcar la salida de {{ memberData?.nombre }} ?</p>
            <p class="text-muted-color font-semibold">
                Lleva <span class="text-primary-300">55 min</span> en el Gimnasio
            </p>
            <div class="space-x-4 mt-4">
                <Button severity="secondary" label="Cancelar" @click="cancelExit" />
                <Button label="Confirmar Salida" @click="confirmExit" />
            </div>
        </div>
    </div>
    <div class="flex gap-4 mt-4">
        <div class="border border-slate-400 rounded-md px-8 py-6 w-[60%]">
            <p class="mb-5">Asistencias Recientes</p>
            <div class="flex flex-col gap-2">
                <div
                    v-for="asistencia in asistencias"
                    :key="asistencia"
                    class="flex items-center justify-between gap-2 rounded-md py-3 px-4 bg-primary-50/20"
                >
                    <div class="flex gap-2 items-center">
                        <i class="pi pi-calendar"></i>
                        <span>{{ capitalize(dayjs(asistencia).format('MMM D')) }}</span>
                    </div>
                    <div class="text-end">
                        <p>
                            {{
                                dayjs(asistencia).format('h:mm A') +
                                ' - ' +
                                dayjs(asistencia).add(1, 'hour').format('h:mm A')
                            }}
                        </p>
                        <span class="text-primary-400 font-semibold">
                            {{
                                dayjs(asistencia).add(1, 'hour').diff(dayjs(asistencia), 'minutes')
                            }}
                            min
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="border border-slate-400 rounded-md grow p-8 flex flex-col gap-2">
            <div
                class="!bg-gray-50/20 rounded-md flex items-center grow justify-center flex-col gap-2 text-primary-300 font-semibold"
            >
                <i class="pi pi-calendar !text-3xl"></i>
                <p>Asistencias esta semana</p>
            </div>
            <div class="flex justify-between mt-2">
                <p>Días de Asistencia</p>
                <p>{{ asistencias.length }} / 7</p>
            </div>
            <div class="mt-2">
                <div class="flex gap-1.5">
                    <button
                        v-for="index in 7"
                        :key="index"
                        :class="[
                            'flex-1 h-2.5 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer',
                            index <= 4 ? 'bg-blue-500 shadow-sm' : 'bg-gray-200'
                        ]"
                    ></button>
                </div>
            </div>
            <p class="mt-2 text-end text-muted-color">
                Consistencia: <span class="text-white">Debajo del promedio</span>
            </p>
        </div>
    </div>
    <!--
    <div class="card">
        <DatePicker inline dateFormat="yy-mm-dd">
            <template #date="slotProps">
                <strong v-if="esDiaDeAsistencia(slotProps.date)" class="asistencia-highlight">
                    {{ slotProps.date.day }}
                </strong>
                <span v-else>
                    {{ slotProps.date.day }}
                </span>
            </template>
        </DatePicker>
    </div>
    -->
</template>
<script setup>
import dayjs from 'dayjs/esm';
import { capitalize, ref } from 'vue';

const props = defineProps({
    memberData: Object
});
const asistencias = ref(['2025-10-01', '2025-10-03', '2025-10-04', '2025-10-07']);

// Para optimizar, convertimos el array en un Set para búsquedas O(1)
const setAsistencias = new Set(asistencias.value);

const esDiaDeAsistencia = (date) => {
    // dayjs es genial para esto, pero para ser simple:
    // Los meses de JS son 0-indexados, así que sumamos 1
    const mes = (date.month + 1).toString().padStart(2, '0');
    const dia = date.day.toString().padStart(2, '0');
    const fechaFormateada = `${date.year}-${mes}-${dia}`;
    console.log(fechaFormateada);
    return setAsistencias.has(fechaFormateada);
};
</script>
<style>
.asistencia-highlight {
    @apply bg-primary-400 text-white rounded-full h-10 w-10 flex items-center justify-center;
}
.p-datepicker-day-view td {
    pointer-events: none;
}
</style>
