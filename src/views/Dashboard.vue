<script setup>
import PopularMemberships from '@/components/dashboard/PopularMemberships.vue';
import RecentPaymentsWidget from '@/components/dashboard/RecentPaymentsWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
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
