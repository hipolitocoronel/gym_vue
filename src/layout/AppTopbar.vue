<script setup>
import { useLayout } from '@/layout/composables/layout';
import router from '@/router';
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { onMounted, ref } from 'vue';

const store = useIndexStore();
const op = ref();

const { toggleDarkMode, isDarkTheme } = useLayout();

onMounted(() => {
    // si no está habilitado dark mode se habilita
    !isDarkTheme.value && toggleDarkMode();

    // si el usuario no ingresó, redireccionar a login
    if (!store.getUserLogged) {
        router.push({ name: 'login' });
    }
});

const toggle = (event) => {
    op.value.toggle(event);
};

const logout = () => {
    store.setUserLogged(null);
    pb.authStore.clear();
    router.push({ name: 'login' });
};
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <!-- <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button> -->
            <router-link to="/" class="layout-topbar-logo">
                <img
                    src="https://cdn.logojoy.com/wp-content/uploads/20210517162426/barbell-symbol.png"
                    alt=""
                    width="26px"
                />

                <span><b>GYM</b></span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
            </div>

            <div>
                <Avatar :label="store.getUserLogged?.name?.substring(0, 1)" class="mr-2" />
                <Button
                    type="button"
                    @click="toggle"
                    size="small"
                    variant="text"
                    severity="contrast"
                >
                    <span class="text-base">
                        {{ store.getUserLogged?.name }}
                    </span>
                    <i class="ml-1 pi pi-fw pi-chevron-down"></i>
                </Button>

                <Popover ref="op">
                    <div class="flex flex-col gap-4 w-[18rem]">
                        <div>
                            <span class="block mb-2 font-medium" @click="toggle"> Acciones </span>

                            <Button fluid severity="secondary" @click="logout()">
                                <i class="mr-2 pi pi-sign-out"></i>
                                Cerrar sesión
                            </Button>
                        </div>
                    </div>
                </Popover>
            </div>
        </div>
    </div>
</template>
