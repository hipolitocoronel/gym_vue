<script setup lang="ts">
import ContactWidget from '@/components/landing/ContactWidget.vue';
import FeaturesWidget from '@/components/landing/FeaturesWidget.vue';
import FooterWidget from '@/components/landing/FooterWidget.vue';
import HeroWidget from '@/components/landing/HeroWidget.vue';
import HighlightsWidget from '@/components/landing/HighlightsWidget.vue';
import PreFooterWidget from '@/components/landing/PreFooterWidget.vue';
import PricingWidget from '@/components/landing/PricingWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
import AppConfigurator from '@/layout/AppConfigurator.vue';
</script>

<template>
    <div class="bg-black">
        <AppConfigurator />
        <div
            class="absolute top-0 left-0 z-10 w-full h-20 px-3 py-2 bg-gradient-to-b from-slate-950 to-black"
        ></div>

        <div id="home" class="landing-wrapper overflow-hidden max-w-[1600px] mx-auto anima">
            <TopbarWidget />
            <HeroWidget />
            <FeaturesWidget class="mt-40 mb-60" />
            <HighlightsWidget class="border-red-400 mb-60" />
            <PricingWidget class="mb-44" />
            <ContactWidget />
        </div>
        <PreFooterWidget />
        <div class="overflow-hidden max-w-[1600px] mx-auto">
            <FooterWidget />
        </div>
    </div>
</template>
