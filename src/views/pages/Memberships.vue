<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Planes</h1>
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
                to="planes/agregar-plan"
                severity="contrast"
                label="Agregar Plan"
                icon="pi pi-plus"
                as="router-link"
            />
        </div>
        <MembershipList
            ref="membershipList"
            @delete-membership="deleteMembership"
            @edit-membership="editMembership"
        />
    </div>
</template>
<script setup>
import MembershipList from '@/components/memberships/MembershipList.vue';
import pb from '@/service/pocketbase.js';
import { useDebounceFn } from '@vueuse/core';
import Button from 'primevue/button';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
const confirm = useConfirm();
const toast = useToast();
const searchInput = ref('');
const membershipList = ref(null);

//Actualizar la tabla despues de agregar o editar un plan
const updateTable = (isEditMode) => {
    searchInput.value = '';
    membershipList.value.getMemberships({ first: 0, rows: 10 });
    toast.add({
        severity: 'success',
        summary: 'Confirmado',
        detail: `Plan ${isEditMode ? 'Editado' : 'Agregado'}`,
        life: 3000
    });
};
const searchMemberships = useDebounceFn(() => {
    membershipList.value.getMemberships({ first: 0, rows: 10, search: searchInput.value });
}, 300);

//Modal de eliminacion de plan
const deleteMembership = (membership) => {
    confirm.require({
        message: `Seguro que quieres eliminar el plan ${membership.nombre} ?`,
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
                let plazos = await pb.collection('planes_plazos').getFullList({
                    filter: `id_plan="${membership.id}"`
                });
                for (const plazo of plazos) {
                    await pb.collection('planes_plazos').delete(plazo.id);
                }
                await pb.collection('planes').delete(membership.id);
                membershipList.value.getMemberships({ first: 0, rows: 10 });

                toast.add({
                    severity: 'success',
                    summary: 'Confirmado',
                    detail: 'Plan eliminado',
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
