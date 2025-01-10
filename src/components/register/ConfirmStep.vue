<script setup>
import { useRegisterStore } from '@/storage/register';

const { formData } = useRegisterStore();
</script>

<template>
    <h2 class="pt-4 mb-2 text-xl font-bold"><span class="mr-2">4.</span> Verificar información</h2>
    <Accordion value="0">
        <AccordionPanel value="0">
            <AccordionHeader>1. Información personal</AccordionHeader>
            <AccordionContent>
                <div class="mb-3">
                    <label class="text-xs text-muted-color">NOMBRE</label>
                    <p class="font-bold">{{ formData[1].name }}</p>
                </div>

                <div class="flex justify-between gap-4 mb-3">
                    <div class="flex-1">
                        <label class="text-xs text-muted-color">CORREO ELECTRÓNICO</label>
                        <p class="font-bold">{{ formData[1].email }}</p>
                    </div>

                    <div class="flex-1">
                        <label class="text-xs text-muted-color">TELÉFONO</label>
                        <p class="font-bold">{{ formData[1].phone }}</p>
                    </div>
                </div>

                <div class="flex justify-end">
                    <Button
                        label="Editar"
                        size="small"
                        icon="pi pi-pencil"
                        severity="secondary"
                        class="mt-4"
                    ></Button>
                </div>
            </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="1">
            <AccordionHeader>2. Tu gimnasio</AccordionHeader>
            <AccordionContent>
                <div class="flex items-center gap-6">
                    <div class="overflow-hidden border rounded-full w-36 h-36">
                        <div
                            class="flex items-center justify-center h-full"
                            v-if="!formData[2].src"
                        >
                            <i class="pi pi-images text-muted-color" style="font-size: 2.5rem"></i>
                        </div>
                        <img :src="formData[2].src" class="object-cover w-full h-full" v-else />
                    </div>

                    <div class="flex-1">
                        <div class="mb-3">
                            <label class="text-xs text-muted-color">NOMBRE</label>
                            <p class="font-bold">{{ formData[2].nombre }}</p>
                        </div>

                        <div class="flex justify-between w-full gap-6 mb-3">
                            <div class="flex-1">
                                <label class="text-xs text-muted-color">CORREO ELECTRÓNICO</label>
                                <p class="font-bold">
                                    {{ formData[2].correo.length > 0 ? formData[2].correo : '-' }}
                                </p>
                            </div>

                            <div class="flex-1">
                                <label class="text-xs text-muted-color">TELÉFONO</label>
                                <p class="font-bold">{{ formData[2].telefono ?? '-' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end">
                    <Button
                        label="Editar"
                        size="small"
                        icon="pi pi-pencil"
                        severity="secondary"
                        class="mt-4"
                    ></Button>
                </div>
            </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="2">
            <AccordionHeader>3. Tus sucursales</AccordionHeader>
            <AccordionContent>
                <div class="flex justify-between gap-6 mb-3" v-for="sucursal in formData[3]">
                    <div class="flex-1">
                        <label class="text-xs text-muted-color">NOMBRE</label>
                        <p class="font-bold">{{ sucursal.nombre }}</p>
                    </div>

                    <div class="flex-1">
                        <label class="text-xs text-muted-color">DIRECCIÓN</label>
                        <p class="font-bold">{{ sucursal.direccion }}</p>
                    </div>
                </div>

                <div class="flex justify-end">
                    <Button
                        label="Editar"
                        size="small"
                        icon="pi pi-pencil"
                        severity="secondary"
                        class="mt-4"
                    ></Button>
                </div>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>
