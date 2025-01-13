<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import pb from '@/service/pocketbase.js';
import { useIndexStore } from '@/storage/index.js';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';

const store = useIndexStore();
const loading = ref(false);
const toast = useToast();
const router = useRouter();

const checked = ref(false);

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
        try {
            loading.value = true;
            const authData = await pb
                .collection('users')
                .authWithPassword(e.values.email, e.values.password, {
                    expand: 'role, role.permisos',
                    fields: '*, expand.role.expand.permisos.permiso, expand.role.nombre, expand.role.id'
                });

            // guardando informacion de usuario
            store.setUserLogged(authData.record);

            // redireccion
            router.push({ name: 'dashboard' });
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

const googleLogin = async () => {
    try {
        loading.value = true;
        const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });

        // guardando informacion de usuario
        store.setUserLogged(authData.record);

        // redireccion
        router.push({ name: 'dashboard' });
    } catch (error) {
        console.error(error);

        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'Intentelo nuevamente',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <FloatingConfigurator />
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
    >
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
                    class="w-full px-8 pt-16 pb-12 bg-surface-0 dark:bg-surface-900 sm:px-20"
                    style="border-radius: 53px"
                >
                    <div class="mb-8 text-center">
                        <div
                            class="mb-1 text-3xl font-semibold text-surface-900 dark:text-surface-0"
                        >
                            ¡Bienvenido de nuevo!
                        </div>
                        <span class="text-muted-color">Ingrese para continuar</span>
                    </div>

                    <Button
                        class="w-full mb-3"
                        severity="secondary"
                        variant="outlined"
                        @click="googleLogin"
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                            alt=""
                            width="24px"
                        />
                        <span class="ml-1"> Continuar con Google </span>
                    </Button>

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

                        <div class="mb-2" v-auto-animate>
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

                        <div class="flex justify-end mb-8 text-sm">
                            <router-link to="/auth/forgot-password">
                                <span class="font-medium text-primary">
                                    ¿Olvidaste tu contraseña?
                                </span>
                            </router-link>
                        </div>
                        <Button
                            class="w-full mt-2 font-bold"
                            type="submit"
                            :loading="loading"
                            label="Iniciar sesión"
                        />

                        <div class="py-2 mt-4 text-center text-muted-color">
                            ¿No tienes una cuenta?

                            <router-link to="/auth/register">
                                <span class="ml-1 font-semibold underline text-primary">
                                    Registrate ahora
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
