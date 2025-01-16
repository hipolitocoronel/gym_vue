<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
import { useRegisterStore } from '@/storage/register.js';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { z } from 'zod';

const store = useRegisterStore();
const loading = ref(false);
const toast = useToast();
const router = useRouter();
const route = useRoute();

const initialValues = ref({
    email: '',
    password: ''
});

const resolver = zodResolver(
    z.object({
        email: z.string().email({ message: 'Correo electrónico inválido' }),
        password: z.string().min(3, { message: 'Mínimo 3 caracteres.' })
    })
);

const onFormSubmit = async (e) => {
    if (e.valid) {
        // guardando informacion de usuario
        const { email, password } = e.values;

        store.updateField(1, 'email', email);
        store.updateField(1, 'password', password);

        // redireccion
        router.push({ name: 'completar-registro', query: route.query });
    }
};

const googleCallback = (res) => {
    const baseUrl = import.meta.env.VITE_GOOGLE_API;

    axios
        .get(baseUrl, {
            headers: {
                Authorization: `Bearer ${res?.access_token}`
            }
        })
        .then((res) => {
            const { name, email } = res.data;
            store.updateField(1, 'name', name);
            store.updateField(1, 'email', email);

            // redireccion
            router.push({ name: 'completar-registro', query: route.query });
        });
};

console.log(route.query);
</script>

<template>
    <FloatingConfigurator />
    <TopbarWidget />
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
    >
        <div
            class="flex flex-col items-center justify-center flex-1 px-2 animate-blurred-fade-in animate-delay-300 max-w-[600px]"
        >
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
                class="w-full"
            >
                <div
                    class="pb-10 px-7 pt-14 sm:pt-16 sm:pb-12 sm:px-20 bg-surface-0 dark:bg-surface-900"
                    style="border-radius: 53px"
                >
                    <div class="mb-8 text-center">
                        <div
                            class="mb-1 text-3xl font-semibold text-surface-900 dark:text-surface-0"
                        >
                            ¡Comenzar ahora!
                        </div>
                        <span class="text-muted-color">Crear una nueva cuenta</span>
                    </div>

                    <GoogleLogin :callback="googleCallback" class="w-full" popup-type="TOKEN">
                        <Button class="w-full mb-3" severity="secondary" variant="outlined">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                                alt=""
                                width="24px"
                            />
                            <span class="ml-1"> Continuar con Google </span>
                        </Button>
                    </GoogleLogin>

                    <Divider><span class="text-sm text-muted-color">O también</span></Divider>

                    <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
                        <div class="mb-7" v-auto-animate>
                            <label
                                for="email"
                                class="block mb-1 font-medium text-surface-900 dark:text-surface-0"
                            >
                                Correo
                            </label>
                            <InputText
                                name="email"
                                id="email"
                                type="text"
                                placeholder="Correo electrónico"
                                class="w-full mb-2"
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

                        <div class="mb-9" v-auto-animate>
                            <label
                                for="password"
                                class="block mb-1 font-medium text-surface-900 dark:text-surface-0"
                            >
                                Contraseña
                            </label>
                            <Password
                                name="password"
                                id="password"
                                v-model="password"
                                placeholder="Contraseña"
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

                        <Button
                            class="w-full mt-2 font-bold"
                            type="submit"
                            :loading="loading"
                            label="Registrarse"
                        />

                        <div class="py-2 mt-4 text-center text-muted-color">
                            ¿Ya tienes una cuenta?

                            <router-link to="/auth/login">
                                <span class="ml-1 font-semibold underline text-primary">
                                    Ingresar ahora
                                </span>
                            </router-link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
