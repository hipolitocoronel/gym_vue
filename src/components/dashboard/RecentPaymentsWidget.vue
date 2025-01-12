<template>
    <div class="card">
        <div class="flex justify-between">
            <h2 class="text-xl font-bold mb-3">Últimos Pagos</h2>
            <Button
                label="Ver Más"
                severity="secondary"
                as="router-link"
                to="/pagos"
                size="small"
            />
        </div>
        <DataTable
            size="large"
            class="mb-4"
            :value="payments"
            :loading="loading"
            @page="getPayments"
        >
            <template #empty> Sin registros. </template>
            <Column header="Cliente">
                <template #body="{ data }">
                    {{ data.expand.id_miembro.nombre }}
                </template>
            </Column>
            <Column header="Fecha De Pago"
                ><template #body="{ data }">
                    {{ dayjs(data.fecha_pago).format('DD/MM/YYYY') }}
                </template>
            </Column>
            <Column header="Plan">
                <template #body="{ data }">
                    {{
                        data.expand.id_plan_plazo.expand.id_plan.nombre +
                        ' ' +
                        data.expand.id_plan_plazo.duracion +
                        (data.expand.id_plan_plazo.duracion > 1 ? ' meses' : ' mes')
                    }}
                </template>
            </Column>
            <Column header="Monto">
                <template #body="{ data }">
                    {{ formatCurrency(data.monto_total) }}
                </template>
            </Column>
            <Column header="Medio de pago">
                <template #body="{ data }"
                    ><Tag
                        :severity="data.medio_pago == 'Efectivo' ? 'success' : 'primary'"
                        :value="data.medio_pago"
                    >
                    </Tag>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import dayjs from 'dayjs/esm';
import formatCurrency from '@/utils/formatCurrency';
import pb from '@/service/pocketbase.js';
const payments = ref([]);
const loading = ref(false);
const toast = useToast();

onMounted(() => getPayments());

const getPayments = async () => {
    try {
        loading.value = true;
        const result = await pb.collection('pagos').getList(1, 5, {
            sort: '-fecha_pago',
            expand: 'id_plan_plazo, id_miembro, id_plan_plazo.id_plan',
            fields: 'fecha_pago,monto_total,medio_pago, fecha_vencimiento, expand.id_plan_plazo.duracion, expand.id_plan_plazo.precio, expand.id_plan_plazo.expand.id_plan.nombre, expand.id_miembro.nombre, expand.id_miembro.dni'
        });
        payments.value = result.items;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo obtener los pagos',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
</script>
