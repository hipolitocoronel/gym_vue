<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref } from 'vue';

const { isDarkTheme } = useLayout();
const activeStep = ref(1);
const name = ref();
const email = ref();
const password = ref();
</script>

<template>
    <div class="flex flex-col items-center h-screen card">
        <div class="flex items-center justify-center mb-6">
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

        <Stepper v-model:value="activeStep" class="basis-[40rem] w-[40rem]">
            <StepList>
                <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="1">
                    <div class="flex flex-row flex-auto gap-2" v-bind="a11yAttrs.root">
                        <button
                            class="inline-flex flex-col gap-2 bg-transparent border-0"
                            @click="activateCallback"
                            v-bind="a11yAttrs.header"
                        >
                            <span
                                :class="[
                                    'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                                    {
                                        'bg-primary text-primary-contrast border-primary':
                                            value <= activeStep,
                                        'border-surface-200 dark:border-surface-700':
                                            value > activeStep
                                    }
                                ]"
                            >
                                <i class="pi pi-user" />
                            </span>
                        </button>
                        <Divider />
                    </div>
                </Step>
                <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="2">
                    <div class="flex flex-row flex-auto gap-2 pl-2" v-bind="a11yAttrs.root">
                        <button
                            class="inline-flex flex-col gap-2 bg-transparent border-0"
                            @click="activateCallback"
                            v-bind="a11yAttrs.header"
                        >
                            <span
                                :class="[
                                    'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                                    {
                                        'bg-primary text-primary-contrast border-primary':
                                            value <= activeStep,
                                        'border-surface-200 dark:border-surface-700':
                                            value > activeStep
                                    }
                                ]"
                            >
                                <i class="pi pi-building" />
                            </span>
                        </button>
                        <Divider />
                    </div>
                </Step>
                <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="3">
                    <div class="flex flex-row pl-2" v-bind="a11yAttrs.root">
                        <button
                            class="inline-flex flex-col gap-2 bg-transparent border-0"
                            @click="activateCallback"
                            v-bind="a11yAttrs.header"
                        >
                            <span
                                :class="[
                                    'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                                    {
                                        'bg-primary text-primary-contrast border-primary':
                                            value <= activeStep,
                                        'border-surface-200 dark:border-surface-700':
                                            value > activeStep
                                    }
                                ]"
                            >
                                <i class="pi pi-id-card" />
                            </span>
                        </button>
                    </div>
                </Step>
            </StepList>
            <StepPanels>
                <StepPanel v-slot="{ activateCallback }" :value="1">
                    <PersonalInformation />
                    <div class="flex justify-end pt-6">
                        <Button
                            label="Siguiente"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            @click="activateCallback(2)"
                        />
                    </div>
                </StepPanel>
                <StepPanel v-slot="{ activateCallback }" :value="2">
                    <div
                        class="flex flex-col gap-2 mx-auto"
                        style="min-height: 16rem; max-width: 24rem"
                    >
                        <div class="mt-4 mb-4 text-xl font-semibold text-center">
                            Choose your interests
                        </div>
                        <div></div>
                    </div>
                    <div class="flex justify-between pt-6">
                        <Button
                            label="Back"
                            severity="secondary"
                            icon="pi pi-arrow-left"
                            @click="activateCallback(1)"
                        />
                        <Button
                            label="Next"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            @click="activateCallback(3)"
                        />
                    </div>
                </StepPanel>
                <StepPanel v-slot="{ activateCallback }" :value="3">
                    <div
                        class="flex flex-col gap-2 mx-auto"
                        style="min-height: 16rem; max-width: 24rem"
                    >
                        <div class="mt-4 mb-4 text-xl font-semibold text-center">
                            Account created successfully
                        </div>
                        <div class="text-center">
                            <img
                                alt="logo"
                                src="https://primefaces.org/cdn/primevue/images/stepper/content.svg"
                            />
                        </div>
                    </div>
                    <div class="flex justify-start pt-6">
                        <Button
                            label="Back"
                            severity="secondary"
                            icon="pi pi-arrow-left"
                            @click="activateCallback(2)"
                        />
                    </div>
                </StepPanel>
            </StepPanels>
        </Stepper>
    </div>
</template>
