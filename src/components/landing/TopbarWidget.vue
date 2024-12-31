<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onMounted } from 'vue';
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
        class="relative flex items-center justify-between px-2 py-1 mx-20 mt-4 border rounded-xl !border-gray-600"
        style="background: #00000020; backdrop-filter: blur(5px)"
    >
        <router-link to="/" class="flex items-center layout-topbar-logo" style="gap: 0.2rem">
            <img src="/src/assets/img/logo-white.png" alt="logo" width="35px" />
            <p class="font-extrabold">
                Gym<span class="text-lg font-bold text-primary">Master</span>
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
            class="absolute flex flex-row items-center gap-8 list-none transform cursor-pointer left-1/2 lg:-translate-x-1/2"
        >
            <li>
                <a @click="smoothScroll('hero')" class="px-0 py-4 text-lg font-bold text-surface-0">
                    <span>Inicio</span>
                </a>
            </li>
            <li>
                <a
                    @click="smoothScroll('features')"
                    class="px-0 py-4 text-lg font-medium text-surface-0 text-muted-color"
                >
                    <span>Características</span>
                </a>
            </li>
            <li>
                <a
                    @click="smoothScroll('pricing')"
                    class="px-0 py-4 text-lg font-medium text-surface-0 text-muted-color"
                >
                    <span>Precios</span>
                </a>
            </li>
            <li>
                <a
                    @click="smoothScroll('contact')"
                    class="px-0 py-4 text-lg font-medium text-surface-0 text-muted-color"
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
                to="/auth/login"
                size="small"
                variant="link"
            ></Button>
            <Button
                label="Registrarse"
                to="/auth/login"
                class="!rounded-xl !py-4 !border-none !text-black"
                size="small"
            ></Button>
        </div>
    </div>
</template>
