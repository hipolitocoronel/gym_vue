<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Miembros</h1>
        <div class="flex justify-between mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText placeholder="Buscar..." class="min-w-[350px]" />
            </IconField>
            <div class="flex gap-2">
                <Button
                    severity="contrast"
                    @click="showModal = true"
                    label="Agregar Miembro"
                    icon="pi pi-user-plus"
                />
                <Button
                    severity="contrast"
                    @click="showModal2 = true"
                    label="Agregar Miembro 2"
                    icon="pi pi-user-plus"
                />
            </div>
        </div>
        <MemberList ref="memberList" @delete-member="deleteMember" @edit-member="editMember" />
        <OneMember
            :memberData
            :visible="showModal"
            @closeModal="closeModal"
            @newChanges="updateTable"
        /><OneMember2
            :memberData
            :visible="showModal2"
            @closeModal="showModal2 = false"
            @newChanges="updateTable"
        />
        <ConfirmDialog></ConfirmDialog>
    </div>
</template>
<script setup>
import MemberList from '@/components/Members/MemberList.vue';
import OneMember from '@/components/Members/OneMember.vue';
import OneMember2 from '@/components/Members/OneMember2.vue';
import pb from '@/service/pocketbase.js';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
const confirm = useConfirm();
const toast = useToast();
const showModal = ref(false);
const showModal2 = ref(false);
const memberData = ref([]);
const memberList = ref(null);
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
    memberList.value.getMembers({ first: 0, rows: 10 });
    toast.add({
        severity: 'success',
        summary: 'Confirmado',
        detail: `Miembro ${isEditMode ? 'Editado' : 'Agregado'}`,
        life: 3000
    });
};
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
