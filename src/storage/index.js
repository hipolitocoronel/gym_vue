import { defineStore } from 'pinia';

export const useIndexStore = defineStore('index', {
    state: () => {
        return {
            userLogged: null,
            currentGym: null,
            sucursales: [{ direccion: '' }],
            currentSucursal: null,
            activeConfigTab: 'tu-gimnasio',
            estadoServicio: null
        };
    },
    getters: {
        getUserLogged: (state) => state.userLogged,
        getCurrentGym: (state) => state.currentGym,
        srcLogoGym: (state) => {
            const backend = import.meta.env.VITE_BACKEND_URL;

            if (!state.currentGym || !state.currentGym.logo) return null;

            const { collectionId, id, logo } = state.currentGym;

            return `${backend}/api/files/${collectionId}/${id}/${logo}`;
        },
        servicio: (state) => {
            return state.currentGym?.expand?.servicio_id;
        },
        servicioEstado: (state) => {
            return state.estadoServicio;
        }
    },
    actions: {
        setUserLogged(user) {
            this.userLogged = user;
        },
        setCurrentGym(gym) {
            this.currentGym = gym;
        },
        setSucursales(sucursales) {
            this.sucursales = sucursales;
        },
        setCurrentSucursal(sucursal) {
            this.currentSucursal = sucursal;
        },
        setActiveConfigTab(tab) {
            this.activeConfigTab = tab;
        },
        setEstadoServicio(estado) {
            this.estadoServicio = estado;
        }
    }
});
