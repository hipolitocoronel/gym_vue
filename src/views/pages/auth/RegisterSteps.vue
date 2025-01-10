<script setup>
import ConfirmStep from '@/components/register/ConfirmStep.vue';
import GymForm from '@/components/register/GymForm.vue';
import PersonalInformation from '@/components/register/PersonalInformation.vue';
import SucursalForm from '@/components/register/SucursalForm.vue';
import { useRegisterStore } from '@/storage/register.js';

import { useLayout } from '@/layout/composables/layout';
import pb from '@/service/pocketbase';
import { useToast } from 'primevue/usetoast';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const store = useRegisterStore();
const { isDarkTheme } = useLayout();
const activeStep = ref(1);
const router = useRouter();

const personalForm = ref(null);
const gymForm = ref(null);
const sucursalForm = ref(null);
const loading = ref(false);
const animation = ref(true);
const toast = useToast();

const stepsConfig = [
    { value: 1, icon: 'pi pi-user', formRef: personalForm, panel: PersonalInformation },
    { value: 2, icon: 'pi pi-building', formRef: gymForm, panel: GymForm },
    { value: 3, icon: 'pi pi-map-marker', formRef: sucursalForm, panel: SucursalForm },
    { value: 4, icon: 'pi pi-check', isFinalStep: true, panel: ConfirmStep }
];

const getStepClasses = (step) => [
    'rounded-full border-2 min-w-12 h-12 inline-flex items-center justify-center',
    {
        'bg-primary text-primary-contrast border-primary': step <= activeStep.value,
        'border-surface-200 dark:border-surface-700': step > activeStep.value
    }
];

const validateStep = async (step) => {
    const stepConfig = stepsConfig.find((s) => s.value === step);
    if (stepConfig?.formRef?.value) {
        return await stepConfig.formRef.value[0].validate();
    }
    return false;
};

const stepsManager = async () => {
    const currentStep = activeStep.value;

    // Valida el formulario asociado al paso actual
    const isValid = await validateStep(currentStep);

    // Si es válido, avanza al siguiente paso
    if (isValid) {
        activeStep.value++;
    }
};

const createAccount = () => {
    loading.value = true;
    pb.collection('gimnasios')
        .create(store.formData[2])
        .then(async (newGym) => {
            for (const sucursal of store.formData[3]) {
                const payload = { ...sucursal, gimnasio_id: newGym.id };
                await pb.collection('sucursales').create(payload);
            }

            pb.collection('users')
                .create({ ...store.formData[1], gimnasio_id: newGym.id })
                .then(() => {
                    router.push({ name: 'login' });
                    toast.add({
                        severity: 'success',
                        summary: 'Registro exitoso!',
                        detail: 'Ya podés ingresar.'
                    });
                });
        })
        .catch(() => {
            window.location.reload();
            toast.add({ severity: 'error', summary: 'Favor inténtelo nuevamente' });
        });
};

onMounted(() =>
    setTimeout(() => {
        animation.value = false;

        if (!store.formData[1].email) {
            router.push({ name: 'register' });
        }
    }, 1400)
);

onUnmounted(() => store.reset());
</script>
<template>
    <div
        class="absolute top-0 z-10 flex items-center justify-center w-full h-screen bg-black/70"
        v-if="animation"
    >
        <l-bouncy size="60" speed="1.3" color="#049bed" class="mb-52"></l-bouncy>
    </div>

    <div class="flex flex-col items-center min-h-screen card">
        <!-- Encabezado (Logo y Título) -->
        <div class="relative flex items-center justify-center my-6">
            <img
                :src="
                    isDarkTheme
                        ? '/src/assets/img/logo-white.png'
                        : '/src/assets/img/logo-black.png'
                "
                alt="Logo"
                width="50px"
            />
            <p class="text-xl font-extrabold">
                Gym<span class="font-bold text-primary">Master</span>
            </p>
        </div>

        <!-- Stepper -->
        <Stepper v-model:value="activeStep" class="w-[46rem]">
            <StepList style="width: 53rem !important">
                <Step
                    v-for="step in stepsConfig"
                    :key="step.value"
                    v-slot="{ value, a11yAttrs }"
                    asChild
                    :value="step.value"
                >
                    <div
                        class="flex flex-row flex-auto gap-2"
                        :class="{ 'pl-2': step.value > 1 }"
                        v-bind="a11yAttrs.root"
                    >
                        <span :class="getStepClasses(value)">
                            <i :class="step.icon" />
                        </span>
                        <Divider v-if="!step.isFinalStep" />
                    </div>
                </Step>
            </StepList>

            <StepPanels>
                <template v-for="step in stepsConfig" :key="step.value">
                    <StepPanel :value="step.value">
                        <component :is="step.panel" :ref="step.formRef" />
                        <div class="flex justify-between pt-6">
                            <Button
                                :style="step.value == 1 && 'visibility: hidden'"
                                label="Volver"
                                severity="secondary"
                                icon="pi pi-arrow-left"
                                @click="activeStep--"
                            />
                            <Button
                                v-if="!step.isFinalStep"
                                label="Siguiente"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                @click="stepsManager()"
                            />
                            <Button
                                v-else
                                label="Confirmar y finalizar"
                                icon="pi pi-check-circle"
                                iconPos="right"
                                severity="success"
                                :loading="loading"
                                @click="createAccount()"
                            />
                        </div>
                    </StepPanel>
                </template>
            </StepPanels>
        </Stepper>
    </div>
</template>
