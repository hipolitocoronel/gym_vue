<template>
    <DataTable :value="memberships" :lazy="true" :loading="loading">
        <template #empty> Sin registros. </template>
        <Column header="Plan">
            <template #body="{ data }">
                {{ data.expand.id_plan_plazo.expand.id_plan.nombre }}
            </template>
        </Column>
        <Column header="Fecha De Pago"
            ><template #body="{ data }">
                {{ dayjs(data.fecha_pago).format('DD/MM/YYYY') }}
            </template>
        </Column>
        <Column header="Fecha De Vencimiento"
            ><template #body="{ data }">
                {{ dayjs(data.fecha_vencimiento).format('DD/MM/YYYY') }}
            </template>
        </Column>
        <Column header="Estado">
            <template #body="{ data }">
                <Tag
                    :value="getMembershipStatus(data) ? 'Vigente' : 'Vencido'"
                    :severity="getMembershipStatus(data) ? 'success' : 'danger'"
                />
            </template>
        </Column>
    </DataTable>
</template>
<script setup>
import getMembershipStatus from '@/utils/getMembershipStatus';
import dayjs from 'dayjs/esm';
const props = defineProps({
    memberships: Array,
    loading: Boolean
});
</script>
