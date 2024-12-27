<script setup>
import { useLayout } from '@/layout/composables/layout';
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppConfigurator from './AppConfigurator.vue';

const store = useIndexStore();
const loading = ref(false);
const op = ref();
const router = useRouter();

const { toggleDarkMode, isDarkTheme } = useLayout();

onMounted(async () => {
    // Habilitar dark mode si no está habilitado
    if (!isDarkTheme.value) {
        toggleDarkMode();
    }

    // Verificar autenticación del usuario
    if (!pb.authStore.isValid) {
        router.push({ name: 'login' });
        return; // Detener ejecución si no está autenticado
    }

    // Obtener usuario logueado si no está cargado
    if (!store.userLogged) {
        await getUserLogged();
    }

    // Obtener gimnasio actual si no está definido
    if (!store.currentGym) {
        await getCurrentGym(store.userLogged.gimnasio_id);
    }
});

const toggle = (event) => {
    op.value.toggle(event);
};

const getUserLogged = async () => {
    try {
        loading.value = true;

        const user = await pb.collection('users').getOne(pb.authStore.record.id);

        // guardando informacion de usuario
        store.setUserLogged(user);
    } catch (error) {
        router.push({ name: 'login' });
        console.log(error);
    } finally {
        loading.value = false;
    }
};

const getCurrentGym = async (id) => {
    try {
        loading.value = true;

        const gym = await pb.collection('gimnasios').getOne(id);

        // guardando informacion de usuario
        store.setCurrentGym(gym);
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};

const logout = () => {
    pb.authStore.clear();
    router.push({ name: 'login' });
};
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <AppConfigurator />
            <!-- <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button> -->
            <router-link to="/" class="layout-topbar-logo" style="gap: 0.2rem">
                <img
                    :src="
                        isDarkTheme
                            ? '/src/assets/img/logo-white.png'
                            : '/src/assets/img/logo-black.png'
                    "
                    alt="logo"
                    width="35px"
                />

                <p class="font-extrabold">Gym<span class="font-bold text-primary">Master</span></p>
            </router-link>
        </div>
        <div class="flex items-center gap-2">
            <Avatar
                shape="circle"
                :label="store.currentGym?.nombre?.substring(0, 1)"
                v-if="!store.currentGym.logo"
            />
            <Avatar shape="circle" :image="store.currentGym.lgoo" v-else />

            <p class="font-semibold">
                {{ store.currentGym?.nombre }} <span class="mx-2">|</span>
                {{ store.currentGym?.direccion }}
            </p>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
            </div>

            <div v-if="!loading">
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

            <ProgressSpinner style="width: 27px; height: 27px" v-else strokeWidth="4" />
        </div>
    </div>
</template>
