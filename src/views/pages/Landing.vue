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
        <div id="home" class="landing-wrapper overflow-hidden max-w-[1600px] mx-auto">
            <TopbarWidget />
            <HeroWidget />
            <FeaturesWidget />
            <HighlightsWidget />
            <PricingWidget />
            <ContactWidget />
        </div>
        <PreFooterWidget />
        <div class="overflow-hidden max-w-[1600px] mx-auto">
            <FooterWidget />
        </div>
    </div>
</template>
