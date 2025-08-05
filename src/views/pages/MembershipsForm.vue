<template>
    <div>
        <form @submit="onFormSubmit" class="card" v-auto-animate>
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-3xl font-bold">
                    {{ isEditMode ? 'Editar Plan' : 'Agregar Plan' }}
                </h1>
                <div class="flex items-center gap-2" v-if="loadingPlan">
                    <ProgressSpinner
                        style="width: 20px; height: 20px"
                        strokeWidth="4"
                        fill="transparent"
                    />
                    <span class="text-muted-color font-medium">Cargando información</span>
                </div>
            </div>
            <div class="flex gap-8">
                <div class="grow h-fit">
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

                    <div
                        class="flex flex-col gap-2 mt-1"
                        v-if="store?.currentGym?.gestionar_horarios"
                    >
                        <label for="flexible">Horarios</label>
                        <RadioButtonGroup v-model="horarios" class="flex flex-wrap gap-4">
                            <div class="flex items-center gap-2">
                                <RadioButton inputId="flexible" value="flexible" />
                                <label for="flexible">Flexible</label>
                            </div>
                            <div class="flex items-center gap-2">
                                <RadioButton inputId="fijo" value="fijo" />
                                <label for="fijo">Fijo</label>
                            </div>
                        </RadioButtonGroup>
                    </div>
                </div>
                <div class="h-fit">
                    <h2 class="text-xl font-bold">Plazos</h2>

                    <div v-auto-animate>
                        <div class="flex gap-3 mb-6" v-for="(_, index) in plazos" :key="index">
                            <div class="flex flex-col gap-1 grow" v-auto-animate>
                                <label v-if="index === 0" class="mt-2" for="duracion"
                                    >Duración en Meses</label
                                >
                                <InputNumber
                                    :id="`duracion-${index}`"
                                    placeholder="Ej: 2"
                                    fluid
                                    autocomplete="off"
                                    v-model="plazos[index].duracion"
                                    @update:modelValue="
                                        validatePlazoField(
                                            'duracion',
                                            index,
                                            plazos[index].duracion
                                        )
                                    "
                                />
                                <Message
                                    v-if="errorPlazos[index]?.duracion"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                >
                                    {{ errorPlazos[index]?.duracion }}
                                </Message>
                            </div>
                            <div class="flex flex-col gap-1 grow" v-auto-animate>
                                <label v-if="index === 0" class="mt-2" for="precio">Precio</label>
                                <InputNumber
                                    :inputId="`precio-${index}`"
                                    mode="currency"
                                    currency="ARS"
                                    v-model="plazos[index].precio"
                                    locale="es-AR"
                                    autocomplete="off"
                                    placeholder="Ingrese el precio"
                                    fluid
                                    @update:modelValue="
                                        validatePlazoField('precio', index, plazos[index].precio)
                                    "
                                />

                                <Message
                                    v-if="errorPlazos[index]?.precio"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                >
                                    {{ errorPlazos[index]?.precio }}
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
                            v-if="plazos.length >= 4"
                            class="-mt-1"
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
                        v-if="!(plazos.length >= 4)"
                        :disabled="loading"
                        @click="addNewVariant"
                    ></Button>
                </div>
            </div>
            <div class="flex gap-4 justify-end mt-6">
                <Button
                    as="router-link"
                    to="/admin/planes"
                    label="Cancelar"
                    severity="secondary"
                ></Button>
                <Button
                    type="submit"
                    @click="validateForm"
                    :loading
                    :disabled="errorFetch || loadingPlan"
                    :label="`${isEditMode ? 'Editar' : 'Guardar'} plan`"
                ></Button>
            </div>
        </form>
    </div>
