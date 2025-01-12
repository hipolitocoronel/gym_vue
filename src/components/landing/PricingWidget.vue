<template>
    <div id="pricing" class="pt-10 px-6 md:px-10 lg:px-6 xl:px-20">
        <div class="text-center mb-4 mt-14">
            <div
                class="text-4xl md:text-5xl md:min-h-14 font-extrabold leading-tight mb-2 bg-gradient-to-r from-white to-gray-700 bg-clip-text text-transparent"
            >
                Planes Diseñados Para Tu Bolsillo
            </div>
            <p class="text-muted-color">
                Elige el plan que mejor se adapte a tu gimnasio. Todos incluyen nuestras
                características principales.
            </p>
        </div>
        <div class="flex flex-col lg:flex-row gap-8 mt-8 md:mt-0">
            <div class="grow p-0 mt-6" v-for="service in services">
                <PricingCard :service />
            </div>
        </div>
    </div>
</template>
<script setup>
import pb from '@/service/pocketbase';
import { onMounted, ref } from 'vue';
import PricingCard from './PricingCard.vue';
const services = ref([]);

onMounted(async () => {
    try {
        const result = await pb.collection('servicios').getFullList();
        services.value = result;
    } catch (error) {
        console.log(error);
    }
});
</script>
<style scoped>
.pricing-card {
    @apply p-4 flex flex-col cursor-pointer border-black border-2 hover:border-primary hover:bg-none duration-300 transition-all rounded-[10px] bg-gradient-to-b from-slate-950 to-black bg-slate-950;
}
</style>
