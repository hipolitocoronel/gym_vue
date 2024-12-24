<template>
    <Dialog
        v-model:visible="props.visible"
        modal
        v-if="!showMemberForm"
        @update:visible="closeModal"
        header="Registrar Pago"
        :style="{ width: '45rem' }"
    >
        <Form
            v-slot="$form"
            :initialValues
            :resolver
            v-auto-animate
            :validateOnValueUpdate="[
                'paymentMethodSelected',
                'planSelected',
                'plazoSelected',
                $form?.memberSelected?.value ? '' : 'memberSelected'
            ]"
            @submit="onFormSubmit"
            class="flex justify-center flex-col gap-4"
        >
            <div class="flex flex-col gap-1" v-auto-animate>
                <label>Miembro</label>
                <Select
                    name="memberSelected"
                    :options="members"
                    filter
                    :loading="loadingData"
                    fluid
                    :filterFields="['dni', 'nombre']"
                    placeholder="Selecciona un miembro"
                    filterPlaceholder="Buscar miembro por nombre, dni..."
                    :emptyFilterMessage
                    :emptyMessage
                    v-auto-animate
                    @filter="onFilterMembers"
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
                            <div>{{ slotProps.option.dni }}-{{ slotProps.option.nombre }}</div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="p-2 mt-2 text-center">
                            <Button
                                label="Agregar Nuevo Miembro"
                                @click="showMemberForm = true"
                                variant="text"
                                fluid
                            />
                        </div>
                    </template>
                </Select>
                <Message
                    v-if="$form.memberSelected?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.memberSelected.error.message }}
                </Message>
                <span
                    v-if="
                        $form.memberSelected?.value &&
                        $form.memberSelected?.value?.fecha_vencimiento
                    "
                    class="text-sm font-semibold"
                    :class="
                        getMembershipStatus($form.memberSelected?.value)
                            ? 'text-green-500'
                            : 'text-red-500'
                    "
                >
                    Último Vencimiento
                    {{ dayjs($form.memberSelected?.value?.fecha_vencimiento).format('DD/MM/YYYY') }}
                </span>
            </div>
            <Fluid class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1" v-auto-animate>
                    <label>Medio de pago</label>
                    <Select
                        name="paymentMethodSelected"
                        :options="paymentMethods"
                        optionLabel="nombre"
                        placeholder="Selecciona el medio de pago"
                        fluid
                    />
                    <Message
                        v-if="$form.paymentMethodSelected?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.paymentMethodSelected.error.message }}
                    </Message>
                </div>
                <div class="flex flex-col gap-1" v-auto-animate>
                    <label>Plan</label>
                    <Select
                        name="planSelected"
                        :options="plans"
                        :loading="loadingData"
                        emptyMessage="No hay planes"
                        optionLabel="nombre"
                        @update:modelValue="onPlanChange($event, $form)"
                        placeholder="Selecciona el plan de entrenamiento"
                        fluid
                    />
                    <Message
                        v-if="$form.planSelected?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.planSelected.error.message }}
                    </Message>
                </div>
            </Fluid>

            <div v-auto-animate>
                <div class="flex flex-col gap-1" v-if="plazos.length > 0" v-auto-animate>
                    <label>Plazo</label>
                    <Select
                        name="plazoSelected"
                        :loading="loadingData"
                        :options="plazos"
                        placeholder="Selecciona el plazo del plan"
                        :optionLabel="
                            (plazoSelected) =>
                                plazoSelected.duracion +
                                (plazoSelected.duracion > 1 ? ' meses' : ' mes')
                        "
                        fluid
                    />
                    <Message
                        v-if="$form.plazoSelected?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.plazoSelected.error.message }}
                    </Message>
                </div>
            </div>

            <div class="flex justify-between mt-2">
                <span>Total a Pagar:</span>
                <span class="font-bold text-xl">{{
                    $form.plazoSelected?.value?.precio
                        ? formatCurrency($form.plazoSelected.value.precio)
                        : formatCurrency(0)
                }}</span>
            </div>

            <div class="flex justify-end gap-2 my-1">
                <Button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    :disabled="loading"
                    @click="closeModal"
                ></Button>
                <Button label="Guardar" :loading="loading" type="submit"></Button>
            </div>
        </Form>
    </Dialog>
    <MemberForm
        :visible="showMemberForm"
        @newChanges="updateMemberSelected"
        @closeModal="showMemberForm = false"
    />
