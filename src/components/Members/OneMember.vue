<template>
    <Dialog
        v-model:visible="props.visible"
        modal
        @update:visible="closeModal"
        :header="isEditMode ? 'Editar Miembro' : 'Agregar Miembro'"
        :style="{ width: '28rem' }"
    >
        <Form
            v-slot="$form"
            :initialValues
            :resolver
            @submit="onFormSubmit"
            class="flex justify-center flex-col gap-4"
        >
            <div class="flex flex-col gap-1">
                <InputText v-if="isEditMode" id="id" name="id" class="hidden" />
                <FloatLabel variant="in">
                    <InputText id="nombre" name="nombre" fluid autocomplete="off" />
                    <label for="nombre">Nombre</label>
                </FloatLabel>
                <Message
                    v-if="$form.nombre?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.nombre.error.message }}</Message
                >
            </div>
            <div class="flex flex-col gap-1">
                <FloatLabel variant="in">
                    <InputText id="apellido" name="apellido" fluid autocomplete="off" />
                    <label for="apellido">Apellido</label>
                </FloatLabel>
                <Message
                    v-if="$form.apellido?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.apellido.error.message }}</Message
                >
            </div>
            <FloatLabel variant="in">
                <InputText id="direccion" name="direccion" fluid autocomplete="off" />
                <label for="direccion">Dirección</label>
            </FloatLabel>
            <div class="flex flex-col gap-1">
                <FloatLabel variant="in">
                    <InputText
                        id="telefono"
                        type="number"
                        name="telefono"
                        fluid
                        autocomplete="off"
                    />
                    <label for="telefono">Teléfono</label>
                </FloatLabel>
                <Message
                    v-if="$form.telefono?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.telefono.error.message }}</Message
                >
            </div>
            <div class="flex flex-col gap-1">
                <FloatLabel variant="in">
                    <InputText id="dni" name="dni" type="number" fluid autocomplete="off" />
                    <label for="dni">DNI</label>
                </FloatLabel>
                <Message
                    v-if="$form.dni?.invalid || errorDni"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ errorDni ? 'DNI ya registrado' : $form.dni.error.message }}</Message
                >
            </div>
            <RadioButtonGroup :invalid="$form.sexo?.invalid" name="sexo" class="flex gap-4">
                <div class="flex items-center gap-2">
                    <RadioButton inputId="hombre" value="Hombre" />
                    <label for="hombre" :class="{ 'text-red-400': $form.sexo?.invalid }"
                        >Hombre</label
                    >
                </div>

                <div class="flex items-center gap-2">
                    <RadioButton inputId="mujer" value="Mujer" />
                    <label for="mujer" :class="{ 'text-red-400': $form.sexo?.invalid }"
                        >Mujer</label
                    >
                </div>
            </RadioButtonGroup>

            <div class="flex justify-end gap-2 mt-1">
                <Button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    @click="closeModal"
                ></Button>
                <Button
                    :label="isEditMode ? 'Editar' : 'Agregar'"
                    :loading="loading"
                    type="submit"
                ></Button>
            </div>
        </Form>
    </Dialog>
</template>
<script setup>
import RadioButton from 'primevue/radiobutton';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Message from 'primevue/message';
import { Form } from '@primevue/forms';
import pb from '@/service/pocketbase.js';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { isUniqueItem } from '@/utils/validations.js';
import { z } from 'zod';
import { ref, defineProps, defineEmits, watch, computed } from 'vue';
const showModal = ref(false);
const emit = defineEmits(['closeModal', 'newChanges']);
const props = defineProps({
    visible: Boolean,
    memberData: {
        type: Object
    }
});
const errorDni = ref(false);
const loading = ref(false);
const initialValues = ref({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    dni: '',
    sexo: ''
});
const resolver = zodResolver(
    z.object({
        nombre: z
            .string()
            .nonempty({ message: 'El nombre es obligatorio.' })
            .min(5, { message: 'Debe tener al menos 5 caracteres' })
            .max(50, { message: 'No debe exceder 50 caracteres' }),
        apellido: z
            .string()
            .nonempty({ message: 'El apellido es obligatorio.' })
            .min(5, { message: 'Debe tener al menos 5 caracteres' })
            .max(30, { message: 'No debe exceder 30 caracteres' }),
        telefono: z.coerce
            .number()
            .min(1, { message: 'El teléfono es obligatorio.' })
            .max(999999999999, { message: 'No debe exceder 12 caracteres' }),
        direccion: z.string().optional(),
        id: z.string().optional(),
        dni: z.coerce
            .number()
            .min(1, { message: 'El dni es obligatorio.' })
            .max(99999999, { message: 'No debe exceder 8 caracteres' }),
        sexo: z.string().nonempty()
    })
);

const isEditMode = computed(() => {
    return props.memberData.length != 0 ? true : false;
});
watch(
    () => props.memberData,
    (newValue, oldValue) => {
        if (isEditMode.value) {
            initialValues.value = { ...newValue };
        } else {
            initialValues.value = {
                nombre: '',
                apellido: '',
                telefono: '',
                direccion: '',
                dni: '',
                sexo: ''
            };
        }
    },
    { immediate: true }
);
const closeModal = () => {
    emit('closeModal');
};
const onFormSubmit = async (e) => {
    if (e.valid) {
        const isUniqueDni = await isUniqueItem('miembros', 'dni', e.values.dni);
        if (isUniqueDni || e.values.dni == initialValues.value.dni) {
            try {
                loading.value = true;
                isEditMode.value
                    ? await pb.collection('miembros').update(e.values.id, e.values)
                    : await pb.collection('miembros').create(e.values);
                emit('newChanges', isEditMode.value);
                closeModal();
                errorDni.value = false;
            } catch (error) {
                console.log(error);
            } finally {
                loading.value = false;
            }
        } else {
            errorDni.value = true;
        }
    }
};
</script>
<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
