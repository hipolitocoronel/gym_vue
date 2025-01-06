<script setup>
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { computed, defineExpose, ref } from 'vue';
import { z } from 'zod';

const store = useIndexStore();
const src = ref(store.srcLogoGym);
const logo = ref(null);
const loading = ref(false);
const toast = useToast();
const form = ref(null);

// Valores iniciales como un computed
const initialValues = computed(() => {
    src.value = store.srcLogoGym;
    return {
        nombre: store.currentGym?.nombre || '',
        correo: store.currentGym?.correo || '',
        telefono: store.currentGym?.telefono || null
    };
});

const resolver = zodResolver(
    z.object({
        nombre: z.string().min(3, { message: 'Mínimo 4 caracteres.' }),
        correo: z
            .string()
            .email({ message: 'Correo electrónico inválido' })
            .optional()
            .or(z.literal('')),
        telefono: z
            .number({ message: 'El teléfono es obligatorio.' })
            .min(1, { message: 'El teléfono es obligatorio.' })
            .max(999999999999, { message: 'No debe exceder 12 caracteres' })
            .optional()
            .nullable()
    })
);

function onFileSelect(event) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        src.value = e.target.result;
    };

    reader.readAsDataURL(file);
    logo.value = file;
}

const onFormSubmit = async (e) => {
    if (e.valid) {
        try {
            const payload = { ...e.values, logo: logo.value };
            loading.value = true;

            if (!logo.value && src.value) {
                delete payload.logo;
            }

            const gymUpdated = await pb
                .collection('gimnasios')
                .update(store.currentGym.id, payload);

            // guardando informacion de usuario
            store.setCurrentGym(gymUpdated);

            toast.add({
                severity: 'success',
                summary: 'Operación exitosa!',
                detail: 'Los cambios se guardaron correctamente.',
                life: 3000
            });
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

const validate = async () => {
    const { errors } = await form.value.validate();
    return Object.keys(errors).length === 0;
};

defineExpose({ validate });
</script>
<template>
    <h2 class="pt-4 mb-2 text-xl font-bold">
        <span class="mr-2">2.</span> Infomación del gimnasio
    </h2>
    <div class="flex gap-7">
        <div class="flex flex-col w-64 gap-3 my-3">
            <div
                class="relative h-full border rounded-lg bg-surface-50 dark:bg-surface-950 aspect-square border-surface-700"
            >
                <div class="flex items-center justify-center h-full" v-if="!src">
                    <i class="pi pi-images text-muted-color" style="font-size: 4.5rem"></i>
                </div>
                <img :src="src" class="object-cover w-full h-full" alt="logo" v-else />

                <div class="absolute bottom-1 right-1">
                    <FileUpload
                        mode="basic"
                        @select="onFileSelect"
                        customUpload
                        auto
                        chooseLabel="Subir"
                        chooseIcon="pi pi-cloud-upload"
                        :chooseButtonProps="{
                            class: 'p-button-success p-button-sm'
                        }"
                        v-if="!src"
                    />

                    <Button
                        icon="pi pi-trash"
                        severity="danger"
                        label="Quitar"
                        @click="src = null"
                        class="w-full"
                        size="small"
                        v-else
                    />
                </div>
            </div>

            <div class="text-muted-color">
                <p class="text-sm">Imagen no mayor a 4MB</p>
                <p class="text-xs">Resolución recomendada: 1000x1000</p>
            </div>
        </div>

        <Form
            v-slot="$form"
            :initialValues
            :resolver
            class="flex-1 flex-shrink"
            ref="form"
            @submit="onFormSubmit"
        >
            <div class="flex flex-col flex-1 gap-1 mb-4" v-auto-animate>
                <label for="nombre">Nombre <span class="text-red-400">*</span></label>
                <InputText name="nombre" id="password" placeholder="Nombre" class="mb-2">
                </InputText>

                <Message
                    v-if="$form.nombre?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    {{ $form.nombre.error.message }}
                </Message>
            </div>

            <div class="flex flex-col flex-1 gap-1 mb-4" v-auto-animate>
                <label for="correo">Correo electrónico</label>
                <InputText
                    name="correo"
                    id="correo"
                    placeholder="ejemplo@ejemplo.com"
                    class="mb-2"
                />

                <Message
                    v-if="$form.correo?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    {{ $form.correo.error.message }}
                </Message>
            </div>

            <div class="flex flex-col flex-1 gap-1 mb-4" v-auto-animate>
                <label for="telefono">Teléfono</label>
                <InputNumber
                    name="telefono"
                    id="telefono"
                    placeholder="Ej: 3794123456"
                    :useGrouping="false"
                    class="mb-2"
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
        </Form>
    </div>
</template>