</template>
<script setup>
import { Form } from '@primevue/forms';
import pb from '@/service/pocketbase.js';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs/esm';
import getMembershipStatus from '@/utils/getMembershipStatus';
import formatCurrency from '@/utils/formatCurrency';
import { useDebounceFn } from '@vueuse/core';
import { useToast } from 'primevue/usetoast';
import { ref, defineProps, defineEmits, watch, computed, onMounted } from 'vue';
const toast = useToast();
const emit = defineEmits(['closeModal', 'newChanges']);
const loading = ref(false);
const props = defineProps({
    visible: Boolean
});
//Indica si ya se cargaron todos los datos a los select
const loadingData = ref(false);
//Indica si se esta cargando los miembro filtrados
const loadingFilterMember = ref(false);
//Valores iniciales del formulario
const initialValues = ref({
    memberSelected: null,
    paymentMethodSelected: null,
    planSelected: null,
    plazoSelected: null
});
//Listas de select
const members = ref([]);
const paymentMethods = ref([{ nombre: 'Efectivo' }, { nombre: 'Transferencia' }]);
const plans = ref([]);
const plazos = ref([]);
//Validaciones del formulario
const resolver = zodResolver(
    z.object({
        memberSelected: z.object(
            {
                id: z.string()
            },
            {
                invalid_type_error: 'El miembro es obligatorio'
            }
        ),

        paymentMethodSelected: z.object(
            {
                nombre: z.string()
            },
            {
                invalid_type_error: 'El medio de pago es obligatorio'
            }
        ),

        planSelected: z.object(
            {
                id: z.string()
            },
            {
                invalid_type_error: 'El plan es obligatorio'
            }
        ),

        plazoSelected: z.object(
            {
                id: z.string(),
                precio: z.number(),
                duracion: z.number()
            },
            {
                invalid_type_error: 'El plazo es obligatorio'
            }
        )
    })
);
//Modal para agregar miembro
const showMemberForm = ref(false);
const updateMemberSelected = (mode, member) => {
    initialValues.value.memberSelected = member;
};
//Obtiene los plazos asociados al plam seleccionado
const onPlanChange = async (plan, form) => {
    plazos.value = await pb.collection('planes_plazos').getFullList({
        filter: `id_plan='${plan.id}'`
    });
    form.plazoSelected ? (form.plazoSelected.value = null) : '';
};
//Obtiene los miembros filtrados
const onFilterMembers = (event) => {
    loadingFilterMember.value = true;
    filtrarMiembros(event.value);
};
const filtrarMiembros = useDebounceFn(async (value) => {
    const resultMembers = await pb.collection('miembros_pagos').getList(1, 5, {
        sort: '-created',
        filter: `nombre~'${value ?? ''}' || dni~'${value ?? ''}'`,
        fields: 'id,nombre,dni,fecha_vencimiento'
    });
    loadingFilterMember.value = false;
    members.value = resultMembers.items;
}, 400);

const closeModal = () => {
    initialValues.value = {
        memberSelected: null,
        paymentMethodSelected: null,
        planSelected: null,
        plazoSelected: null
    };
    plazos.value = [];
    emit('closeModal', false);
};
const emptyFilterMessage = computed(() => {
    return loadingFilterMember.value ? 'Cargando...' : 'No se encontraron resultados';
});
const emptyMessage = computed(() => {
    return loadingFilterMember.value ? 'Cargando...' : 'No hay miembros registrados';
});
const onFormSubmit = async (e) => {
    if (e.valid) {
        let expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + e.values.plazoSelected.duracion);
        let payload = {
            id_plan_plazo: e.values.plazoSelected.id,
            id_miembro: e.values.memberSelected.id,
            medio_pago: e.values.paymentMethodSelected.nombre,
            monto_total: e.values.plazoSelected.precio,
            fecha_pago: new Date(),
            fecha_vencimiento: expirationDate
        };
        try {
            loading.value = true;
            await pb.collection('pagos').create(payload);
            toast.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'El pago se ha realizado correctamente',
                life: 3000
            });
            emit('newChanges');
            closeModal();
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Operación fallida',
                detail: 'Error al realizar el pago',
                life: 3000
            });
        } finally {
            loading.value = false;
        }
    }
};
//Carga los datos para utilizar en los select
onMounted(async () => {
    try {
        loadingData.value = true;
        plans.value = await pb.collection('planes').getFullList({
            sort: '-created'
        });
        const resultMembers = await pb.collection('miembros_pagos').getList(1, 5, {
            sort: '-created'
        });
        members.value = resultMembers.items;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'Error al cargar los datos',
            life: 3000
        });
    } finally {
        loadingData.value = false;
    }
});
</script>
