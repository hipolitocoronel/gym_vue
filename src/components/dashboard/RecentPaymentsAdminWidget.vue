<template>
    <div class="card">
        <div class="flex justify-between">
            <h2 class="text-xl font-bold mb-3">Últimos Pagos</h2>
            <Button
                label="Ver Más"
                severity="secondary"
                as="router-link"
                to="/admin/pagos-gimnasios"
                size="small"
            />
        </div>

        <DataTable :value="payments" :loading>
            <template #empty> Sin registros. </template>
            <Column header="Gimnasio">
                <template #body="{ data }">
                    <div class="flex gap-4 items-center">
                        <Avatar
                            shape="circle"
                            :label="data?.expand.gimnasio_id.nombre?.substring(0, 1)"
                            v-if="!data?.expand.gimnasio_id.logo"
                        />
                        <Avatar
                            shape="circle"
                            :image="getGymLogoUrl(data.expand.gimnasio_id)"
                            v-else
                            class="w-10"
                            alt=""
                        />
                        {{ data.expand.gimnasio_id.nombre }}
                    </div>
                </template>
            </Column>
            <Column header="Estado">
                <template #body="{ data }">
                    <Tag
                        :value="`${data.estado.charAt(0).toUpperCase()}${data.estado.slice(1)}`"
                        :severity="getPaymentStatus(data.estado)"
                    />
                </template>
            </Column>
            <Column
                :field="(data) => dayjs(data.payment_date).format('DD/MM/YYYY')"
                header="Fecha de Pago"
            >
            </Column>
            <Column header="Servicio">
                <template #body="{ data }">
                    <span
                        :class="getTagColor(data.expand.servicio_id.color)"
                        class="text-sm font-semibold pt-[4px] pb-[5px] px-2 rounded-md"
                        >{{ data.expand.servicio_id.nombre }}</span
                    >
                </template>
            </Column>

            <Column :field="(data) => formatCurrency(data.monto_cobrado)" header="Monto Cobrado">
            </Column>
            <Column :field="(data) => formatCurrency(data.monto_recibido)" header="Monto Recibido">
            </Column>
        </DataTable>
    </div>
</template>
<script setup>
import pb from '@/service/pocketbase.js';
import formatCurrency from '@/utils/formatCurrency';
import getPaymentStatus from '@/utils/getPaymentStatus';
import getTagColor from '@/utils/getTagColor';
import dayjs from 'dayjs/esm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
const payments = ref([]);
const loading = ref(false);
const toast = useToast();
const backend = import.meta.env.VITE_BACKEND_URL;

const getGymLogoUrl = (gym) => `${backend}/api/files/${gym.collectionId}/${gym.id}/${gym.logo}`;
const getPayments = async () => {
    try {
        loading.value = true;
        const result = await pb.collection('servicios_pagos').getList(1, 5, {
            sort: '-created',
            expand: 'gimnasio_id, servicio_id'
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
onMounted(() => getPayments());
</script>
