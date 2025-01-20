<template>
    <div
        :class="props.currentPlan ? 'border-primary' : 'border-black '"
        class="overflow-hidden pricing-card animate-flipright animate-duration-400"
    >
        <div
            :class="{ invisible: !service.prueba_gratuita && !props?.currentPlan }"
            class="block px-4 py-2 mb-2 -m-4 font-bold bg-primary-800 w-fit rounded-ee-md"
        >
            {{ props?.currentPlan ? 'Plan Actual' : ' Gratis por 1 mes' }}
        </div>
        <div
            class="pl-2 my-8 text-2xl font-semibold text-surface-900 dark:text-surface-0 text-start"
        >
            {{ service.nombre }}
        </div>
        <div class="flex flex-col items-center gap-4 my-8">
            <div class="flex items-center">
                <span class="mr-2 text-5xl font-bold text-surface-900 dark:text-surface-0"
                    >$ {{ service.precio.toLocaleString() }}</span
                >
                <span class="text-surface-600 dark:text-surface-200">por mes</span>
            </div>
        </div>
        <Divider class="w-full"></Divider>

        <ul class="flex flex-col p-0 px-4 my-8 list-none text-surface-900 dark:text-surface-0">
            <li class="py-2" v-for="feature of parsedFeatures">
                <i class="mr-2 text-xl pi pi-fw pi-check text-cyan-500"></i>
                <span>{{ feature }}</span>
            </li>
        </ul>
        <Button
            label="Empezar Ahora"
            as="router-link"
            :to="'/auth/register?service=' + service.id"
            class="!border-none !py-3 !font-bold !bg-gray-700 !text-white hover:!bg-primary duration-300 transition-all hover:!text-black"
            :class="props.currentPlan ? 'invisible' : ''"
            v-if="!props.gimnasioId"
        ></Button>
        <Button
            label="Comenzar Ahora"
            :loading="loading"
            @click="goToMercadopago()"
            class="!border-none !py-3 !font-bold !bg-gray-700 !text-white hover:!bg-primary duration-300 transition-all hover:!text-black"
            :class="props.currentPlan ? 'invisible' : ''"
            v-else
        ></Button>
    </div>
</template>
<script setup>
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { computed, defineProps, ref } from 'vue';

const props = defineProps({
    service: Object,
    currentPlan: Boolean,
    gimnasioId: String
});

const toast = useToast();
const loading = ref(false);

const parsedFeatures = computed(() => {
    return props.service.caracteristicas
        .split('</p>')
        .map((p) => p.replace('<p>', '').trim())
        .filter((p) => p.length > 0);
});

const goToMercadopago = () => {
    const baseUrl = import.meta.env.VITE_MP_BACKEND_URL;
    const payload = {
        gimnasio_id: props.gimnasioId,
        servicio_id: props.service.id
    };

    loading.value = true;
    axios
        .post(`${baseUrl}/api/products`, payload)
        .then((res) => {
            if (res?.data?.init_point) {
                window.location.href = res.data.init_point;
            } else {
                toast.add({
                    severity: 'success',
                    summary: 'Operación exitosa',
                    detail: res.data.message,
                    life: 5000
                });
            }
        })
        .catch((e) => console.error(e))
        .finally(() => (loading.value = false));
};
</script>
<style scoped>
.pricing-card {
    @apply p-4 flex flex-col cursor-pointer border-2 hover:border-primary hover:bg-none duration-300 transition-all rounded-[10px] bg-gradient-to-b from-slate-950 to-black bg-slate-950;
}
</style>
