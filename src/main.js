import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import Aura from '@primevue/themes/aura';

import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import vue3GoogleLogin from 'vue3-google-login';
const googleOpc = {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
};

const app = createApp(App);
const pinia = createPinia();

app.use(vue3GoogleLogin, googleOpc);
app.use(router);
app.use(pinia);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(autoAnimatePlugin);
app.directive('tooltip', Tooltip);
app.mount('#app');
