<template>
    <div class="card">
        <h1 class="text-3xl font-bold">Miembros</h1>
        <div class="mb-2 mt-5 flex justify-between">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
            </IconField>
            <Button as="router-link" rounded severity="contrast"label="Agregar Miembro" to="/agregar-miembro" />
        </div>
        <MemberList :filters :members/>
    </div>
</template>
<script setup>
import Button from 'primevue/button';
import MemberList from '@/components/Members/MemberList.vue'
import { ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const members = ref([
    {
        name: 'Juan De La Cruz',
        lastname: 'Coronel',
        status:'Vencida',
        phone: 4839293,
        sexo: "Hombre",
        dni: 45759514
    },
    {
        name: 'Jose',
        lastname: 'Ramirez Sosa',
        status:'Activa',
        phone: 4839293,
        sexo: "Hombre",
        dni: 55759214
    },
    {
        name: 'Maria',
        lastname: 'Coronel',
        status:'Vencida',
        phone: 4839293,
        sexo: "Mujer",
        dni: 4242424
    },
])
</script>

