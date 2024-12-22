<template>
    <div>
        <h1 class="text-3xl font-bold">Agregar Plan</h1>
        <form @submit="onFormSubmit" v-auto-animate>
            <div class="flex gap-8 mt-4">
                <div class="card grow h-fit">
                    <h2 class="text-xl font-bold">Información General</h2>
                    <div class="flex flex-col gap-1 mt-2" v-auto-animate>
                        <label for="name">Nombre</label>
                        <InputText
                            id="name"
                            v-model="nombre"
                            placeholder="Ej: Plan Basico"
                            fluid
                            autocomplete="off"
                        />

                        <Message
                            v-if="errors.nombre"
                            severity="error"
                            size="small"
                            variant="simple"
                        >
                            {{ errors.nombre }}
                        </Message>
                    </div>
                    <div class="flex flex-col gap-1 mt-2">
                        <label for="descripcion">Descripción</label>
                        <Textarea
                            placeholder="Ej: Acceso a maquinas y mancuernas"
                            style="resize: none"
                            v-model="descripcion"
                            id="descripcion"
                            class="mb-1"
                            rows="6"
                        />
                    </div>
                </div>
                <div class="card h-fit">
                    <h2 class="text-xl font-bold">Plazos</h2>
                    <div class="flex gap-[108px] mt-2 mb-1">
                        <label for="duracion">Duración en Meses</label>
                        <label for="precio">Precio</label>
                    </div>
                    <div v-auto-animate>
                        <div class="flex gap-3 mb-3" v-for="(plazo, index) in plazos" :key="index">
                            <div class="flex flex-col gap-1 grow" v-auto-animate>
                                <InputNumber
                                    :id="`duracion-${index}`"
                                    placeholder="Ej: 2"
                                    fluid
                                    autocomplete="off"
                                    v-model="plazos[index].duracion"
                                    @update:modelValue="validateField('duracion', index)"
                                />
                                <Message
                                    v-if="errorPlazos[index]?.duracion"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                >
                                    {{ 'La duración es obligatoria' }}
                                </Message>
                            </div>
                            <div class="flex flex-col gap-1 grow" v-auto-animate>
                                <InputNumber
                                    :inputId="`precio-${index}`"
                                    mode="currency"
                                    currency="ARS"
                                    v-model="plazos[index].precio"
                                    locale="es-AR"
                                    autocomplete="off"
                                    placeholder="Ingrese el precio"
                                    fluid
                                    @update:modelValue="validateField('precio', index)"
                                />

                                <Message
                                    v-if="errorPlazos[index]?.precio"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                >
                                    {{ 'El precio es obligatorio' }}
                                </Message>
                            </div>
                            <Button
                                :class="{ invisible: index === 0 }"
                                v-if="plazos.length > 1"
                                icon="pi pi-trash"
                                class="!bg-red-700 !border-none !text-white hover:!bg-red-800"
                                @click="removeVariant(index)"
                                rounded
                                aria-label="Cancel"
                            />
                        </div>
                        <Message
                            v-if="errorPlan"
                            class="-mt-2"
                            severity="error"
                            size="small"
                            variant="simple"
                        >
                            Solo se pueden agregar 4 duraciones por plan.
                        </Message>
                    </div>
                    <Button
                        type="button"
                        label="Agregar Otra Duración"
                        severity="secondary"
                        icon="pi pi-plus"
                        v-if="!errorPlan"
                        :disabled="loading"
                        @click="addNewVariant"
                    ></Button>
                </div>
            </div>

            <div class="flex gap-4 justify-end mt-10">
                <Button
                    as="router-link"
                    to="/planes"
                    label="Cancelar"
                    severity="secondary"
                ></Button>
                <Button type="submit" @click="validateForm" label="Guardar Plan"></Button>
            </div>
        </form>
    </div>
</template>
<script setup>
import { useField, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { ref } from 'vue';
import { z } from 'zod';
const isEditMode = ref(false);
const loading = ref(false);
const validationSchema = toTypedSchema(
    z.object({
        nombre: z
            .string({ message: 'El nombre es obligatorio.' })
            .min(5, { message: 'Debe tener al menos 5 caracteres' })
            .max(50, { message: 'No debe exceder 50 caracteres' }),
        descripcion: z.string().optional(),
        plazos: z.array(
            z.object({
                duracion: z.number(),
                precio: z.number()
            })
        )
    })
);

const { handleSubmit, errors } = useForm({
    validationSchema
});

const { value: nombre } = useField('nombre');
const { value: descripcion } = useField('descripcion');
const { value: plazos } = useField('plazos', [], {
    initialValue: [{ duracion: null, precio: null }]
});

//Indica si se supero el limite de planes
const errorPlan = ref(false);
//Almacena si hay errores en los plazos
const errorPlazos = ref([]);
//Valida si el campo es correcto
const validateField = (field, index) => {
    if (field === 'duracion') {
        errorPlazos.value[index] = {
            ...errorPlazos.value[index],
            duracion: plazos.value[index].duracion <= 0 || plazos.value[index].duracion === null
        };
    } else {
        errorPlazos.value[index] = {
            ...errorPlazos.value[index],
            precio: plazos.value[index].precio <= 0 || plazos.value[index].precio === null
        };
    }
};
//Agrega la nueva duracion
const addNewVariant = () => {
    plazos.value.push({ duracion: null, precio: null });
    if (plazos.value.length === 4) {
        errorPlan.value = true;
    }
};
//Quita la duracion
const removeVariant = (index) => {
    plazos.value.splice(index, 1);
    errorPlazos.value.splice(index, 1);
    if (plazos.value.length < 4) {
        errorPlan.value = false;
    }
};
//Valida que la duraciones y precios sean correctos
const validateForm = () => {
    plazos.value.forEach((_, index) => {
        validateField('duracion', index);
        validateField('precio', index);
    });
};
//Solo envia el formulario si no hay errores
const onFormSubmit = handleSubmit((values) => {
    console.log(values);
});
</script>
