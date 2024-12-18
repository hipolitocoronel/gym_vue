<template>
  <Dialog
    v-model:visible="props.visible"
    modal
    @update:visible="closeModal"
    header="Agregar Miembro"
    :style="{ width: '28rem' }"
  >
    <form @submit.prevent="onFormSubmit" class="flex justify-center flex-col gap-4 mt-3">
      <FloatLabel variant="in">
        <InputText id="name" fluid v-model="formData.nombre" autocomplete="off" />
        <label for="name">Nombre</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText id="lastname" fluid v-model="formData.apellido" autocomplete="off" />
        <label for="lastname">Apellido</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText id="address" fluid v-model="formData.direccion" autocomplete="off" />
        <label for="address">Dirección</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText
          id="phone"
          v-model="formData.telefono"
          type="number"
          fluid
          autocomplete="off"
        />
        <label for="phone">Teléfono</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <InputText
          id="dni"
          fluid
          v-model="formData.dni"
          type="number"
          autocomplete="off"
        />
        <label for="dni">DNI</label>
      </FloatLabel>
      <div class="flex flex-wrap gap-4">
        <div class="flex items-center gap-2">
          <RadioButton
            v-model="formData.sexo"
            inputId="hombre"
            name="hombre"
            value="Hombre"
          />
          <label for="hombre">Hombre</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton
            v-model="formData.sexo"
            inputId="mujer"
            name="mujer"
            value="Mujer"
          />
          <label for="mujer">Mujer</label>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="closeModal"
        ></Button>
        <Button label="Agregar" :loading="loading" type="submit"></Button>
      </div>
    </form>
  </Dialog>
</template>
<script setup>
import RadioButton from "primevue/radiobutton";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import memberService from "@/service/MemberService.js";
import { ref, defineProps, defineEmits } from "vue";
const showModal = ref(false);
const emit = defineEmits(["closeModal", "newChanges"]);
const props = defineProps({
  visible: Boolean,
});
const loading = ref(false);
const initialValues = {
  nombre: "",
  apellido: "",
  telefono: null,
  direccion: "",
  dni: null,
  sexo: null,
  membresia: true,
};
const formData = ref({ ...initialValues });
const resetForm = () => {
  formData.value = { ...initialValues };
};
const closeModal = () => {
  resetForm();
  emit("closeModal");
};
const onFormSubmit = async () => {
  try {
    loading.value = true;
    await memberService.createMember(formData.value);
    emit("newChanges");
    closeModal();
  } catch (ex) {
    console.log(ex);
  } finally {
    loading.value = false;
  }
};
</script>
<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
