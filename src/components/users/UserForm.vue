<script setup>
import pb from '@/service/pocketbase.js';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { computed, defineEmits, defineProps, ref } from 'vue';
import { z } from 'zod';

const emit = defineEmits(['closeModal', 'newChanges']);

const props = defineProps({
    visible: Boolean,
    memberData: Object
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

<template>
    <Dialog
        v-model:visible="props.visible"
        modal
        @update:visible="closeModal"
        :header="isEditMode ? 'Editar Miembro' : 'Nuevo usuario'"
        :style="{ width: '36rem' }"
    >
        <Form
            v-slot="$form"
            :initialValues
            :resolver
            @submit="onFormSubmit"
            class="flex flex-col justify-center gap-4"
        >
            <div class="flex flex-col gap-1">
                <label for="name">Nombre</label>
                <InputText
                    id="name"
                    name="name"
                    placeholder="Ej: Juan Perez"
                    fluid
                    autocomplete="off"
                />

                <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple"
                    >{{ $form.nombre.error.message }}
                </Message>
            </div>

            <div class="flex flex-col gap-1">
                <label for="email">Correo</label>
                <InputText
                    id="email"
                    name="email"
                    placeholder="ejemplo@ejemplo.com"
                    fluid
                    type="email"
                    autocomplete="off"
                />

                <Message
                    v-if="$form.apellido?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.apellido.error.message }}
                </Message>
            </div>

            <div class="flex flex-col gap-1">
                <label for="phone">Teléfono</label>
                <InputText
                    id="telefono"
                    type="number"
                    name="telefono"
                    fluid
                    placeholder="Ingrese su número telefónico"
                    autocomplete="off"
                />

                <Message
                    v-if="$form.telefono?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    {{ $form.telefono.error.message }}
                </Message>
            </div>

            <div class="flex gap-4">
                <div class="flex flex-col gap-1">
                    <label for="phone">Contraseña</label>
                    <Password
                        name="password"
                        id="password"
                        v-model="password"
                        placeholder="* * * * * * * * *"
                        :toggleMask="true"
                        class="mb-2"
                        fluid
                        :feedback="false"
                    >
                    </Password>

                    <Message
                        v-if="$form.telefono?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.telefono.error.message }}
                    </Message>
                </div>

                <div class="flex flex-col gap-1">
                    <label for="phone">Confirmar contraseña</label>
                    <Password
                        name="password"
                        id="password"
                        v-model="password"
                        placeholder="* * * * * * * * *"
                        :toggleMask="true"
                        class="mb-2"
                        fluid
                        :feedback="false"
                    />

                    <Message
                        v-if="$form.telefono?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.telefono.error.message }}
                    </Message>
                </div>
            </div>

            <div class="flex justify-end gap-2 mt-1">
                <Button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    @click="closeModal"
                ></Button>
                <Button label="Guardar" :loading="loading" type="submit"></Button>
            </div>
        </Form>
    </Dialog>
</template>

<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
