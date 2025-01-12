<script setup>
import RecentPaymentsWidget from '@/components/dashboard/RecentPaymentsWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import PopularMemberships from '@/components/dashboard/PopularMemberships.vue';
import { ref } from 'vue';

const options = ref(['Diario', 'Semanal', 'Mensual']);
const value = ref('Diario');
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <StatsWidget />
        <div class="col-span-12 xl:col-span-8">
            <RevenueStreamWidget />
        </div>
        <div class="col-span-12 xl:col-span-4">
            <PopularMemberships />
        </div>
        <div class="col-span-12">
            <RecentPaymentsWidget />
        </div>
    </div>
</template>
