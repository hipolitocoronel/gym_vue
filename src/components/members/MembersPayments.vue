<template>
    <div class="flex justify-between mb-6">
        <IconField>
            <InputIcon>
                <i class="pi pi-search" />
            </InputIcon>
            <InputText
                @input="searchPayments"
                placeholder="Buscar pago..."
                class="min-w-[350px]"
                v-model="searchInput"
            />
        </IconField>
        <Button severity="secondary" label="Exportar CSV" icon="pi pi-external-link" />
    </div>
    <PaymentList @viewPayment="viewPayment" ref="paymentList" :memberId="memberData?.id" />
    <PaymentDetails :paymentData :visible="paymentDetails" @closeModal="paymentDetails = false" />
</template>
<script setup>
import { useDebounceFn } from '@vueuse/core';
import { ref } from 'vue';
import PaymentDetails from '../payments/PaymentDetails.vue';
const props = defineProps({
    memberData: Object
});
// Despues hacer un componente para reutlizar en Payments
const paymentList = ref(null);
const searchInput = ref('');
const paymentData = ref(null);
const paymentDetails = ref(false);
const viewPayment = (payment) => {
    paymentDetails.value = true;
    paymentData.value = payment;
};
const searchPayments = useDebounceFn(() => {
    paymentList.value.getPayments({ first: 0, rows: 10, search: searchInput.value });
}, 400);
</script>
