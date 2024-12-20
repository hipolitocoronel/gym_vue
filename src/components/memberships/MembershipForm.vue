<template>
    <Dialog
        v-model:visible="props.visible"
        modal
        @update:visible="closeModal"
        :header="isEditMode ? 'Editar Membresía' : 'Agregar Membresía'"
        :style="{ width: '30rem' }"
    >
        <Form
            v-slot="$form"
            :initialValues
            :resolver
            @submit="onFormSubmit"
            class="flex justify-center flex-col gap-4"
        >
            <InputText v-if="isEditMode" id="id" name="id" class="hidden" />
            <div class="flex flex-col gap-1">
                <label for="name">Nombre</label>
                <InputText
                    id="name"
                    name="nombre"
                    placeholder="Ej: Plan Basico"
                    fluid
                    autocomplete="off"
                />

                <Message
                    v-if="$form.nombre?.invalid || errorName"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{
                        errorName
                            ? 'Ya existe una membresia con este nombre'
                            : $form.nombre.error.message
                    }}
                </Message>
            </div>
            <div class="flex flex-col gap-1">
                <label for="precio">Precio</label>
                <InputNumber
                    inputId="precio"
                    name="precio"
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                    placeholder="Ingrese el precio"
                    fluid
                />

                <Message v-if="$form.precio?.invalid" severity="error" size="small" variant="simple"
                    >{{ $form.precio.error.message }}
                </Message>
            </div>
            <div class="flex flex-col gap-1">
                <label for="descripcion">Descripción</label>
                <Textarea
                    placeholder="Ej: Acceso a maquinas y mancuernas"
                    style="resize: none"
                    id="descripcion"
                    name="descripcion"
                    rows="5"
                />
            </div>
            <div class="flex justify-end gap-2 mt-1">
                <Button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    :disabled="loading"
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
import { Form } from '@primevue/forms';
import pb from '@/service/pocketbase.js';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';
import { ref, defineProps, defineEmits, watch, computed } from 'vue';
const toast = useToast();
const showModal = ref(false);
const emit = defineEmits(['closeModal', 'newChanges']);
const props = defineProps({
    visible: Boolean,
    membershipData: Object
});
const errorName = ref(false);
const loading = ref(false);
const initialValues = ref({
    nombre: '',
    descripcion: '',
    precio: null
});
const resolver = zodResolver(
    z.object({
        nombre: z
            .string()
            .nonempty({ message: 'El nombre es obligatorio.' })
            .min(5, { message: 'Debe tener al menos 5 caracteres' })
            .max(50, { message: 'No debe exceder 50 caracteres' }),
        precio: z.coerce
            .number('El precio debe ser un número')
            .min(1, { message: 'El precio es obligatorio.' }),
        descripcion: z.string().optional(),
        id: z.string().optional()
    })
);

const isEditMode = computed(() => {
    return props.membershipData.length != 0 ? true : false;
});
watch(
    () => props.membershipData,
    (newValue) => {
        if (isEditMode.value) {
            initialValues.value = { ...newValue };
        } else {
            initialValues.value = {
                nombre: '',
                descripcion: '',
                precio: null
            };
        }
    },
    { immediate: true }
);
const closeModal = () => {
    errorName.value = false;
    emit('closeModal');
};
const onFormSubmit = async (e) => {
    if (e.valid) {
        try {
            const membershipData = e.values;
            loading.value = true;
            isEditMode.value
                ? await pb.collection('membresias').update(membershipData.id, membershipData)
                : await pb.collection('membresias').create(membershipData);
            closeModal();
            emit('newChanges', isEditMode.value);
        } catch (error) {
            if (error.response?.data?.nombre?.code === 'validation_not_unique') {
                errorName.value = true;
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Operación fallida',
                    detail: 'Intentelo nuevamente',
                    life: 3000
                });
            }
        } finally {
            loading.value = false;
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
