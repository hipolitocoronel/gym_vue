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

// Valores iniciales como un computed
const initialValues = computed(() => {
    return {
        name: props.data?.name ?? '',
        email: props.data?.email ?? '',
        phone: props.data?.phone ?? null,
        password: '',
        passwordConfirm: ''
    };
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

const onFormSubmit = async (e) => {
    if (e.valid) {
        try {
            loading.value = true;

            payload.emailVisibility = true;
            await pb.collection('users').create(e.values);

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
    <h2 class="pt-4 mb-2 text-xl font-bold"><span class="mr-2">1.</span> Infomación personal</h2>
    <Form
        v-slot="$form"
        :initialValues
        :resolver
        @submit="onFormSubmit"
        class="flex flex-col justify-center gap-4"
    >
        <div class="flex flex-col gap-1" v-auto-animate>
            <label for="name">Nombre <span class="text-red-400">*</span></label>
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
            <label for="email">Correo <span class="text-red-400">*</span></label>
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
            <label for="phone">Teléfono <span class="text-red-400">*</span></label>
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
    </Form>
</template>

<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
