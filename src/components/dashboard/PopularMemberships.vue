<template>
    <div class="card flex flex-col justify-center">
        <h1 class="text-xl mb-2 font-semibold">Planes Populares</h1>
        <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full h-[20rem]" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import pb from '@/service/pocketbase';
const data = ref([]);
onMounted(async () => {
    chartOptions.value = setChartOptions();
    const documentStyle = getComputedStyle(document.body);
    const records = await pb.collection('planes_populares').getList(1, 3, {
        fields: 'nombre, total_miembros'
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
});
const chartData = ref();
const chartOptions = ref();

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    return {
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
