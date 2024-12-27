<template>
    <div class="card">
        <h1 class="text-xl mb-2 font-semibold">Flujo de ingresos</h1>

        <Chart type="line" :data="chartData" :options="chartOptions" class="h-[25rem]" />
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
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Plan Basico',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                tension: 0.4,
                pointBackgroundColor: documentStyle.getPropertyValue('--p-cyan-500')
            },
            {
                label: 'Plan VIP',
                data: [21, 23, 34, 70, 100, 40, 20],
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-gray-500'),
                tension: 0.4,
                pointBackgroundColor: documentStyle.getPropertyValue('--p-gray-500')
            }
        ]
    };
};
const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');

    return {
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    color: textColor,
                    backgroundColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    display: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    display: false
                },
                beginAtZero: true
            }
        }
    };
};
</script>
