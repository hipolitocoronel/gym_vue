import { defineStore } from 'pinia';

export const useIndexStore = defineStore('index', {
    state: () => {
        return { userLogged: null, currentGym: null };
    },
    getters: {
        getUserLogged: (state) => state.userLogged
    },
    actions: {
        setUserLogged(user) {
            this.userLogged = user;
        },
        setCurrentGym(gym) {
            this.currentGym = gym;
        }
    }
});
