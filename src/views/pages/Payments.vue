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
        <MemberList ref="memberList" @delete-member="deleteMember" @edit-member="editMember" />
        <PaymentForm
            :memberData
            :visible="showModal"
            @closeModal="closeModal"
            @newChanges="updateTable"
        />
    </div>
</template>
<script setup>
import MemberForm from '@/components/members/MemberForm.vue';
import PaymentForm from '@/components/payments/PaymentForm.vue';
import pb from '@/service/pocketbase.js';
import { useDebounceFn } from '@vueuse/core';
import Button from 'primevue/button';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
const confirm = useConfirm();
const toast = useToast();
const showModal = ref(false);
const memberData = ref([]);
const memberList = ref(null);
const searchInput = ref('');
const closeModal = () => {
    showModal.value = false;
    memberData.value = [];
};
//Obtiene la fila a editar y abre el modal
const editMember = (member) => {
    memberData.value = member;
    showModal.value = true;
};
//Actualizar la tabla despues de agregar o editar un miembrp
const updateTable = (isEditMode) => {
    searchInput.value = '';
    memberList.value.getMembers({ first: 0, rows: 10 });
    toast.add({
        severity: 'success',
        summary: 'Confirmado',
        detail: `Miembro ${isEditMode ? 'Editado' : 'Agregado'}`,
        life: 3000
    });
};
const searchMembers = useDebounceFn(() => {
    memberList.value.getMembers({ first: 0, rows: 10, search: searchInput.value });
}, 400);

//Modal de eliminacion de miembro
const deleteMember = (member) => {
    confirm.require({
        message: `Seguro que quieres eliminar a ${member.nombre} ?`,
        header: 'Confirmar Eliminación',
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Eliminar',
            severity: 'danger'
        },
        accept: async () => {
            try {
                await pb.collection('Pagos').delete(member.id);
                memberList.value.getMembers({ first: 0, rows: 10 });
                toast.add({
                    severity: 'success',
                    summary: 'Confirmado',
                    detail: 'Miembro eliminado',
                    life: 3000
                });
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Operación fallida',
                    detail: 'Intentelo nuevamente',
                    life: 3000
                });
            }
        }
    });
};
</script>
