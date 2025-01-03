<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Reportes</h1>
        <div class="grid grid-cols-12 mt-4 gap-3">
            <div class="flex flex-col gap-2 col-span-4">
                <label>Medio de Pago</label>
                <Select
                    v-model="selectedPaymentMethod"
                    :options="paymentMethods"
                    optionLabel="nombre"
                    fluid
                    showClear
                    :optionValue="(selectedPaymentMethod) => selectedPaymentMethod.nombre"
                    :loading="loadingData"
                    emptyMessage="No hay medios de pago"
                    placeholder="Selecciona un medio de pago"
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
                    @update:modelValue="onPlanChange"
                    :loading="loadingData"
                    emptyMessage="No hay planes"
                    placeholder="Selecciona un Plan"
                />
            </div>
            <div class="flex flex-col gap-2 col-span-4">
                <label>Plazo</label>
                <Select
                    v-model="selectedPeriod"
                    :loading="loadingPeriods"
                    :options="periods"
                    showClear
                    :optionValue="(selectedPeriod) => selectedPeriod.id"
                    emptyMessage="Selecciona un plan primero"
                    placeholder="Selecciona el plazo del plan"
                    :optionLabel="
                        (selectedPeriod) =>
                            selectedPeriod.duracion +
                            (selectedPeriod.duracion > 1 ? ' meses' : ' mes')
                    "
                    fluid
                />
            </div>
        </div>
        <div class="grid xl:grid-cols-12 gap-4 mt-4 mb-3">
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
                    @click="onFilterReports"
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

        <ReportsList :startDate :endDate ref="reportsList" />
    </div>
</template>

<script setup>
import ReportsList from '@/components/dashboard/ReportsList.vue';
import pb from '@/service/pocketbase';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
const toast = useToast();
const reportsList = ref(null);
const today = new Date();
const loadingData = ref(false);
const loadingPeriods = ref(false);
const loadingExport = ref(false);
const startDate = ref(new Date(today.setMonth(today.getMonth() - 1)));
const endDate = ref(new Date());
//Indica cuales son los items seleccionados
const selectedPaymentMethod = ref(null);
const selectedPlan = ref(null);
const selectedPeriod = ref(null);
//Listas a cargar en los select
const paymentMethods = ref([{ nombre: 'Efectivo' }, { nombre: 'Transferencia' }]);
const plans = ref([]);
const periods = ref([]);

const getMinStartDate = computed(() => {
    const date = new Date(endDate.value);
    date.setMonth(date.getMonth() - 2);
    return date;
});

const exportCSV = async () => {
    loadingExport.value = true;
    await reportsList.value.exportCSV();
    loadingExport.value = false;
};
const onFilterReports = () => {
    const buildFilter = (key, value) => (value ? `${key}='${value}'` : null);

    const filters = [
        buildFilter('medio_pago', selectedPaymentMethod.value),
        buildFilter('id_plan_plazo.id_plan', selectedPlan.value),
        buildFilter('id_plan_plazo', selectedPeriod.value)
    ].filter(Boolean);

    reportsList.value.getPayments({
        first: 0,
        rows: 10,
        ...(filters.length && { filter: filters.join(' && ') })
    });
};
const onPlanChange = async (plan) => {
    selectedPeriod.value = null;
    try {
        loadingPeriods.value = true;
        periods.value = await pb.collection('planes_plazos').getFullList({
            filter: `id_plan='${plan}' && deleted = null`
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'Error al cargar los datos',
            life: 3000
        });
    } finally {
        loadingPeriods.value = false;
    }
};
const refreshReports = () => {
    reportsList.value.getPayments({ first: 0, rows: 10 });
};
onMounted(async () => {
    try {
        loadingData.value = true;
        plans.value = await pb.collection('planes').getFullList({
            fields: 'id,nombre',
            filter: 'deleted = null',
            sort: '-created'
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
