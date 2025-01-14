<script setup>
import logoBlack from '@/assets/img/logo-black.png';
import logoWhite from '@/assets/img/logo-white.png';
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

const getCurrentGym = async (id) => {
    try {
        loading.value = true;

        const gym = await pb.collection('gimnasios').getOne(id, { expand: 'servicio_id' });

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
    store.currentGym = null;
    router.push({ name: 'login' });
};
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <!-- <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button> -->
            <router-link to="/admin/dashboard" class="layout-topbar-logo" style="gap: 0.2rem">
                <img :src="isDarkTheme ? logoWhite : logoBlack" alt="logo" width="35px" />

                <p class="font-extrabold">Gym<span class="font-bold text-primary">Admin</span></p>
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

                        <span class="font-medium">
                            {{ store.sucursales[0].direccion }}
                        </span>
                    </div>
                    <i class="ml-1 pi {pi-fw} pi-arrows-v"></i>
                </Button>

                <div
                    class="w-4 h-4 ml-1 bg-red-400 rounded-full cursor-pointer circle pulse"
                    v-tooltip.bottom="'Estás al día'"
                ></div>
            </div>
        </div>

        <div class="layout-topbar-actions">
            <div v-if="store.currentGym?.expand?.servicio_id?.precio == 0">
                <Button
                    rounded
                    size="small"
                    label="Explorar premium"
                    severity="contrast"
                    as="router-link"
                    to="/cambiar-plan"
                ></Button>
            </div>

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

<style>
.circle {
    box-shadow: 0px 0px 1px 1px #7ee9031a !important;
}

.pulse {
    animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
    0% {
        box-shadow: 0 0 0 0px rgba(201, 255, 5, 0.863);
    }
    100% {
        box-shadow: 0 0 0 10px rgba(218, 238, 43, 0);
    }
}
</style>
