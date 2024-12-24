<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Pagos</h1>
        <div class="flex justify-between mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    placeholder="Buscar por nombre..."
                    class="min-w-[350px]"
                    @input="searchPayments"
                    v-model="searchInput"
                />
            </IconField>
            <Button
                severity="contrast"
                @click="addPaymentModal = true"
                label="Registrar Pago"
                icon="pi pi-dollar"
            />
        </div>
        <PaymentList @viewPayment="viewPayment" ref="paymentList" />
        <PaymentForm
            :visible="addPaymentModal"
            @closeModal="addPaymentModal = false"
            @newChanges="updateTable"
        />
        <PaymentDetails
            :paymentData
            :visible="paymentDetails"
            @closeModal="paymentDetails = false"
        />
    </div>
</template>
<script setup>
import PaymentForm from '@/components/payments/PaymentForm.vue';
import PaymentList from '@/components/payments/PaymentList.vue';
import PaymentDetails from '@/components/payments/PaymentDetails.vue';
import pb from '@/service/pocketbase.js';
import { useDebounceFn } from '@vueuse/core';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
const confirm = useConfirm();
const toast = useToast();
const paymentList = ref(null);
const searchInput = ref('');
//Indica visibilidad del detalle del pago
const paymentDetails = ref(false);
const paymentData = ref(null);
//Indica visibilidad del modal de agregar pago
const addPaymentModal = ref(false);
//Actualizar la tabla despues de agregar un pago
const updateTable = () => {
    searchInput.value = '';
    paymentList.value.getPayments({ first: 0, rows: 10 });
};
const viewPayment = (payment) => {
    paymentDetails.value = true;
    paymentData.value = payment;
};
const searchPayments = useDebounceFn(() => {
    paymentList.value.getPayments({ first: 0, rows: 10, search: searchInput.value });
}, 400);
</script>
