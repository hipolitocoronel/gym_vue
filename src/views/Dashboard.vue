<script setup>
import PopularMemberships from '@/components/dashboard/PopularMemberships.vue';
import RecentPaymentsAdminWidget from '@/components/dashboard/RecentPaymentsAdminWidget.vue';
import RecentPaymentsWidget from '@/components/dashboard/RecentPaymentsWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import isSuperAdmin from '@/utils/isSuperAdmin';
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
            <RecentPaymentsAdminWidget v-if="isSuperAdmin()" />
            <RecentPaymentsWidget v-else />
        </div>
    </div>
</template>
