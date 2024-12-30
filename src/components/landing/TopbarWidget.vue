<script setup>
import { onMounted } from 'vue';
import { useLayout } from '@/layout/composables/layout';
const { toggleDarkMode, isDarkTheme } = useLayout();

onMounted(() => {
    // Habilitar dark mode si no está habilitado
    if (!isDarkTheme.value) {
        toggleDarkMode();
    }
});

function smoothScroll(id) {
    document.body.click();
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
</script>

<template>
    <div
        class="mt-4 mx-20 px-2 py-1 flex items-center justify-between bg-white rounded-xl relative"
    >
        <router-link to="/" class="layout-topbar-logo flex items-center" style="gap: 0.2rem">
            <img src="/src/assets/img/logo-black.png" alt="logo" width="35px" />
            <p class="font-extrabold text-black">
                Gym<span class="font-bold text-primary text-lg">Master</span>
            </p>
        </router-link>

        <Button
            class="lg:!hidden"
            text
            severity="secondary"
            rounded
            v-styleclass="{
                selector: '@next',
                enterFromClass: 'hidden',
                enterActiveClass: 'animate-scalein',
                leaveToClass: 'hidden',
                leaveActiveClass: 'animate-fadeout',
                hideOnOutsideClick: true
            }"
        >
            <i class="pi pi-bars !text-2xl"></i>
        </Button>

        <!-- Enlaces de navegación centrados -->
        <ul
            class="list-none flex items-center flex-row cursor-pointer gap-8 absolute left-1/2 transform lg:-translate-x-1/2"
        >
            <li>
                <a
                    @click="smoothScroll('hero')"
                    class="px-0 py-4 text-surface-0 dark:text-surface-900 font-medium text-lg"
                >
                    <span>Inicio</span>
                </a>
            </li>
            <li>
                <a
                    @click="smoothScroll('features')"
                    class="px-0 py-4 text-surface-0 dark:text-surface-900 font-medium text-lg"
                >
                    <span>Características</span>
                </a>
            </li>
            <li>
                <a
                    @click="smoothScroll('pricing')"
                    class="px-0 py-4 text-surface-0 dark:text-surface-900 font-medium text-lg"
                >
                    <span>Precios</span>
                </a>
            </li>
            <li>
                <a
                    @click="smoothScroll('contact')"
                    class="px-0 py-4 text-surface-0 dark:text-surface-900 font-medium text-lg"
                >
                    <span>Contacto</span>
                </a>
            </li>
        </ul>

        <!-- Botones de inicio de sesión y registro -->
        <div class="flex gap-2">
            <Button
                label="Iniciar Sesión"
                as="router-link"
                text
                to="/auth/login"
                class="!rounded-xl !border-gray-200 !text-black"
            ></Button>
            <Button
                label="Registrarse"
                to="/auth/login"
                class="!rounded-xl !py-4 !border-none !text-black"
            ></Button>
        </div>
    </div>
</template>
