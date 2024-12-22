<script setup>
import UserForm from '@/components/users/UserForm.vue';
import UserList from '@/components/users/UserList.vue';
import pb from '@/service/pocketbase';
import { useDebounceFn } from '@vueuse/core';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const confirm = useConfirm();
const toast = useToast();
const showModal = ref(false);
const querySearch = ref('');
const userList = ref(null);
const userData = ref({});

const closeModal = () => {
    showModal.value = false;
    userData.value = {};
};

const getUsersByQuery = useDebounceFn(() => {
    // se manda rows nulo para que mantanga la paginacion que tenia antes
    userList.value.getUsers({ first: 0, rows: null, query: querySearch.value });
}, 500);

const reloadData = () => {
    querySearch.value = '';
    userList.value.getUsers({ first: 0, rows: null });
};

const editUser = (user) => {
    userData.value = user;
    showModal.value = true;
};

const deleteUser = (user) => {
    confirm.require({
        message: `Vas a eliminar a ${user.name} ?`,
        header: '¿Estás seguro?',
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
                await pb.collection('users').delete(user.id);
                reloadData();
                toast.add({
                    severity: 'success',
                    summary: 'Operación exitosa!',
                    detail: 'Usuario eliminado correctamente.',
                    life: 3000
                });
            } catch (error) {
                console.error(error);
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

<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Usuarios</h1>
        <div class="flex justify-between mt-5 mb-2">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    placeholder="Buscar por nombre, correo o telefono."
                    class="min-w-[350px]"
                    v-model="querySearch"
                    @input="getUsersByQuery"
                />
            </IconField>

            <Button severity="contrast" @click="showModal = true">
                <i class="pi pi-plus"></i>
                <span>Nuevo usuario</span>
            </Button>
        </div>

        <UserList ref="userList" @deleteUser="deleteUser" @editUser="editUser" />
        <UserForm
            :visible="showModal"
            @closeModal="closeModal"
            :data="userData"
            @reloadData="reloadData"
        />
    </div>
</template>
