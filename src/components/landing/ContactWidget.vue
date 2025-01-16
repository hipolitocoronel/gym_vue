<template>
    <div class="grid grid-cols-12 py-16 mt-8 xl:mx-32" id="contact">
        <div class="hidden col-span-12 mt-10 md:col-span-6 lg:block">
            <img src="@/assets/img/persona-fitness.webp" alt="Persona fitness" />
        </div>
        <div class="col-span-12 lg:col-span-6 mt-14 md:mt-20">
            <h2 class="mb-4 text-4xl font-bold text-center sm:text-5xl">Contáctanos</h2>
            <Form
                v-slot="$form"
                :initialValues
                :resolver
                @submit="onFormSubmit"
                class="flex flex-col gap-4 p-8"
            >
                <div class="flex flex-col gap-1" v-auto-animate>
                    <label for="name">Nombre Completo</label>
                    <InputText
                        id="name"
                        name="nombre"
                        placeholder="Tu nombre"
                        fluid
                        v-model="initialValues.nombre"
                        autocomplete="off"
                    />

                    <Message
                        v-if="$form.nombre?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.nombre.error.message }}
                    </Message>
                </div>

                <div class="flex flex-col gap-1" v-auto-animate>
                    <label for="email">Correo</label>
                    <InputText
                        id="email"
                        name="email"
                        placeholder="tu@email.com"
                        fluid
                        v-model="initialValues.email"
                        type="email"
                        autocomplete="off"
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
                <div class="flex flex-col gap-1" v-auto-animate>
                    <label for="telefono">Teléfono</label>
                    <InputText
                        name="telefono"
                        fluid
                        type="number"
                        v-model="initialValues.telefono"
                        id="telefono"
                        placeholder="Tu teléfono"
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
                <div class="flex flex-col gap-1" v-auto-animate>
                    <label for="mensaje">Consulta</label>
                    <Textarea
                        id="mensaje"
                        name="mensaje"
                        fluid
                        v-model="initialValues.mensaje"
                        rows="5"
                        class="resize-none"
                        placeholder="Ingrese su consulta"
                        autocomplete="off"
                    />

                    <Message
                        v-if="$form.mensaje?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.mensaje.error.message }}
                    </Message>
                </div>
                <div class="flex justify-end mt-1">
                    <Button :loading="loading" class="!font-semibold !px-5" type="submit"
                        >Enviar</Button
                    >
                </div>
            </Form>
        </div>
    </div>
</template>
<script setup>
import pb from '@/service/pocketbase';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { z } from 'zod';

const toast = useToast();

const loading = ref(false);

const initialValues = ref({
    nombre: '',
    email: '',
    telefono: null,
    mensaje: ''
});

const resolver = zodResolver(
    z.object({
        nombre: z
            .string()
            .nonempty({ message: 'El nombre es obligatorio.' })
            .min(5, { message: 'Debe tener al menos 5 caracteres' })
            .max(50, { message: 'No debe exceder 50 caracteres' }),
        email: z.string().email({ message: 'Correo electrónico inválido' }),
        telefono: z.coerce
            .number()
            .min(1, { message: 'El teléfono es obligatorio.' })
            .max(999999999999, { message: 'No debe exceder 12 caracteres' }),
        mensaje: z
            .string()
            .nonempty({ message: 'El mensaje es obligatorio.' })
            .min(10, { message: 'La consulta debe tener al menos 10 caracteres.' })
    })
);

const onFormSubmit = async (e) => {
    if (e.valid) {
        try {
            loading.value = true;
            await pb.collection('consultas').create(e.values);
            toast.add({
                severity: 'success',
                summary: 'Operación exitosa!',
                detail: 'Consulta generada correctamente!',
                life: 3000
            });
            e.reset();
            initialValues.value = {
                nombre: '',
                email: '',
                telefono: null,
                mensaje: ''
            };
        } catch (error) {
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
<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
