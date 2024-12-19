<template>
  <div class="card">
    <h1 class="text-3xl font-bold">Miembros</h1>
    <div class="mb-3 mt-5 flex justify-between">
      <IconField>
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText v-model="filters['global'].value" placeholder="Buscar..." />
      </IconField>
      <Button
        rounded
        severity="contrast"
        @click="showModal = true"
        label="Agregar Miembro"
        icon="pi pi-user-plus"
      />
    </div>
    <MemberList
      :filters="filters"
      :loading="loading"
      :members="members"
      @delete-member="deleteMember"
    />
    <Toast />
    <OneMember
      :visible="showModal"
      @closeModal="showModal = false"
      @newChanges="fetchMembers"
    />
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>
<script setup>
import Button from "primevue/button";
import MemberList from "@/components/Members/MemberList.vue";
import OneMember from "@/components/Members/OneMember.vue";
import { onMounted, ref } from "vue";
import pb from "@/service/pocketbase.js";
import { FilterMatchMode } from "@primevue/core/api";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import ConfirmDialog from "primevue/confirmdialog";
const confirm = useConfirm();
const toast = useToast();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const showModal = ref(false);
const members = ref([]);
const loading = ref(false);
const fetchMembers = async () => {
  try {
    loading.value = true;
    members.value = await pb.collection("miembros").getFullList({
      sort: "apellido",
    });
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
const deleteMember = (member) => {
  confirm.require({
    message: `Seguro que quieres eliminar a ${member.apellido}, ${member.nombre} ?`,
    header: "Confirmar Eliminación",
    icon: "pi pi-info-circle",
    rejectProps: {
      label: "Cancelar",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Eliminar",
      severity: "danger",
    },
    accept: () => {
      confirmDeleteMember(member.id);
    },
  });
};
const confirmDeleteMember = async (memberID) => {
  try {
    await pb.collection("miembros").delete(memberID);
    toast.add({
      severity: "success",
      summary: "Confirmado",
      detail: "Miembro eliminado",
      life: 3000,
    });
    members.value = members.value.filter((member) => member.id !== memberID);
  } catch (ex) {
    console.log(ex);
  }
};
onMounted(fetchMembers);
</script>
