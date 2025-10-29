<script setup>
import pb from '@/service/pocketbase.js';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';

const loading = ref(false);
const toast = useToast();
const router = useRouter();

const initialValues = ref({
    dni: null
});

const resolver = zodResolver(
    z.object({
        dni: z.coerce
            .number('El dni debe ser un número')
            .min(1, { message: 'El dni es obligatorio.' })
            .max(99999999, { message: 'No debe exceder 8 caracteres' })
    })
);

const onFormSubmit = async (e) => {
    if (e.valid) {
        try {
            loading.value = true;
            const result = await pb.collection('miembros_pagos').getFullList({
                filter: `dni = ${e.values.dni}`,
                fields: 'id,nombre,dni,fecha_vencimiento, sucursal_id, expand.sucursal_id.expand.gimnasio_id.id, expand.sucursal_id.expand.gimnasio_id.logo, expand.sucursal_id.expand.gimnasio_id.nombre, expand.sucursal_id.expand.gimnasio_id.collectionId',
                expand: 'sucursal_id, sucursal_id.gimnasio_id'
            });
            console.log(result);
            const member = {
                nombre: result[0].nombre,
                dni: result[0].dni,
                sucursales: result.map((item) => item.sucursal_id),
                gimnasios: result.map((item) => {
                    return {
                        fecha_vencimiento: item.fecha_vencimiento,
                        gimnasio: item?.expand?.sucursal_id?.expand.gimnasio_id
                    };
                })
            };
            localStorage.setItem('member', JSON.stringify(member));
            router.push({ name: 'dashboard-miembros' });
        } catch (error) {
            console.log(error);
            toast.add({
                severity: 'error',
                summary: 'Operación fallida',
                detail: 'Intentelo nuevamente',
                life: 3000
            });
        } finally {
            loading.value = false;
        }
    }
};
</script>

<template>
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
    >
        <div
            class="flex flex-col items-center justify-center animate-blurred-fade-in animate-delay-300"
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
            >
                <div
                    class="w-full px-10 pt-16 pb-12 bg-surface-0 dark:bg-surface-900"
                    style="border-radius: 53px"
                >
                    <div class="mb-8 text-center">
                        <img
                            src="@/assets/img/logo-white.png"
                            alt="Logo GymAdmin"
                            class="w-20 mx-auto"
                        />
                        <div
                            class="mb-1 text-3xl font-semibold text-surface-900 dark:text-surface-0"
                        >
                            ¡Bienvenido a GymAdmin!
                        </div>
                        <span class="text-muted-color">Ingrese para continuar</span>
                    </div>

                    <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
                        <div class="mb-7" v-auto-animate>
                            <label
                                for="dni"
                                class="block mb-1 font-medium text-surface-900 dark:text-surface-0"
                            >
                                DNI
                            </label>
                            <InputNumber
                                name="dni"
                                id="dni"
                                placeholder="Ingrese su DNI"
                                class="w-full md:w-[30rem] mb-2"
                            />

                            <Message
                                v-if="$form.dni?.invalid"
                                severity="error"
                                size="small"
                                variant="simple"
                            >
                                {{ $form.dni.error.message }}
                            </Message>
                        </div>

                        <Button
                            class="w-full mt-2 font-bold"
                            type="submit"
                            :loading="loading"
                            label="Iniciar sesión"
                        />
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>
