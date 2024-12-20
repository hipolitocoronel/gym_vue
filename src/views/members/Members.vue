<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Miembros</h1>
        <div class="flex justify-between mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    placeholder="Buscar por nombre..."
                    @input="searchMembers"
                    v-model="searchInput"
                    class="min-w-[350px]"
                />
            </IconField>
            <Button
                severity="contrast"
                @click="showModal = true"
                label="Agregar Miembro"
                icon="pi pi-user-plus"
            />
        </div>
        <MemberList ref="memberList" @delete-member="deleteMember" @edit-member="editMember" />
        <OneMember
            :memberData
            :visible="showModal"
            @closeModal="closeModal"
            @newChanges="updateTable"
        />
        <ConfirmDialog></ConfirmDialog>
    </div>
</template>
<script setup>
import MemberList from '@/components/Members/MemberList.vue';
import OneMember from '@/components/Members/OneMember.vue';
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
}, 700);

window.addEventListener('resize', searchMembers);
//Modal de eliminacion de miembro
const deleteMember = (member) => {
    confirm.require({
        message: `Seguro que quieres eliminar a ${member.apellido}, ${member.nombre} ?`,
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
            confirmDeleteMember(member.id);
        }
    });
};
//Elimnar miembro de la base de datos
const confirmDeleteMember = async (memberID) => {
    try {
        await pb.collection('miembros').delete(memberID);
        toast.add({
            severity: 'success',
            summary: 'Confirmado',
            detail: 'Miembro eliminado',
            life: 3000
        });
        memberList.value.getMembers({ first: 0, rows: 10 });
    } catch (error) {
        console.log(error);
    }
};
</script>
