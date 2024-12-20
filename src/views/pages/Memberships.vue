<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Membresías</h1>
        <div class="flex justify-between mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    placeholder="Buscar por nombre..."
                    @input="searchMemberships"
                    v-model="searchInput"
                    class="min-w-[350px]"
                />
            </IconField>
            <Button
                severity="contrast"
                @click="showModal = true"
                label="Agregar Membresía"
                icon="pi pi-plus"
            />
        </div>
        <MembershipList
            ref="membershipList"
            @delete-membership="deleteMembership"
            @edit-membership="editMembership"
        />
        <MembershipForm
            :membershipData
            :visible="showModal"
            @closeModal="closeModal"
            @newChanges="updateTable"
        />
        <ConfirmDialog></ConfirmDialog>
    </div>
</template>
<script setup>
import MembershipList from '@/components/memberships/MembershipList.vue';
import MembershipForm from '@/components/memberships/MembershipForm.vue';
import pb from '@/service/pocketbase.js';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
const confirm = useConfirm();
const toast = useToast();
const showModal = ref(false);
const membershipData = ref([]);
const searchInput = ref('');
const membershipList = ref(null);
const closeModal = () => {
    showModal.value = false;
    membershipData.value = [];
};
//Obtiene la fila a editar y abre el modal
const editMembership = (membership) => {
    membershipData.value = membership;
    showModal.value = true;
};
//Actualizar la tabla despues de agregar o editar una membresia
const updateTable = (isEditMode) => {
    searchInput.value = '';
    membershipList.value.getMemberships({ first: 0, rows: 10 });
    toast.add({
        severity: 'success',
        summary: 'Confirmado',
        detail: `Membresía ${isEditMode ? 'Editada' : 'Agregada'}`,
        life: 3000
    });
};
const searchMemberships = useDebounceFn(() => {
    membershipList.value.getMemberships({ first: 0, rows: 10, search: searchInput.value });
}, 600);

//Modal de eliminacion de membresia
const deleteMembership = (membership) => {
    confirm.require({
        message: `Seguro que quieres eliminar la membresía ${membership.nombre} ?`,
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
        accept: () => {
            confirmDeleteMembership(membership.id);
        }
    });
};
//Elimnar membresia de la base de datos
const confirmDeleteMembership = async (memberID) => {
    try {
        await pb.collection('membresias').delete(memberID);
        membershipList.value.getMemberships({ first: 0, rows: 10 });

        toast.add({
            severity: 'success',
            summary: 'Confirmado',
            detail: 'Membresia eliminada',
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
};
</script>
