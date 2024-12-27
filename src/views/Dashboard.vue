<script setup>
import RecentPaymentsWidget from '@/components/dashboard/RecentPaymentsWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import PopularMemberships from '@/components/dashboard/PopularMemberships.vue';
import { ref } from 'vue';

const optionsRange = ref(['Diario', 'Semanal', 'Mensual']);
const range = ref('Diario');
</script>

<template>
    <div>
        <SelectButton v-model="range" :options="optionsRange" />
    </div>

    <div class="grid grid-cols-12 gap-8">
        <StatsWidget />
        <div class="col-span-12">
            <RevenueStreamWidget />
        </div>

        <div class="xl:col-span-12">
            <RecentPaymentsWidget />
        </div>
    </div>
</template>
