<template>
    <Dialog
        v-model:visible="props.visible"
        modal
        @update:visible="closeModal"
        :header="isEditMode ? 'Editar Miembro' : 'Agregar Miembro'"
        :style="{ width: '38rem' }"
    >
        <Form
            v-slot="$form"
            :initialValues
            :resolver
            @submit="onFormSubmit"
            class="flex justify-center flex-col gap-4"
        >
            <InputText v-if="isEditMode" id="id" name="id" class="hidden" />
            <div class="flex flex-col gap-1" v-auto-animate>
                <label for="name">Nombre</label>
                <InputText
                    id="name"
                    name="nombre"
                    placeholder="Ej: Juan Perez"
                    fluid
                    autocomplete="off"
                />

                <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple"
                    >{{ $form.nombre.error.message }}
                </Message>
            </div>

            <div class="flex flex-col gap-1" v-auto-animate>
                <label for="direction">Dirección</label>
                <InputText
                    id="direction"
                    name="direccion"
                    placeholder="Ej: Independencia 127"
                    fluid
                    autocomplete="off"
                />

                <Message
                    v-if="$form.direccion?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.direccion.error.message }}
                </Message>
            </div>
            <Fluid>
                <div class="grid grid-cols-2 gap-4 grow">
                    <div class="flex flex-col gap-1" v-auto-animate>
                        <label for="dni">DNI</label>
                        <InputNumber
                            id="dni"
                            name="dni"
                            type="number"
                            placeholder="Ingrese el DNI"
                            fluid
                            autocomplete="off"
                        />

                        <Message
                            v-if="$form.dni?.invalid || errorDni"
                            severity="error"
                            size="small"
                            variant="simple"
                            >{{ errorDni ? 'DNI ya registrado' : $form.dni.error.message }}</Message
                        >
                    </div>
                    <div class="flex flex-col gap-1" v-auto-animate>
                        <label for="phone">Telefono</label>
                        <InputNumber
                            id="phone"
                            name="telefono"
                            placeholder="Ingrese el teléfono"
                            fluid
                            :useGrouping="false"
                            type="number"
                            autocomplete="off"
                        />

                        <Message
                            v-if="$form.telefono?.invalid"
                            severity="error"
                            size="small"
                            variant="simple"
                            >{{ $form.telefono.error.message }}
                        </Message>
                    </div>
                </div>
            </Fluid>
            <div class="flex flex-col gap-1" v-auto-animate>
                <label for="sexo">Sexo</label>
                <RadioButtonGroup
                    :invalid="$form.sexo?.invalid"
                    name="sexo"
                    id="sexo"
                    class="flex gap-4"
                >
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
                <Message
                    v-if="$form.sexo?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.sexo.error.message }}</Message
                >
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
import pb from '@/service/pocketbase.js';
import { useIndexStore } from '@/storage';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { computed, defineEmits, defineProps, ref } from 'vue';
import { z } from 'zod';
const toast = useToast();
const store = useIndexStore();
const emit = defineEmits(['closeModal', 'newChanges']);
const props = defineProps({
    visible: Boolean,
    memberData: {
        type: Object,
        default: []
    }
});
const errorDni = ref(false);
const loading = ref(false);

const resolver = zodResolver(
    z.object({
        nombre: z
            .string()
            .nonempty({ message: 'El nombre es obligatorio.' })
            .min(5, { message: 'Debe tener al menos 5 caracteres' })
            .max(50, { message: 'No debe exceder 50 caracteres' }),
        telefono: z.coerce
            .number('El telefono debe ser un número')
            .min(1, { message: 'El teléfono es obligatorio.' })
            .max(999999999999, { message: 'No debe exceder 12 caracteres' }),
        direccion: z.string().optional(),
        id: z.string().optional(),
        dni: z.coerce
            .number('El dni debe ser un número')
            .min(1, { message: 'El dni es obligatorio.' })
            .max(99999999, { message: 'No debe exceder 8 caracteres' }),
        sexo: z.string().nonempty({ message: 'El sexo es obligatorio.' })
    })
);

const isEditMode = computed(() => {
    return props.memberData.length != 0 ? true : false;
});

const initialValues = computed(() => {
    return {
        id: props.memberData?.id || '',
        nombre: props.memberData?.nombre || '',
        telefono: props.memberData?.telefono || null,
        direccion: props.memberData?.direccion || '',
        dni: props.memberData?.dni || null,
        sexo: props.memberData?.sexo || ''
    };
});

const closeModal = () => {
    errorDni.value = false;
    emit('closeModal');
};
const onFormSubmit = async (e) => {
    if (e.valid) {
        const payload = { ...e.values, sucursal_id: store.currentSucursal.id };
        try {
            let member;
            loading.value = true;
            isEditMode.value
                ? (member = await pb.collection('miembros').update(payload.id, payload))
                : (member = await pb.collection('miembros').create(payload));
            closeModal();
            emit('newChanges', isEditMode.value, member);
        } catch (error) {
            if (error.response?.data?.dni?.code === 'validation_not_unique') {
                const member = await pb
                    .collection('miembros')
                    .getFirstListItem(`dni="${payload.dni}"`);
                if (!member.deleted) {
                    errorDni.value = true;
                } else {
                    member.deleted = null;
                    await pb.collection('miembros').update(member.id, member);
                    closeModal();
                    emit('newChanges', isEditMode.value);
                }
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
            if (errorDni.value) {
                setTimeout(() => {
                    errorDni.value = false;
                }, 3000);
            }
        }
    }
};
</script>
