import { defineStore } from 'pinia';

export const useIndexStore = defineStore('index', {
    state: () => {
        return { userLogged: null };
    },
    getters: {
        getUserLogged: (state) => state.userLogged
    },
    actions: {
        setUserLogged(user) {
            this.userLogged = user;
        }
    }
});
