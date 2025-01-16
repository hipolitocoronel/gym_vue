<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Reportes</h1>
        <div class="grid grid-cols-12 mt-4 gap-3">
            <div class="flex flex-col gap-2 col-span-4">
                <label>Estado</label>
                <Select
                    v-model="selectedStatus"
                    :options="statusOptions"
                    optionLabel="label"
                    fluid
                    showClear
                    optionValue="value"
                    :loading="loadingData"
                    placeholder="Selecciona estado de pago"
                />
            </div>
            <div class="flex flex-col gap-2 col-span-4">
                <label>Plan</label>
                <Select
                    v-model="selectedPlan"
                    :options="plans"
                    optionLabel="nombre"
                    fluid
                    showClear
                    :optionValue="(selectedPlan) => selectedPlan.id"
                    :loading="loadingData"
                    emptyMessage="No hay planes"
                    placeholder="Selecciona un Plan"
                />
            </div>
        </div>
        <div class="grid xl:grid-cols-12 gap-4 mt-4 mb-10">
            <div class="flex flex-col gap-2 col-span-4">
                <label for="startDate">Desde</label>
                <DatePicker
                    v-model="startDate"
                    showIcon
                    inputId="startDate"
                    dateFormat="dd/mm/yy"
                    fluid
                    :minDate="getMinStartDate"
                    :maxDate="endDate"
                    @update:modelValue="refreshReports"
                    iconDisplay="input"
                />
            </div>
            <div class="flex flex-col gap-2 col-span-4">
                <label for="endDate">Hasta</label>
                <DatePicker
                    v-model="endDate"
                    showIcon
                    inputId="endDate"
                    dateFormat="dd/mm/yy"
                    :minDate="startDate"
                    :maxDate="new Date()"
                    fluid
                    @update:modelValue="refreshReports"
                    iconDisplay="input"
                />
            </div>
            <div class="flex items-end col-span-2">
                <Button
                    icon="pi pi-filter"
                    class="!h-10"
                    severity="contrast"
                    v-tooltip.top="'Filtrar Resultados'"
                    @click="refreshReports"
                />
            </div>
            <div class="col-span-2 items-end flex justify-end">
                <Button
                    icon="pi pi-external-link"
                    label="Exportar"
                    class="!h-10"
                    severity="secondary"
                    :loading="loadingExport"
                    @click="exportCSV"
                />
            </div>
        </div>

        <GymReportsList
            :startDate="
                dayjs(startDate).startOf('day').add(3, 'hours').format('YYYY-MM-DD HH:mm:ss')
            "
            :endDate="dayjs(endDate).endOf('day').add(3, 'hours').format('YYYY-MM-DD HH:mm:ss')"
            ref="gymReportsList"
        />
    </div>
</template>

<script setup>
import GymReportsList from '@/components/superadmin/GymReportsList.vue';
import pb from '@/service/pocketbase';
import dayjs from 'dayjs/esm';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
const toast = useToast();
const gymReportsList = ref(null);
const today = new Date();
const loadingData = ref(false);
const loadingExport = ref(false);
const startDate = ref(new Date(today.setMonth(today.getMonth() - 1)));
const endDate = ref(new Date());
//Indica cuales son los items seleccionados
const selectedStatus = ref(null);
const selectedPlan = ref(null);
//Listas a cargar en los select
const statusOptions = ref([
    { label: 'Aprobado', value: 'aprobado' },
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Rechazado', value: 'rechazado' }
]);
const plans = ref([]);

const getMinStartDate = computed(() => {
    const date = new Date(endDate.value);
    date.setMonth(date.getMonth() - 2);
    return date;
});

const exportCSV = async () => {
    loadingExport.value = true;
    await gymReportsList.value.exportCSV();
    loadingExport.value = false;
};
const refreshReports = () => {
    const buildFilter = (key, value) => (value ? `${key}='${value}'` : null);

    const filters = [
        buildFilter('estado', selectedStatus.value),
        buildFilter('servicio_id', selectedPlan.value)
    ].filter(Boolean);

    gymReportsList.value.getPayments({
        first: 0,
        rows: 10,
        ...(filters.length && { filter: filters.join(' && ') })
    });
};

onMounted(async () => {
    try {
        loadingData.value = true;
        plans.value = await pb.collection('servicios').getFullList({
            sort: '-created',
            fields: 'id,nombre'
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'Error al cargar los datos',
            life: 3000
        });
    } finally {
        loadingData.value = false;
    }
});
</script>
