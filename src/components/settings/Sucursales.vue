<script setup>
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { onMounted, ref } from 'vue';
import { z } from 'zod';

const store = useIndexStore();
const formRefs = ref([{}]);
const sucursales = ref([]);
const loading = ref(false);

const resolver = zodResolver(
    z.object({
        nombre: z.string().min(3, { message: 'Mínimo 4 caracteres.' }),
        direccion: z.string().min(3, { message: 'Mínimo 4 caracteres.' })
    })
);

const agregarSucursal = async () => {
    const form = formRefs.value[store.formData[3].length - 1];
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

onMounted(() => {
    loading.value = true;
    pb.collection('sucursales')
        .getFullList({ filter: `gimnasio_id = "${store.currentGym.id}"` })
        .then((result) => {
            sucursales.value = result;
        })
        .finally(() => (loading.value = false));
});
</script>
<template>
    <ProgressSpinner style="width: 27px; height: 27px" v-if="loading" strokeWidth="4" />
    <div class="flex flex-col max-w-6xl mt-3" v-auto-animate>
        <div v-for="(suc, index) in sucursales" :key="suc.id" v-auto-animate>
            <Form
                v-slot="$form"
                :ref="(el) => (formRefs[index] = el)"
                :initialValues="suc"
                :resolver
                class="relative flex-1"
                @submit="(e) => store.fillRegisterForm(3, e.values, index)"
            >
                <div class="flex flex-col flex-1 gap-1" v-auto-animate>
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
            </Form>

            <div class="py-3" v-if="index < sucursales.length - 1">
                <Divider />
            </div>
        </div>

        <div class="flex justify-end gap-3 my-4" v-if="!loading">
            <Button
                severity="danger"
                icon="pi pi-trash"
                rounded
                v-tooltip.top="'Quitar sucursal'"
                @click="quitarSucursal(index)"
            >
            </Button>

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
    <div v-if="sucursales.length > 0">
        <p class="mb-4">
            Los campos marcados con <span class="text-red-400">(*)</span> son obligatorios
        </p>
        <Button label="Guardar cambios" :loading="loading" type="submit"></Button>
    </div>
</template>
