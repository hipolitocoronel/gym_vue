<template>
    <div class="card flex flex-col justify-center">
        <h1 class="text-xl mb-2 font-semibold">Planes Populares</h1>
        <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
    const documentStyle = getComputedStyle(document.body);

    return {
        labels: ['Vigente', 'Vencido'],
        datasets: [
            {
                data: [540, 325],
                backgroundColor: [
                    documentStyle.getPropertyValue('--p-blue-500'),
                    documentStyle.getPropertyValue('--p-gray-700')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--p-cyan-400'),
                    documentStyle.getPropertyValue('--p-orange-400')
                ],
                borderWidth: 0
            }
        ]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    return {
        plugins: {
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
