<template>
    <Dialog
        v-model:visible="props.visible"
        modal
        @update:visible="closeModal"
        header="Registrar Pago"
        :style="{ width: '38rem' }"
    >
        <Form
            v-slot="$form"
            :initialValues
            :resolver
            @submit="onFormSubmit"
            class="flex justify-center flex-col gap-4"
        >
            <div class="flex flex-col gap-1" v-auto-animate>
                <label>Miembro</label>
                <Select
                    name="select"
                    :options="members"
                    filter
                    fluid
                    optionLabel="nombre"
                    placeholder="Selecciona un miembro"
                    emptyFilterMessage="No hay resultados"
                    emptyMessage="No hay miembros"
                >
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center">
                            <div>{{ slotProps.value.nombre }}</div>
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="flex items-center">
                            <div>{{ slotProps.option.nombre }}</div>
                        </div>
                    </template>
                </Select>

                <Message severity="error" size="small" variant="simple"> </Message>
            </div>

            <div class="flex flex-col gap-1" v-auto-animate>
                <label>Medio de pago</label>
                <Select
                    name="paymentMethod"
                    :options="paymentMethods"
                    optionLabel="nombre"
                    placeholder="Selecciona el medio de pago"
                    fluid
                />
                <Message
                    v-if="$form.paymentMethod?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.paymentMethod.error.message }}
                </Message>
            </div>
            <div class="flex flex-col gap-1" v-auto-animate>
                <label>Plan</label>
                <Select
                    optionValue="id"
                    name="plan"
                    :options="plans"
                    emptyMessage="No hay planes"
                    optionLabel="nombre"
                    @update:modelValue="onPlanChange"
                    placeholder="Selecciona el plan de entrenamiento"
                    fluid
                />
                <Message v-if="$form.plan?.invalid" severity="error" size="small" variant="simple"
                    >{{ $form.plan.error.message }}
                </Message>
            </div>
            <div class="flex flex-col gap-1" v-auto-animate>
                <label>Plazo</label>
                <Select
                    name="plazo"
                    :options="plazos.items"
                    placeholder="Selecciona el plan del plan"
                    :optionLabel="
                        (plazo) => plazo.duracion + (plazo.duracion > 1 ? ' meses' : ' mes')
                    "
                    fluid
                />
                <Message severity="error" size="small" variant="simple"> </Message>
            </div>

            <div class="flex justify-end gap-2 mt-1">
                <Button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    :disabled="loading"
                    @click="closeModal"
                ></Button>
                <Button label="Guardar" :loading="loading" type="submit"></Button>
            </div>
            {{ $form }}
        </Form>
    </Dialog>
</template>
<script setup>
import { Form } from '@primevue/forms';
import pb from '@/service/pocketbase.js';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';
import { ref, defineProps, defineEmits, watch, computed, onMounted } from 'vue';
const toast = useToast();
const showModal = ref(false);
const emit = defineEmits(['closeModal', 'newChanges']);
const props = defineProps({
    visible: Boolean
});
const loading = ref(false);
const initialValues = ref({
    member: null,
    paymentMethod: { nombre: '' },
    plan: { id: '' },
    plazo: null
});
const members = ref([]);
const paymentMethods = ref([{ nombre: 'Efectivo' }, { nombre: 'Transferencia' }]);
const plans = ref([]);
const plazos = ref([]);
const resolver = zodResolver(
    z.object({
        paymentMethod: z.union([
            z.object({
                nombre: z.string().min(1, 'El medio de pago es obligatorio.')
            }),
            z.any().refine((val) => false, { message: 'El medio de pago es obligatorio.' })
        ]),
        plan: z.union([
            z.object({
                id: z.string().min(1, 'El plan obligatorio.')
            }),
            z.any().refine((val) => false, { message: 'El plan es obligatorio.' })
        ])
    })
);
const onPlanChange = async (value) => {
    try {
        plazos.value = await pb.collection('planes_plazos').getList(1, 4, {
            filter: `id_plan='${value}'`
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'Error al cargar los datos',
            life: 3000
        });
    }
};

const closeModal = () => {
    emit('closeModal');
};
const onFormSubmit = async (e) => {
    if (e.valid) {
        try {
            const memberData = e.values;
            loading.value = true;

            closeModal();
            emit('newChanges');
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
    }
};
onMounted(async () => {
    try {
        plans.value = await pb.collection('planes').getFullList({
            sort: 'nombre'
        });
        members.value = await pb.collection('miembros').getList(1, 10, {
            sort: 'nombre'
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'Error al cargar los datos',
            life: 3000
        });
    }
});
</script>
