<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Miembros</h1>
        <div class="flex justify-between mt-5 mb-3">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    placeholder="Buscar por nombre, dni o teléfono..."
                    @input="searchMembers"
                    v-model="searchInput"
                    class="min-w-[350px]"
                />
            </IconField>
            <Button
                severity="contrast"
                @click="showModal = true"
                label="Agregar Miembro"
                :disabled="!canAddMembers"
                icon="pi pi-user-plus"
                v-tooltip.top="
                    canAddMembers ? 'Agregar Miembro' : 'Tu gimnasio no puede agregar miembros'
                "
                v-if="hasPermission('members.create')"
            />
        </div>
        <MemberList
            ref="memberList"
            @delete-member="deleteMember"
            @watch-member="watchMember"
            @edit-member="editMember"
        />
        <MemberForm
            :memberData
            :visible="showModal"
            @closeModal="closeModal"
            @newChanges="updateTable"
        />

        <MemberDetails :memberData :visible="showModalDetails" @closeModal="closeModal" />
    </div>
</template>
<script setup>
import MemberDetails from '@/components/members/MemberDetails.vue';
import MemberForm from '@/components/members/MemberForm.vue';
import MemberList from '@/components/members/MemberList.vue';
import pb from '@/service/pocketbase.js';
import { useIndexStore } from '@/storage';
import { hasPermission } from '@/utils/hasPermission';
import { useDebounceFn } from '@vueuse/core';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
const confirm = useConfirm();
const toast = useToast();
const store = useIndexStore();
//Modal de creacion y edicion
const showModal = ref(false);
//Modal de detalles
const showModalDetails = ref(false);
const memberData = ref([]);
const memberList = ref(null);
const searchInput = ref('');
const canAddMembers = ref();
const closeModal = () => {
    showModal.value = false;
    showModalDetails.value = false;
    memberData.value = [];
};
//Obtiene la fila a editar y abre el modal
const editMember = (member) => {
    memberData.value = member;
    showModal.value = true;
};
//Mostrar el detalle del miembro
const watchMember = (member) => {
    memberData.value = member;
    showModalDetails.value = true;
};
const checkCanAdd = async () => {
    const result = await pb.collection('gimnasios_caracteristicas').getOne(store.currentGym.id);
    return result.total_miembros <= store.currentGym.expand.servicio_id.limite_miembros;
};
//Actualizar la tabla despues de agregar o editar un miembrp
const updateTable = async (isEditMode) => {
    canAddMembers.value = await checkCanAdd();
    searchInput.value = '';
    memberList.value.getMembers({ first: 0, rows: null });
    toast.add({
        severity: 'success',
        summary: 'Confirmado',
        detail: `Miembro ${isEditMode ? 'Editado' : 'Agregado'}`,
        life: 3000
    });
};
const searchMembers = useDebounceFn(() => {
    memberList.value.getMembers({ first: 0, rows: null, search: searchInput.value });
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
                member.deleted = new Date();
                await pb.collection('miembros').update(member.id, member);
                searchInput.value = '';
                memberList.value.getMembers({ first: 0, rows: null });
                canAddMembers.value = await checkCanAdd();
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

onMounted(async () => {
    canAddMembers.value = await checkCanAdd();
});
</script>
