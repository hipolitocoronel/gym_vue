<template>
    <div class="card flex flex-col justify-center h-[367px]">
        <h1 class="mb-2 text-xl font-semibold">Planes Populares</h1>
        <Chart type="doughnut" :data="chartData" :options="chartOptions" class="mx-auto max-w-80" />
    </div>
</template>

<script setup>
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { onMounted, ref, watch } from 'vue';
const store = useIndexStore();
onMounted(async () => {
    chartOptions.value = setChartOptions();
});
const chartData = ref();
const chartOptions = ref();
const setChartData = async () => {
    const documentStyle = getComputedStyle(document.body);
    const records = await pb.collection('planes_populares').getList(1, 3, {
        fields: 'nombre, total_miembros',
        filter: 'id = "' + store.currentSucursal.id + '"'
    });

    const planNames = records.items.map((record) => record.nombre);

    const data = records.items.map((record) => record.total_miembros);
    chartData.value = {
        labels: planNames,
        datasets: [
            {
                label: 'Ingresos',
                data: data,
                borderWidth: 0,
                backgroundColor: [
                    documentStyle.getPropertyValue('--p-primary-500'),
                    documentStyle.getPropertyValue('--p-gray-700'),
                    documentStyle.getPropertyValue('--p-surface-400')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--p-blue-400'),
                    documentStyle.getPropertyValue('--p-gray-600'),
                    documentStyle.getPropertyValue('--p-surface-200')
                ]
            }
        ]
    };
};
watch(() => store.currentSucursal, setChartData, { immediate: true });
const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    return {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.formattedValue} miembros`;
                    }
                }
            },
            legend: {
                position: 'top',

                labels: {
                    usePointStyle: true,
                    color: '#ffffff'
                }
            }
        },

        cutout: '70%'
    };
};
</script>
