<script setup>
import { useRegisterStore } from '@/storage/register';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { defineExpose, ref } from 'vue';
import { z } from 'zod';

const store = useRegisterStore();
const src = ref(null);
const toast = useToast();
const form = ref(null);

const resolver = zodResolver(
    z.object({
        nombre: z.string().min(3, { message: 'Mínimo 4 caracteres.' }),
        correo: z.string().email({ message: 'Correo electrónico inválido' }),
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
        store.updateField(2, 'src', e.target.result);
    };

    reader.readAsDataURL(file);
    store.updateField(2, 'logo', file);
}

const removeLogo = () => {
    src.value = null;
    store.updateField(2, 'logo', null);
    store.updateField(2, 'src', null);
};

const validate = async () => {
    await form.value.onSubmit();
    const { errors } = await form.value.validate();
    return Object.keys(errors).length === 0;
};

defineExpose({ validate });
</script>
<template>
    <h2 class="pt-4 mb-2 text-xl font-bold">
        <span class="mr-2">2.</span> Cuéntanos sobre tu gimnasio
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
                        @click="removeLogo()"
                        class="w-full"
                        size="small"
                        v-else
                    />
                </div>
            </div>

            <div class="text-muted-color">
                <p class="text-sm">Imagen no mayor a 4MB</p>
                <p class="text-xs">Resolución recomendada: 800x800 px</p>
            </div>
        </div>

        <Form
            v-slot="$form"
            :initialValues="store.formData[2]"
            :resolver
            class="flex-1 flex-shrink"
            ref="form"
            @submit="(e) => store.fillRegisterForm(2, e.values)"
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
                <label for="correo">Correo electrónico <span class="text-red-400">*</span></label>
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
