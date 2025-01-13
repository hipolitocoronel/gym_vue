<script setup>
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { computed, onMounted, ref } from 'vue';

const services = ref([]);
const store = useIndexStore();
onMounted(() => getServices());

const getServices = async () => {
    try {
        const result = await pb.collection('servicios').getFullList();
        services.value = result;
    } catch (error) {
        console.log(error);
    }
};

const currentPlanId = computed(() => store.currentGym?.expand?.servicio_id?.id || 0);
</script>

<template>
    <div class="card">
        <div class="flex flex-col gap-8 mt-8 lg:flex-row md:mt-0">
            <div class="p-0 mt-6 grow" v-for="service in services">
                <PricingCard :service :currentPlan="service.id === currentPlanId" />
            </div>
        </div>
    </div>
</template>
