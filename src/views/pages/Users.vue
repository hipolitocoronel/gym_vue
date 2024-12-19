<script setup>
import UserForm from '@/components/users/UserForm.vue';
import UserList from '@/components/users/UserList.vue';
import { ref } from 'vue';

const showModal = ref(false);
</script>

<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Usuarios</h1>
        <div class="flex justify-between mt-5 mb-2">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText placeholder="Buscar..." class="min-w-[350px]" />
            </IconField>

            <Button severity="contrast" @click="showModal = true">
                <i class="pi pi-plus"></i>
                <span>Nuevo usuario</span>
            </Button>
        </div>

        <UserList />
        <UserForm :visible="showModal" member-data="" @closeModal="showModal = false" />
    </div>
</template>
