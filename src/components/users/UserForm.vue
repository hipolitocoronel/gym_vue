<script setup>
import pb from '@/service/pocketbase.js';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { computed, defineEmits, defineProps, ref } from 'vue';
import { z } from 'zod';

const emit = defineEmits(['closeModal', 'reloadData']);
const toast = useToast();

const props = defineProps({
    visible: Boolean,
    data: Object
});

const loading = ref(false);
const initialValues = ref({
    name: '',
    email: '',
    phone: null,
    password: '',
    passwordConfirm: ''
});

const resolver = zodResolver(
    z
        .object({
            name: z
                .string()
                .nonempty({ message: 'El nombre es obligatorio.' })
                .min(5, { message: 'Debe tener al menos 5 caracteres' })
                .max(50, { message: 'No debe exceder 50 caracteres' }),
            email: z.string().email({ message: 'Correo electrónico inválido' }),
            phone: z.coerce
                .number()
                .min(1, { message: 'El teléfono es obligatorio.' })
                .max(999999999999, { message: 'No debe exceder 12 caracteres' }),
            password: z
                .string()
                .min(3, { message: 'Mínimo 3 caracteres.' })
                .max(20, { message: 'No debe exceder 20 caracteres.' }),
            passwordConfirm: z.string().min(3, { message: 'Mínimo 3 caracteres.' })
        })
        .refine((data) => data.password === data.passwordConfirm, {
            message: 'Las contraseñas no coinciden.',
            path: ['passwordConfirm']
        })
);

const isEditMode = computed(() => (props.data?.id ? true : false));

const onFormSubmit = async (e) => {
    if (e.valid) {
        try {
            loading.value = true;
            isEditMode.value
                ? await pb.collection('users').update(e.values.id, e.values)
                : await pb.collection('users').create({ ...e.values, emailVisibility: true });

            toast.add({
                severity: 'success',
                summary: 'Operación exitosa!',
                detail: 'Usuario guardado correctamente!',
                life: 3000
            });

            emit('closeModal');
            emit('reloadData');
        } catch (error) {
            console.log(error);
            toast.add({
                severity: 'error',
                summary: 'Operación fallida!',
                detail: 'Favor, inténtelo nuevamente',
                life: 3000
            });
        } finally {
            loading.value = false;
        }
    }
};
</script>

<template>
    <Dialog
        v-model:visible="props.visible"
        modal
        @update:visible="emit('closeModal')"
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
            <div class="flex flex-col gap-1" v-auto-animate>
                <label for="name">Nombre</label>
                <InputText
                    id="name"
                    name="name"
                    placeholder="Ej: Juan Perez"
                    fluid
                    autocomplete="off"
                />

                <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.name.error.message }}
                </Message>
            </div>

            <div class="flex flex-col gap-1" v-auto-animate>
                <label for="email">Correo</label>
                <InputText
                    id="email"
                    name="email"
                    placeholder="ejemplo@ejemplo.com"
                    fluid
                    type="email"
                    autocomplete="off"
                />

                <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.email.error.message }}
                </Message>
            </div>

            <div class="flex flex-col gap-1" v-auto-animate>
                <label for="phone">Teléfono</label>
                <InputText
                    id="telefono"
                    type="number"
                    name="phone"
                    fluid
                    placeholder="Ingrese su número telefónico"
                    autocomplete="off"
                />

                <Message v-if="$form.phone?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.phone.error.message }}
                </Message>
            </div>

            <div class="flex gap-4">
                <div class="flex flex-col gap-1" v-auto-animate>
                    <label for="password">Contraseña</label>
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
                        v-if="$form.password?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.password.error.message }}
                    </Message>
                </div>

                <div class="flex flex-col gap-1" v-auto-animate>
                    <label for="passwordConfirm">Confirmar contraseña</label>
                    <Password
                        name="passwordConfirm"
                        id="passwordConfirm"
                        v-model="passwordConfirm"
                        placeholder="* * * * * * * * *"
                        :toggleMask="true"
                        class="mb-2"
                        fluid
                        :feedback="false"
                    />

                    <Message
                        v-if="$form.passwordConfirm?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.passwordConfirm.error.message }}
                    </Message>
                </div>
            </div>

            <div class="flex justify-end gap-2 mt-1">
                <Button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    @click="emit('closeModal')"
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
