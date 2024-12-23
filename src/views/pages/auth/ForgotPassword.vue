<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useLayout } from '@/layout/composables/layout';
import pb from '@/service/pocketbase';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { z } from 'zod';
const { isDarkTheme } = useLayout();

const toast = useToast();
const loading = ref(false);
const initialValues = ref({ email: '', password: '', passwordConfirm: '' });

const resolver = zodResolver(
    z.object({
        email: z.string().email({ message: 'Correo electrónico inválido' })
    })
);

const onFormSubmit = async (e) => {
    if (e.valid) {
        try {
            loading.value = true;
            await pb.collection('users').requestPasswordReset(e.values.email);

            // redireccion
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Operación fallida',
                detail: 'Intentelo nuevamente',
                life: 3000
            });

            console.error(error);
        } finally {
            loading.value = false;
        }
    }
};
</script>
<template>
    <FloatingConfigurator />
    <main class="flex flex-col items-center justify-center w-screen h-screen">
        <div class="flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div
                    style="
                        border-radius: 56px;
                        padding: 0.3rem;
                        background: linear-gradient(
                            180deg,
                            var(--primary-color) 10%,
                            rgba(33, 150, 243, 0) 30%
                        );
                    "
                >
                    <div
                        class="w-full px-8 py-10 bg-surface-0 dark:bg-surface-950 sm:px-16"
                        style="border-radius: 53px"
                    >
                        <div class="flex items-center justify-center">
                            <img
                                :src="
                                    isDarkTheme
                                        ? '/src/assets/img/logo-white.png'
                                        : '/src/assets/img/logo-black.png'
                                "
                                alt="Logo"
                                width="70px"
                            />
                        </div>

                        <div class="mt-6 mb-8">
                            <h1 class="mb-2 text-2xl font-bold text-center">
                                ¿Olvidaste tu contraseña?
                            </h1>
                            <p class="text-center text-muted-color">
                                No te preocupes, te enviaremos instrucciones de reinicio.
                            </p>
                        </div>

                        <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
                            <div class="flex flex-col gap-2 mb-3" v-auto-animate>
                                <label for="email">Correo electrónico</label>
                                <InputText
                                    name="email"
                                    id="email"
                                    type="text"
                                    placeholder="ejemplo@ejemplo.com"
                                    class="w-full md:w-[30rem] mb-2"
                                    v-model="email"
                                />

                                <Message
                                    v-if="$form.email?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                >
                                    {{ $form.email.error.message }}
                                </Message>
                            </div>

                            <Button
                                class="w-full mt-2 font-bold"
                                type="submit"
                                :loading="loading"
                                label="Restablecer contraseña"
                            />
                        </Form>

                        <Button
                            class="w-full mt-4"
                            type="submit"
                            variant="text"
                            severity="secondary"
                            as="router-link"
                            to="/auth/login"
                        >
                            <i class="pi pi-arrow-left"></i>
                            Volver al inicio
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
