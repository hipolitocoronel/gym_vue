<template>
    <DataTable removableSort v-model:filters="props.filters" :value="props.members" paginator :rows="10" dataKey="id" filterDisplay="row" :loading="loading" 
                :globalFilterFields="['name', 'lastname']">
            <template #empty> No se encontraron miembros. </template>
            <template #loading> Cargando Miembros. Por Favor Espere. </template>
            <Column field="name"  sortable header="Nombre">
            </Column>          
            <Column field="lastname" sortable  header="Apellido">
            </Column>
            <Column field="phone"  sortable header="Telefono">   
            </Column>
            <Column field="sexo" sortable  header="Sexo"> 
            </Column>
            <Column field="dni" sortable  header="Dni"> 
            </Column>
            <Column field="status" sortable  header="Membresia">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getSeverity(data.status)" />
                </template>             
            </Column>
            <Column header="Acciones" >
                <template #body>
                    <div class="flex gap-1">
                        <Button icon="pi pi-pencil" severity="success" variant="text" rounded size="large"/>
                        <Button icon="pi pi-trash" severity="danger" variant="text" rounded  size="large"/>
                    </div>
                </template>             
            </Column>
        </DataTable>
</template>
<script setup>
import { ref, onMounted, defineProps } from 'vue';
const props = defineProps({
    filters:Object,
    members:Object
})
const loading = ref(true);

onMounted(() => {
    loading.value = false;
});

const getSeverity = (status) => {
    switch (status) {
        case 'Vencida':
            return 'danger';

        case 'Activa':
            return 'success';
    }
}
</script>