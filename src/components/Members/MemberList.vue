<template>
    <DataTable
        removableSort
        v-model:filters="props.filters"
        :value="props.members"
        paginator
        :rows="10"
        :loading="props.loading"
        :globalFilterFields="['name', 'lastname']"
    >
        <template #empty> No se encontraron miembros. </template>
        <template #loading> Cargando Miembros. Por Favor Espere. </template>
        <Column field="apellido" sortable header="Apellido"> </Column>
        <Column field="nombre" sortable header="Nombre"> </Column>
        <Column field="telefono" sortable header="Telefono"> </Column>
        <Column field="sexo" sortable header="Sexo"> </Column>
        <Column field="dni" sortable header="Dni"> </Column>
        <Column field="membresia" sortable header="Membresia">
            <template #body="{ data }">
                <Tag
                    :value="data.membresia ? 'Activa' : 'Vencida'"
                    :severity="data.membresia ? 'success' : 'danger'"
                />
            </template>
        </Column>
        <Column header="Acciones">
            <template #body="{ data }">
                <div class="flex gap-1">
                    <Button
                        icon="pi pi-pencil"
                        severity="success"
                        variant="text"
                        rounded
                        size="large"
                        @click="$emit('editMember', data)"
                    />
                    <Button
                        icon="pi pi-trash"
                        @click="$emit('deleteMember', data)"
                        severity="danger"
                        variant="text"
                        rounded
                        size="large"
                    />
                </div>
            </template>
        </Column>
    </DataTable>
</template>
<script setup>
import { ref, defineProps } from 'vue';
const props = defineProps({
    filters: Object,
    members: Object,
    loading: Boolean
});
</script>
