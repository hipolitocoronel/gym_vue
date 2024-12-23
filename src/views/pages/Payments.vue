<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Pagos</h1>
        <div class="flex justify-between mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText placeholder="Buscar..." class="min-w-[350px]" />
            </IconField>
            <Button
                severity="contrast"
                @click="showModal = true"
                label="Registrar Pago"
                icon="pi pi-dollar"
            />
        </div>
        <PaymentList ref="paymentList" @delete-member="deleteMember" @edit-member="PaymentList" />
        <PaymentForm
            :visible="showModal"
            @closeModal="showModal = false"
            @newChanges="updateTable"
        />
    </div>
</template>
<script setup>
import PaymentForm from '@/components/payments/PaymentForm.vue';
import PaymentList from '@/components/payments/PaymentList.vue';
import pb from '@/service/pocketbase.js';
import { useDebounceFn } from '@vueuse/core';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
const confirm = useConfirm();
const toast = useToast();
const showModal = ref(false);
const paymentList = ref(null);
const searchInput = ref('');

//Actualizar la tabla despues de agregar un pago
const updateTable = () => {
    searchInput.value = '';
    paymentList.value.getPayments({ first: 0, rows: 10 });
};
const searchMembers = useDebounceFn(() => {
    paymentList.value.getPayments({ first: 0, rows: 10, search: searchInput.value });
}, 400);
</script>
