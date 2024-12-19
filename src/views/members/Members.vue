<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Miembros</h1>
        <div class="flex justify-between mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    v-model="filters['global'].value"
                    placeholder="Buscar..."
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
        <MemberList
            :filters
            :loading
            :members
            @delete-member="deleteMember"
            @edit-member="editMember"
        />

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
import { FilterMatchMode } from '@primevue/core/api';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
const confirm = useConfirm();
const toast = useToast();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const showModal = ref(false);
const members = ref([]);
const memberData = ref([]);
const loading = ref(false);
const fetchMembers = async () => {
    try {
        loading.value = true;
        members.value = await pb.collection('miembros').getFullList({
            sort: 'apellido'
        });
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};
const closeModal = () => {
    showModal.value = false;
    memberData.value = [];
};
/*Obtiene la fila a editar y abre el modal */
const editMember = (member) => {
    memberData.value = member;
    showModal.value = true;
};
const updateTable = (isEditMode) => {
    fetchMembers();
    toast.add({
        severity: 'success',
        summary: 'Confirmado',
        detail: `Miembro ${isEditMode ? 'Editado' : 'Agregado'}`,
        life: 3000
    });
};
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
const confirmDeleteMember = async (memberID) => {
    try {
        await pb.collection('miembros').delete(memberID);
        toast.add({
            severity: 'success',
            summary: 'Confirmado',
            detail: 'Miembro eliminado',
            life: 3000
        });
        members.value = members.value.filter((member) => member.id !== memberID);
    } catch (error) {
        console.log(error);
    }
};
onMounted(fetchMembers);
</script>
