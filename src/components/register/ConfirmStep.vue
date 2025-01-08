<script setup>
const props = defineProps(['personalForm']);
</script>

<template>
    <h2 class="pt-4 mb-2 text-xl font-bold"><span class="mr-2">4.</span> Verificar información</h2>
    <Accordion value="0">
        <AccordionPanel value="0">
            <AccordionHeader>1. Información personal</AccordionHeader>
            <AccordionContent>
                <div class="mb-3">
                    <label class="text-xs text-muted-color">NOMBRE</label>
                    <p class="font-bold">Hipolito Coronel</p>
                </div>

                <div class="flex justify-between gap-4 mb-3">
                    <div class="flex-1">
                        <label class="text-xs text-muted-color">CORREO ELECTRÓNICO</label>
                        <p class="font-bold">hipolitocoronel1522@gmail.com</p>
                    </div>

                    <div class="flex-1">
                        <label class="text-xs text-muted-color">TELÉFONO</label>
                        <p class="font-bold">3782442451</p>
                    </div>

                    {{ props.personalForm }}
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
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxxnxkpf9kjMmNyIVWQ_f_TVKBhV_kzkNaLg&s"
                            alt=""
                        />
                    </div>

                    <div>
                        <div class="mb-3">
                            <label class="text-xs text-muted-color">NOMBRE</label>
                            <p class="font-bold">Hipolito Coronel</p>
                        </div>

                        <div class="flex justify-between gap-6 mb-3">
                            <div class="flex-1">
                                <label class="text-xs text-muted-color">CORREO ELECTRÓNICO</label>
                                <p class="font-bold">hipolitocoronel1522@gmail.com</p>
                            </div>

                            <div class="flex-1">
                                <label class="text-xs text-muted-color">TELÉFONO</label>
                                <p class="font-bold">3782442451</p>
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
                <div class="flex justify-between gap-6 mb-3" v-for="n in 3">
                    <div class="flex-1">
                        <label class="text-xs text-muted-color">NOMBRE</label>
                        <p class="font-bold">Sucursal principal</p>
                    </div>

                    <div class="flex-1">
                        <label class="text-xs text-muted-color">DIRECCIÓN</label>
                        <p class="font-bold">Sarmiento 1278</p>
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
