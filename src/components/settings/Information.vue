<script setup>
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { z } from 'zod';

const store = useIndexStore();
const src = ref(store.srcLogoGym);
const logo = ref(null);
const loading = ref(false);
const toast = useToast();

// Valores iniciales como un computed
const initialValues = computed(() => {
    src.value = store.srcLogoGym;
    return {
        nombre: store.currentGym?.nombre || '',
        correo: store.currentGym?.correo || '',
        telefono: store.currentGym?.telefono || null,
        horario_apertura: store.currentGym?.horario_apertura
            ? new Date(store.currentGym?.horario_apertura)
            : null,
        horario_cierre: store.currentGym?.horario_cierre
            ? new Date(store.currentGym?.horario_cierre)
            : null,
        gestionar_horarios: store.currentGym?.gestionar_horarios || false
    };
});

const resolver = zodResolver(
    z
        .object({
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
                .nullable(),
            horario_apertura: z.date({
                invalid_type_error: 'El horario de apertura es obligatorio.'
            }),
            horario_cierre: z.date({
                invalid_type_error: 'El horario de cierre es obligatorio.'
            }),
            gestionar_horarios: z.boolean()
        })
        .refine((data) => data.horario_cierre >= data.horario_apertura, {
            message: 'El horario de cierre debe ser posterior al de apertura.',
            path: ['horario_cierre']
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

            // guardando informacion del gimnasio
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
</script>
<template>
    <div class="flex gap-14" v-if="store.currentGym">
        <Form
            v-slot="$form"
            :initialValues
            :resolver
            class="flex-1 flex-shrink mt-5"
            @submit="onFormSubmit"
        >
            <div class="flex flex-col flex-1 gap-1 mb-4" v-auto-animate>
                <label for="nombre">Nombre del Gimnasio <span class="text-red-400">*</span></label>
                <InputText name="nombre" id="password" placeholder="Nombre" class="mb-2">
                </InputText>
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
            <div v-auto-animate>
                <div class="flex gap-4" v-if="$form?.gestionar_horarios?.value">
                    <div class="flex flex-col flex-1 gap-1 mb-4" v-auto-animate>
                        <label for="horarioApertura">Horarios</label>
                        <DatePicker
                            placeholder="Ingrese horario de apertura"
                            id="horarioApertura"
                            v-tooltip.left="'Horario de apertura'"
                            name="horario_apertura"
                            :stepMinute="15"
                            timeOnly
                            fluid
                        />

                        <Message
                            v-if="$form.horario_apertura?.invalid"
                            severity="error"
                            size="small"
                            variant="simple"
                        >
                            {{ $form.horario_apertura.error.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col flex-1 gap-1 mb-4" v-auto-animate>
                        <label class="invisible">Horarios</label>
                        <DatePicker
                            placeholder="Ingrese horario de cierre"
                            name="horario_cierre"
                            :stepMinute="15"
                            v-tooltip.right="'Horario de cierre'"
                            timeOnly
                            fluid
                        />

                        <Message
                            v-if="$form.horario_cierre?.invalid"
                            severity="error"
                            size="small"
                            variant="simple"
                        >
                            {{ $form.horario_cierre.error.message }}
                        </Message>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-2 mb-4">
                <label for="flexible">Gestionar horarios</label>
                <RadioButtonGroup name="gestionar_horarios" class="flex flex-wrap gap-4">
                    <div class="flex items-center gap-2">
                        <RadioButton inputId="si" :value="true" />
                        <label for="si">Si</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <RadioButton inputId="no" :value="false" />
                        <label for="no">No</label>
                    </div>
                </RadioButtonGroup>
            </div>

            <p class="mb-5">
                Los campos marcados con <span class="text-red-400">(*)</span> son obligatorios
            </p>

            <Button type="submit" :loading="loading" label="Guardar cambios"></Button>
        </Form>

        <div class="flex flex-1 gap-4">
            <div class="flex flex-col flex-1 max-w-md">
                <p class="mb-2 font-medium">Preview de tu logo</p>
                <div class="w-full bg-surface-50 dark:bg-surface-950 aspect-square">
                    <div class="flex items-center justify-center h-full" v-if="!src">
                        <i class="pi pi-images text-muted-color" style="font-size: 4.5rem"></i>
                    </div>
                    <img :src="src" class="object-cover w-full h-full" alt="logo" v-else />
                </div>

                <FileUpload
                    mode="basic"
                    @select="onFileSelect"
                    customUpload
                    auto
                    chooseLabel="Cargar"
                    chooseIcon="pi pi-cloud-upload"
                    :chooseButtonProps="{
                        class: 'p-button-secondary w-full mt-4'
                    }"
                    v-if="!src"
                />

                <Button
                    icon="pi pi-trash"
                    variant="outlined"
                    severity="danger"
                    label="Quitar logo"
                    @click="src = null"
                    class="w-full mt-4"
                    v-else
                />
            </div>
            <div class="mt-16 text-sm text-muted-color">
                <p>
                    <i class="mr-2 text-yellow-400 pi pi-info-circle"></i>
                    <span>PNG o JPEG no mayor a 4MB</span>
                </p>
                <p class="ml-6 text-xs">Resolución recomendada: 1000x1000</p>
            </div>
        </div>
    </div>

    <ProgressSpinner style="width: 27px; height: 27px" v-else strokeWidth="4" />
</template>
