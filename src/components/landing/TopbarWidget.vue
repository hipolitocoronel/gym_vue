<script setup>
import { useLayout } from '@/layout/composables/layout';
import smoothScroll from '@/utils/smoothScroll';
import { onMounted, ref } from 'vue';
const { toggleDarkMode, isDarkTheme } = useLayout();

onMounted(() => {
    // Habilitar dark mode si no está habilitado
    if (!isDarkTheme.value) {
        toggleDarkMode();
    }
});

const visible = ref(false);
</script>

<template>
    <div
        class="px-2 py-2 flex items-center justify-between bg-transparent backdrop-blur-lg fixed top-0 left-1/2 transform -translate-x-1/2 rounded-b-xl w-full md:w-[95%] lg:w-[90%] xl:w-[80%] z-50"
    >
        <div class="flex items-center gap-4">
            <Button class="lg:!hidden !text-white" size="large" text @click="visible = true"
                ><i class="pi pi-bars !text-2xl"></i
            ></Button>
            <router-link to="/" class="layout-topbar-logo flex items-center" style="gap: 0.2rem">
                <img src="/src/assets/img/logo-white.png" alt="logo" width="35px" />
                <p class="font-extrabold text-white">
                    Gym<span class="font-bold text-primary text-lg">Master</span>
                </p>
            </router-link>
        </div>

        <ul
            class="list-none lg:flex items-center flex-row cursor-pointer gap-8 absolute left-1/2 hidden transform md:-translate-x-1/2"
        >
            <li>
                <a
                    @click="smoothScroll('hero')"
                    class="px-0 py-4 text-white font-medium lg:text-lg"
                >
                    <span>Inicio</span>
                </a>
            </li>
            <li>
                <a
                    @click="smoothScroll('features')"
                    class="px-0 py-4 text-white font-medium lg:text-lg"
                >
                    <span>Características</span>
                </a>
            </li>
            <li>
                <a
                    @click="smoothScroll('pricing')"
                    class="px-0 py-4 text-white font-medium lg:text-lg"
                >
                    <span>Precios</span>
                </a>
            </li>
            <li>
                <a
                    @click="smoothScroll('contact')"
                    class="px-0 py-4 text-white font-medium lg:text-lg"
                >
                    <span>Contacto</span>
                </a>
            </li>
        </ul>

        <div class="lg:flex gap-2 hidden">
            <Button
                label="Iniciar Sesión"
                as="router-link"
                text
                to="/auth/login"
                class="!rounded-xl !border-gray-200 !text-white"
            ></Button>
            <Button
                label="Registrarse"
                to="/auth/login"
                class="!rounded-xl !py-4 !border-none !text-black"
            ></Button>
        </div>
        <Drawer
            v-model:visible="visible"
            class="!w-[22rem] !border-0 !border-r !border-r-surface-700"
        >
            <template #container="{ closeCallback }">
                <div class="flex flex-col h-full bg-black">
                    <div class="flex items-center justify-between px-6 pt-4 shrink-0">
                        <div class="flex items-center gap-4">
                            <img src="/src/assets/img/logo-white.png" alt="logo" width="35px" />
                            <p class="font-extrabold text-white">
                                Gym<span class="font-bold text-primary text-lg">Master</span>
                            </p>
                        </div>
                        <span>
                            <Button
                                type="button"
                                @click="closeCallback"
                                icon="pi pi-times"
                                text
                                class="!text-white -mr-4"
                            ></Button>
                        </span>
                    </div>
                    <hr
                        class="mt-4 mx-4 border-t border-0 border-surface-200 dark:border-surface-700"
                    />
                    <div class="px-6 mt-16">
                        <ul class="flex flex-col cursor-pointer gap-4">
                            <li>
                                <a
                                    @click="smoothScroll('hero', closeCallback)"
                                    class="px-0 py-4 text-white font-medium text-xl"
                                >
                                    <span>Inicio</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    @click="smoothScroll('features', closeCallback)"
                                    class="px-0 py-4 text-white font-medium text-xl"
                                >
                                    <span>Características</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    @click="smoothScroll('pricing', closeCallback)"
                                    class="px-0 py-4 text-white font-medium text-xl"
                                >
                                    <span>Precios</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    @click="smoothScroll('contact', closeCallback)"
                                    class="px-0 py-4 text-white font-medium text-xl"
                                >
                                    <span>Contacto</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="mt-auto"></div>
                </div>
            </template>
        </Drawer>
    </div>
</template>
