<script setup>
import { useLayout } from '@/layout/composables/layout';
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const store = useIndexStore();
const loading = ref(false);
const op = ref();
const menuSucursales = ref();
const router = useRouter();

const { toggleDarkMode, isDarkTheme } = useLayout();

onMounted(async () => {
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

const toggleSucursales = (event) => {
    menuSucursales.value.toggle(event);
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

        // Obteniendo sucursales
        getSucursales(gym.id);
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};

const getSucursales = async (gym_id) => {
    try {
        loading.value = true;

        const sucursales = await pb
            .collection('sucursales')
            .getFullList({ filter: `gimnasio_id = "${gym_id}"` });

        // guardando informacion de usuario
        store.setSucursales(sucursales);

        store.setCurrentSucursal(sucursales[0]);
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
                v-if="!store.currentGym?.logo"
            />
            <Avatar shape="circle" :image="store.srcLogoGym + '?thumb=50x50'" v-else />

            <div class="flex items-center">
                <span class="ml-1 font-semibold">
                    {{ store.currentGym?.nombre }}
                </span>

                <span class="pl-4">|</span>

                <Button
                    type="button"
                    @click="toggleSucursales"
                    size="small"
                    variant="text"
                    severity="contrast"
                    class="ml-2"
                >
                    <div class="text-base">
                        <span class="mr-2"> Sucursal: </span>

                        {{ store.sucursales[0].direccion }}
                    </div>
                    <i class="ml-1 pi {pi-fw} pi-arrows-v"></i>
                </Button>
            </div>
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

    <Popover ref="menuSucursales">
        <div class="flex flex-col gap-2 w-[22rem]">
            <p class="p-1 mb-1 font-semibold">Listado de sucursales</p>
            <div v-for="sucursal in store.sucursales">
                <Button
                    fluid
                    severity="secondary"
                    :variant="store.currentSucursal.id == sucursal.id ? 'secondary' : 'text'"
                >
                    <div class="flex w-full gap-3 text-start">
                        <span class="flex-1">{{ sucursal.nombre }}</span>

                        <span class="flex-1 text-end"> {{ sucursal.direccion }}</span>
                    </div>
                </Button>
            </div>
        </div>
    </Popover>
</template>
