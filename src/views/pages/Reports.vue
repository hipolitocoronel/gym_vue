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
                <label for="dateFrom">Desde</label>
                <DatePicker
                    v-model="dateFrom"
                    showIcon
                    inputId="dateFrom"
                    dateFormat="dd/mm/yy"
                    fluid
                    :maxDate="dateUntil"
                    @update:modelValue="refreshReports"
                    iconDisplay="input"
                />
            </div>
            <div class="flex flex-col gap-2 col-span-4">
                <label for="dateUntil">Hasta</label>
                <DatePicker
                    v-model="dateUntil"
                    showIcon
                    inputId="dateUntil"
                    dateFormat="dd/mm/yy"
                    :minDate="dateFrom"
                    fluid
                    @update:modelValue="refreshReports"
                    iconDisplay="input"
                />
            </div>
            <div class="flex items-end">
                <Button
                    icon="pi pi-filter"
                    class="!h-10"
                    severity="contrast"
                    v-tooltip.top="'Filtrar Resultados'"
                    @click="onFilterReports"
                />
            </div>
        </div>

        <ReportsList :from="dateFrom" :to="dateUntil" ref="reportsList" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import pb from '@/service/pocketbase';
const toast = useToast();
import ReportsList from '@/components/dashboard/ReportsList.vue';
const reportsList = ref(null);
const today = new Date();
const loadingData = ref(false);
const loadingPeriods = ref(false);
const dateFrom = ref(new Date(today.setMonth(today.getMonth() - 1)));
const dateUntil = ref(new Date());
//Indica cuales son los items seleccionados
const selectedPaymentMethod = ref(null);
const selectedPlan = ref(null);
const selectedPeriod = ref(null);
//Listas a cargar en los select
const paymentMethods = ref([{ nombre: 'Efectivo' }, { nombre: 'Transferencia' }]);
const plans = ref([]);
const periods = ref([]);

const onFilterReports = () => {
    console.log(finalFilter);
    reportsList.value.getPayments({
        first: 0,
        rows: 10,
        filter:
    });
};
const onPlanChange = async (plan) => {
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
