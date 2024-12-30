<template>
    <div class="card">
        <div class="flex justify-between">
            <h1 class="text-xl mb-2 font-semibold">Flujo de ingresos</h1>
            <SelectButton
                v-model="period"
                class="-mt-2"
                :options="options"
                @update:modelValue="setChartData"
            />
        </div>

        <Chart type="line" :data="chartData" :options="chartOptions" class="h-[20rem]" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import pb from '@/service/pocketbase';
import 'chartjs-adapter-date-fns';
import dayjs from 'dayjs/esm';
import { es } from 'date-fns/locale';
const options = ref(['Semanal', 'Mensual']);
const period = ref('Semanal');
const chartData = ref({});
const chartOptions = ref({});
const unit = ref(null);
onMounted(() => {
    setChartData('Semanal');
    chartOptions.value = setChartOptions();
});
const setChartData = async (event) => {
    const dateFormat = 'YYYY-MM-DD';
    const filterDate = dayjs()
        .subtract(event === 'Semanal' ? 7 : 1, event === 'Semanal' ? 'day' : 'month')
        .format(dateFormat);

    const records = await pb.collection('ingresos_diarios').getFullList({
        fields: 'total_monto, probando',
        filter: `probando >= '${filterDate}'`
    });
    const dates = records.map((record) => dayjs(record.probando).format('YYYY-MM-DD'));
    const data = records.map((record) => record.total_monto);
    chartData.value = {
        labels: dates,
        datasets: [
            {
                label: 'Cobros',
                data: data,
                fill: false,
                backgroundColor: '#107acc',
                borderColor: '#107acc',
                tension: 0.4
            }
        ]
    };

    chartOptions.value.scales.x.time.unit = event === 'Semanal' ? 'day' : 'week';
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    return {
        maintainAspectRatio: false,

        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `Ingresos: $${tooltipItem.formattedValue.toLocaleString()}`;
                    }
                }
            },
            legend: {
                position: 'top',

                labels: {
                    usePointStyle: true,
                    color: '#FFFFFF',
                    backgroundColor: textColor
                }
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    tooltipFormat: 'MMM dd, yyyy',
                    unit: 'day'
                },
                adapters: {
                    date: {
                        locale: es
                    }
                },
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: false
                },
                beginAtZero: true
            }
        }
    };
};
</script>
