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
                v-if="hasPermission('plan.create')"
            />
        </div>
        <MembershipList ref="membershipList" @delete-membership="deleteMembership" />
    </div>
</template>
<script setup>
import MembershipList from '@/components/memberships/MembershipList.vue';
import pb from '@/service/pocketbase.js';
import { useIndexStore } from '@/storage';
import { hasPermission } from '@/utils/hasPermission';
import { useDebounceFn } from '@vueuse/core';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
const confirm = useConfirm();
const toast = useToast();
const searchInput = ref('');
const membershipList = ref(null);
const store = useIndexStore();

const searchMemberships = useDebounceFn(() => {
    membershipList.value.getMemberships({ first: 0, rows: null, search: searchInput.value });
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
                membership.deleted = new Date();
                await pb.collection('planes').update(membership.id, membership);
                membershipList.value.getMemberships({ first: 0, rows: null });

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
