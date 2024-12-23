<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useLayout } from '@/layout/composables/layout';
import pb from '@/service/pocketbase';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { z } from 'zod';
const { isDarkTheme } = useLayout();

const route = useRoute();
const toast = useToast();
const loading = ref(false);
const initialValues = ref({ email: '', password: '', passwordConfirm: '' });
const step = computed(() => (route.query?.token?.length > 0 ? 2 : 1));

const resolver = zodResolver(
    z.object({
        email: z.string().email({ message: 'Correo electrónico inválido' }),
        password: z
            .string()
            .min(3, { message: 'Mínimo 3 caracteres.' })
            .max(20, { message: 'No debe exceder 20 caracteres.' }),
        passwordConfirm: z.string().min(3, { message: 'Mínimo 3 caracteres.' })
    })
);

const onFormSubmit = async (e) => {
    if (e.valid) {
        try {
            loading.value = true;
            step.value == 1
                ? await pb.collection('users').requestPasswordReset(e.values.email)
                : await pb
                      .collection('users')
                      .confirmPasswordReset(
                          route.query.token,
                          e.values.password,
                          e.values.passwordConfirm
                      );

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
                                {{
                                    step == 1
                                        ? '¿Olvidaste tu contraseña?'
                                        : 'Restablecer contraseña'
                                }}
                            </h1>
                            <p class="text-center text-muted-color" v-if="step == 1">
                                No te preocupes, te enviaremos instrucciones de reinicio.
                            </p>
                        </div>

                        <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
                            <div class="flex flex-col gap-2 mb-3" v-auto-animate v-if="step == 1">
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

                            <section v-else>
                                <div class="flex flex-col gap-2 mb-5" v-auto-animate>
                                    <label for="password">
                                        Nueva contraseña
                                        <span class="text-red-400">*</span>
                                    </label>
                                    <Password
                                        name="password"
                                        id="password"
                                        v-model="password"
                                        placeholder="* * * * * * * * *"
                                        :toggleMask="true"
                                        class="w-full md:w-[30rem] mb-2"
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

                                <div class="flex flex-col gap-1 mb-5" v-auto-animate>
                                    <label for="passwordConfirm">
                                        Confirmar contraseña
                                        <span class="text-red-400">*</span>
                                    </label>
                                    <Password
                                        name="passwordConfirm"
                                        id="passwordConfirm"
                                        v-model="passwordConfirm"
                                        placeholder="* * * * * * * * *"
                                        :toggleMask="true"
                                        class="w-full md:w-[30rem] mb-2"
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
                            </section>

                            <Button
                                class="w-full mt-2 font-bold"
                                type="submit"
                                :loading="loading"
                                :label="(step == 1 ? 'Restablecer' : 'Guardar') + ' contraseña'"
                            />
                        </Form>

                        <Button
                            class="w-full mt-4"
                            type="submit"
                            variant="text"
                            severity="secondary"
                            as="router-link"
                            to="/auth/login"
                            v-if="step == 1"
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
