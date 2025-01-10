<script setup>
import { useRegisterStore } from '@/storage/register.js';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { defineEmits, ref } from 'vue';
import { z } from 'zod';

const emit = defineEmits(['closeModal', 'reloadData']);
const store = useRegisterStore();
const form = ref(null);

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

const validate = async () => {
    await form.value.onSubmit();
    const { errors } = await form.value.validate();
    return Object.keys(errors).length === 0;
};

defineExpose({ validate });
</script>

<template>
    <h2 class="pt-4 mb-2 text-xl font-bold"><span class="mr-2">1.</span> Infomación personal</h2>
    <Form
        ref="form"
        v-slot="$form"
        :initialValues="store.formData[1]"
        :resolver
        @submit="(e) => store.fillRegisterForm(1, e.values)"
        class="flex flex-col justify-center gap-5"
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
            <label for="email">Correo electrónico <span class="text-red-400">*</span></label>
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

        <div class="flex gap-4">
            <div class="flex flex-col flex-1 gap-1" v-auto-animate>
                <label for="password">Contraseña <span class="text-red-400">*</span></label>
                <Password
                    name="password"
                    id="password"
                    v-model="password"
                    placeholder="Ingrese una contraseña"
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

            <div class="flex flex-col flex-1 gap-1" v-auto-animate>
                <label for="passwordConfirm">
                    Confirmar contraseña <span class="text-red-400">*</span>
                </label>
                <Password
                    name="passwordConfirm"
                    id="passwordConfirm"
                    v-model="passwordConfirm"
                    placeholder="Favor de confirmar contraseña"
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
    </Form>
</template>

<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
