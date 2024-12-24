<script setup>
import { ref } from 'vue';

const src = ref(null);

function onFileSelect(event) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        src.value = e.target.result;
    };

    reader.readAsDataURL(file);
}
</script>
<template>
    <div class="flex items-center gap-4">
        <div
            class="flex items-center justify-center w-32 h-32 overflow-hidden rounded-full bg-surface-50 dark:bg-surface-950"
        >
            <img :src="src" class="object-cover w-full h-full" v-if="src" />
            <i class="pi pi-images text-muted-color" style="font-size: 1.6rem" v-else></i>
        </div>
        <div class="flex gap-16">
            <div>
                <p>Logo de tu gym</p>
                <p class="text-sm text-muted-color">PNG o JPEG no mayor a 4MB</p>
            </div>
            <div class="flex gap-3">
                <FileUpload
                    mode="basic"
                    @select="onFileSelect"
                    customUpload
                    auto
                    chooseLabel="Subir"
                    chooseIcon="pi pi-cloud-upload"
                    :chooseButtonProps="{ class: 'p-button-secondary' }"
                />
                <Button
                    icon="pi pi-trash"
                    variant="outlined"
                    severity="danger"
                    @click="src = null"
                />
            </div>
        </div>
    </div>
    <div class="max-w-5xl">
        <div class="flex gap-5 mt-5">
            <div class="flex flex-col flex-1 gap-1" v-auto-animate>
                <label for="nombre">Nombre del Gimnasio</label>
                <InputText name="nombre" id="password" placeholder="Nombre" class="mb-2">
                </InputText>
            </div>

            <div class="flex flex-col flex-1 gap-1" v-auto-animate>
                <label for="direccion">Dirección</label>
                <InputText
                    name="direccion"
                    id="direccion"
                    placeholder="Ej: Sarmiento 127"
                    class="mb-2"
                >
                </InputText>
            </div>
        </div>

        <div class="flex gap-5 mt-3">
            <div class="flex flex-col flex-1 gap-1" v-auto-animate>
                <label for="correo">Correo electrónico</label>
                <InputText name="correo" id="correo" placeholder="ejemplo@ejemplo.com" class="mb-2">
                </InputText>
            </div>

            <div class="flex flex-col flex-1 gap-1" v-auto-animate>
                <label for="telefono">Teléfono</label>
                <InputText name="telefono" id="telefono" placeholder="Ej: 3794123456" class="mb-2">
                </InputText>
            </div>
        </div>
    </div>

    <Button label="Guardar cambios" :loading="false" type="submit" class="mt-6" />
</template>
