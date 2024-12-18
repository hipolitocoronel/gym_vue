<script setup>
import pb from '@/service/pocketbase';
import { onMounted, ref } from 'vue';

const users = ref([]);

onMounted(async () => {
    const result = await pb.collection('users').getList(1, 10);
    users.value = result.items;
});
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

            <Button as="router-link" severity="contrast" to="/agregar-miembro">
                <i class="pi pi-plus"></i>
                <span>Nuevo usuario</span>
            </Button>
        </div>

        <DataTable :value="users">
            <Column field="name" header="Nombre"></Column>
            <Column field="email" header="Correo"></Column>
            <Column field="phone" header="Teléfono"></Column>
            <Column header="Acciones"></Column>
        </DataTable>
    </div>
</template>
