<script setup>
import { useRegisterStore } from '@/storage/register';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { ref } from 'vue';
import { z } from 'zod';

const store = useRegisterStore();
const formRefs = ref([{}]);

const resolver = zodResolver(
    z.object({
        nombre: z.string().min(3, { message: 'Mínimo 4 caracteres.' }),
        direccion: z.string().min(3, { message: 'Mínimo 4 caracteres.' })
    })
);

const agregarSucursal = async () => {
    const form = formRefs.value[formRefs.value.length - 1];
    const { errors } = await form.validate();

    if (Object.keys(errors) == 0) {
        store.formData[3].push({
            nombre: '',
            direccion: ''
        });
    }
};

const quitarSucursal = (index) => {
    store.formData[3].splice(index, 1);
    formRefs.value.splice(index, 1);
};

const validate = async () => {
    for (const form of formRefs.value) {
        if (!form) continue;

        await form.onSubmit();

        const { errors } = await form.validate();
        if (Object.keys(errors).length > 0) return false;
    }

    return true;
};

defineExpose({ validate });
</script>
<template>
    <h2 class="pt-4 mb-2 text-xl font-bold"><span class="mr-2">3.</span> Sucursales</h2>
    <div class="flex flex-col gap-5">
        <div v-for="(init, index) in store.formData[3]" :key="index" v-auto-animate>
            <Form
                v-slot="$form"
                :ref="(el) => (formRefs[index] = el)"
                :initialValues="init"
                :resolver
                class="relative flex-1"
                @submit="(e) => store.fillRegisterForm(3, e.values, index)"
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

                <div class="flex flex-col flex-1 gap-1" v-auto-animate>
                    <label for="direccion">Dirección <span class="text-red-400">*</span></label>
                    <InputText
                        name="direccion"
                        id="direccion"
                        placeholder="Sarmiento 127"
                        class="mb-2"
                    />

                    <Message
                        v-if="$form.direccion?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.direccion.error.message }}
                    </Message>
                </div>

                <div class="absolute right-0 -top-5" v-if="index > 0">
                    <Button
                        severity="danger"
                        icon="pi pi-trash"
                        rounded
                        v-tooltip.top="'Quitar sucursal'"
                        @click="quitarSucursal(index)"
                    >
                    </Button>
                </div>
            </Form>

            <Divider v-if="index < store.formData[3].length - 1" />
        </div>

        <div class="flex justify-end" v-if="store.formData[3].length <= 2">
            <Button
                severity="success"
                @click="agregarSucursal()"
                icon="pi pi-plus"
                rounded
                v-tooltip.top="'Agregar sucursal'"
            >
            </Button>
        </div>
    </div>
</template>
