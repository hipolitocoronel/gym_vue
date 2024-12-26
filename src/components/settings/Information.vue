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
    <div class="flex gap-14">
        <div class="flex-1 flex-shrink mt-5">
            <div class="flex flex-col flex-1 gap-1 mb-4" v-auto-animate>
                <label for="nombre">Nombre del Gimnasio <span class="text-red-400">*</span></label>
                <InputText name="nombre" id="password" placeholder="Nombre" class="mb-2">
                </InputText>
            </div>

            <div class="flex flex-col flex-1 gap-1 mb-4" v-auto-animate>
                <label for="direccion">Dirección <span class="text-red-400">*</span></label>
                <InputText
                    name="direccion"
                    id="direccion"
                    placeholder="Ej: Sarmiento 127"
                    class="mb-2"
                >
                </InputText>
            </div>

            <div class="flex flex-col flex-1 gap-1 mb-4" v-auto-animate>
                <label for="correo">Correo electrónico</label>
                <InputText name="correo" id="correo" placeholder="ejemplo@ejemplo.com" class="mb-2">
                </InputText>
            </div>

            <div class="flex flex-col flex-1 gap-1 mb-4" v-auto-animate>
                <label for="telefono">Teléfono</label>
                <InputText name="telefono" id="telefono" placeholder="Ej: 3794123456" class="mb-2">
                </InputText>
            </div>

            <p class="mb-5">
                Los campos marcados con <span class="text-red-400">(*)</span> son obligatorios
            </p>

            <Button>Guardar cambios</Button>
        </div>

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
</template>
