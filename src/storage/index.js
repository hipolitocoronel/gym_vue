import pb from '@/service/pocketbase';
import { defineStore } from 'pinia';

export const useIndexStore = defineStore('index', {
    state: () => {
        return {
            userLogged: null,
            currentGym: null,
            sucursales: [{ direccion: '' }],
            currentSucursal: null,
            activeConfigTab: 'tu-gimnasio',
            statusService: null
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
        }
    },
    actions: {
        setUserLogged(user) {
            this.userLogged = user;
        },
        setCurrentGym(gym) {
            this.currentGym = gym;

            if (gym.expand.servicio_id.precio > 0) {
                pb.collection('servicios_pagos')
                    .getList(1, 1, {
                        sort: '-created',
                        filter: `gimnasio_id = "${gym.id}" && servicio_id = "${gym.expand.servicio_id.id}"`
                    })
                    .then((resp) => {
                        const ultimoPago = resp.items[0];

                        if (ultimoPago.estado === 'pagado') {
                            this.statusService = {
                                status: true,
                                message: 'Servicio gratuito'
                            };
                        } else {
                            this.statusService = {
                                status: false,
                                message: 'Servicio vencido'
                            };
                        }
                    });
            } else {
                this.statusService = {
                    status: true,
                    message: 'Servicio gratuito'
                };
            }
        },
        setSucursales(sucursales) {
            this.sucursales = sucursales;
        },
        setCurrentSucursal(sucursal) {
            this.currentSucursal = sucursal;
        },
        setActiveConfigTab(tab) {
            this.activeConfigTab = tab;
        }
    }
});
