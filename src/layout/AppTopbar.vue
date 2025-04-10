<script setup>
import logoBlack from '@/assets/img/logo-black.png';
import logoWhite from '@/assets/img/logo-white.png';
import { useLayout } from '@/layout/composables/layout';
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import isSuperAdmin from '@/utils/isSuperAdmin';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const store = useIndexStore();
const loading = ref(false);
const op = ref();
const router = useRouter();
const toast = useToast();
const modalServiceInfo = ref(false);
const branchList = ref();

const { toggleDarkMode, isDarkTheme } = useLayout();

const toggle = (event) => {
    op.value.toggle(event);
};

const toggleSucursales = (event) => {
    branchList.value.menuSucursales.toggle(event);
};

const logout = () => {
    pb.authStore.clear();
    store.setUserLogged(null);
    store.currentGym = null;
    router.push({ name: 'login' });
    localStorage.removeItem('currentSucursalIndex');
};

onMounted(() => {
    axios
        .get(`${pb.baseURL}/api/servicio/estado/${store.currentGym.id}`)
        .then((res) => {
            store.setEstadoServicio(res?.data?.data);
            modalServiceInfo.value = !store.servicioEstado?.puede_usar_servicio;
        })
        .catch(() => {
            pb.authStore.clear();
            store.setUserLogged(null);
            router.push({ name: 'login' });
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al obtener el estado del servicio, contacte al administrador',
                life: 3000
            });
        });
});
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <router-link to="/admin/dashboard" class="layout-topbar-logo" style="gap: 0.2rem">
                <img :src="isDarkTheme ? logoWhite : logoBlack" alt="logo" width="35px" />

                <p class="font-extrabold">Gym<span class="font-bold text-primary">Admin</span></p>
            </router-link>
        </div>
        <div class="flex items-center gap-2" v-if="!isSuperAdmin()">
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
                            {{ store.currentSucursal.direccion }}
                        </span>
                    </div>
                    <i class="ml-1 pi {pi-fw} pi-arrows-v"></i>
                </Button>

                <div
                    class="w-4 h-4 ml-1 rounded-full cursor-pointer circle pulse"
                    v-if="store.servicioEstado"
                    :class="{
                        'bg-green-400': store.servicioEstado.puede_usar_servicio,
                        'bg-red-400': !store.servicioEstado.puede_usar_servicio
                    }"
                    v-tooltip.bottom="store.servicioEstado.mensaje"
                    @click="modalServiceInfo = true"
                ></div>
            </div>
        </div>

        <div class="layout-topbar-actions">
            <div v-if="store.currentGym?.expand?.servicio_id?.precio == 0 && !isSuperAdmin()">
                <Button
                    size="small"
                    severity="contrast"
                    as="router-link"
                    class="!font-bold !rounded-xl !px-4"
                    to="cambiar-plan"
                    >Explorar premium
                </Button>
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

                            <div class="flex justify-between py-2 mx-1 text-muted-color">
                                Plan actual:
                                <span class="justify-end font-bold text-black dark:text-white">
                                    {{ store.servicio?.nombre }}
                                </span>
                            </div>

                            <router-link to="/admin/configuracion" @click="toggle">
                                <div
                                    class="px-2 py-3 my-1 transition-all rounded-md h hover:bg-surface-800"
                                >
                                    <i class="mr-2 pi pi-fw pi-cog"></i>
                                    Configuración
                                </div>
                            </router-link>

                            <Button fluid severity="secondary" @click="logout()" class="mt-3">
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

    <BranchList ref="branchList" />

    <ServiceInfo
        :estadoServicio="store.servicioEstado"
        :visible="modalServiceInfo"
        @closeModal="modalServiceInfo = false"
    />
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
