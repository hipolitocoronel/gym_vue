<template>
    <div class="pricing-card overflow-hidden animate-flipright">
        <div
            :class="{ invisible: !service.prueba_gratuita }"
            class="bg-primary-800 block w-fit p-2 font-bold -m-4 mb-2 rounded-ee-md"
        >
            Gratis por 1 mes
        </div>
        <div
            class="text-surface-900 dark:text-surface-0 text-start my-8 pl-2 text-2xl font-semibold"
        >
            {{ service.nombre }}
        </div>
        <div class="my-8 flex flex-col items-center gap-4">
            <div class="flex items-center">
                <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0"
                    >$ {{ service.precio.toLocaleString() }}</span
                >
                <span class="text-surface-600 dark:text-surface-200">por mes</span>
            </div>
        </div>
        <Divider class="w-full"></Divider>

        <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-4">
            <li class="py-2" v-for="feature of parsedFeatures">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span>{{ feature }}</span>
            </li>
        </ul>
        <Button
            label="Empezar Ahora"
            as="router-link"
            to="/auth/register"
            class="!border-none !py-3 !font-bold !bg-gray-700 !text-white hover:!bg-primary duration-300 transition-all hover:!text-black"
        ></Button>
    </div>
</template>
<script setup>
import { computed, defineProps } from 'vue';
const props = defineProps({
    service: Object
});
const parsedFeatures = computed(() => {
    return props.service.caracteristicas
        .split('</p>')
        .map((p) => p.replace('<p>', '').trim())
        .filter((p) => p.length > 0);
});
</script>
<style scoped>
.pricing-card {
    @apply p-4 flex flex-col cursor-pointer border-black border-2 hover:border-primary hover:bg-none duration-300 transition-all rounded-[10px] bg-gradient-to-b from-slate-950 to-black bg-slate-950;
}
</style>