</template>
<script setup>
import pb from '@/service/pocketbase.js';
import { useIndexStore } from '@/storage';
import { toTypedSchema } from '@vee-validate/zod';
import { useToast } from 'primevue/usetoast';
import { useField, useForm } from 'vee-validate';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
const toast = useToast();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const loadingPlan = ref(false);
const store = useIndexStore();
const isEditMode = computed(() => {
    return route.params?.id ? true : false;
});
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
//Obtiene los datos del plan si esta en modo edicion
const fetchData = async () => {
    if (isEditMode.value) {
        try {
            loadingPlan.value = true;
            const plan = await pb.collection('planes').getOne(route.params.id);
            const plazosData = await pb
                .collection('planes_plazos')
                .getFullList({ filter: `id_plan="${route.params.id}" && deleted = null` });
            errorFetch.value = false;
            nombre.value = plan.nombre;
            descripcion.value = plan.descripcion;
            horarios.value = plan.horario;
            plazos.value = plazosData.map((plazo) => ({
                duracion: plazo.duracion,
                precio: plazo.precio,
                id: plazo.id
            }));
        } catch (error) {
            errorFetch.value = true;
            toast.add({
                severity: 'error',
                summary: 'Operación fallida',
                detail: 'No se pudo obtener el plan',
                life: 3000
            });
        } finally {
            loadingPlan.value = false;
        }
    }
};
const { handleSubmit, errors } = useForm({
    validationSchema
});

watch(() => route.params?.id, fetchData, { immediate: true });

const { value: nombre } = useField('nombre');
const { value: descripcion } = useField('descripcion');
const { value: horarios } = useField('horarios', [], {
    initialValue: 'flexible'
});
const { value: plazos } = useField('plazos', [], {
    initialValue: [{ duracion: null, precio: null }]
});
//Indica si hubo un error al obtener los datos del plan
const errorFetch = ref(false);
//Almacena si hay errores en los plazos
const errorPlazos = ref([]);
// Validates a single field in a plazo
const validatePlazoField = (field, index, value) => {
    const gender = field === 'duracion';
    const errorMessage =
        value === null || value <= 0
            ? `${gender ? 'La' : 'El'} ${field} es obligatori${gender ? 'a' : 'o'}`
            : null;

    errorPlazos.value[index] = {
        ...errorPlazos.value[index],
        [field]: errorMessage
    };
};
//Agrega la nueva duracion
const addNewVariant = () => {
    if (isEditMode.value) {
        plazos.value.push({ duracion: null, precio: null, id: undefined });
    } else {
        plazos.value.push({ duracion: null, precio: null });
    }
};
const removedVariants = [];
const removeVariant = async (index) => {
    if (isEditMode.value && plazos.value[index].id !== undefined) {
        removedVariants.push(plazos.value[index]);
    }
    plazos.value.splice(index, 1);
    errorPlazos.value.splice(index, 1);
};
//Valida que la duraciones y precios sean correctos
const validateForm = () => {
    plazos.value.forEach((_, index) => {
        validatePlazoField('duracion', index, plazos.value[index].duracion);
        validatePlazoField('precio', index, plazos.value[index].precio);
    });
};
//Solo envia el formulario si no hay errores
const onFormSubmit = handleSubmit(async (values) => {
    const payload = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        horario: horarios.value,
        sucursal_id: store.currentSucursal.id
    };
    try {
        loading.value = true;
        const batch = pb.createBatch();
        if (isEditMode.value) {
            await pb.collection('planes').update(route.params.id, payload);
            removedVariants.forEach(async (plazo) => {
                plazo.deleted = new Date();
                batch.collection('planes_plazos').update(plazo.id, plazo);
            });
            plazos.value.forEach((plazo) => {
                const payload = {
                    id_plan: route.params.id,
                    duracion: plazo.duracion,
                    precio: plazo.precio
                };
                plazo.id === undefined
                    ? batch.collection('planes_plazos').create(payload)
                    : batch.collection('planes_plazos').update(plazo.id, payload);
            });
        } else {
            const planAdded = await pb.collection('planes').create(payload);
            for (const plazo of plazos.value) {
                batch.collection('planes_plazos').create({
                    duracion: plazo.duracion,
                    precio: plazo.precio,
                    id_plan: planAdded.id
                });
            }
        }
        await batch.send();
        toast.add({
            severity: 'success',
            summary: 'Confirmado',
            detail: `Plan ${isEditMode.value ? 'Editado' : 'Agregado'}`,
            life: 3000
        });
        router.push('/admin/planes');
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'Intentelo nuevamente',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
});
</script>
