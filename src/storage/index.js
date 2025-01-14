import { defineStore } from 'pinia';

export const useIndexStore = defineStore('index', {
    state: () => {
        return {
            userLogged: null,
            currentGym: null,
            sucursales: [{ direccion: '' }],
            currentSucursal: null,
            currentSucursalIndex: 0,
            activeConfigTab: 'tu-informacion'
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
        setCurrentSucursalIndex(index) {
            this.currentSucursalIndex = index;
            localStorage.setItem('currentSucursalIndex', index.toString());
        }
    }
});
