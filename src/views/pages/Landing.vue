<script setup lang="ts">
import ContactWidget from '@/components/landing/ContactWidget.vue';
import FeaturesWidget from '@/components/landing/FeaturesWidget.vue';
import FooterWidget from '@/components/landing/FooterWidget.vue';
import HeroWidget from '@/components/landing/HeroWidget.vue';
import HighlightsWidget from '@/components/landing/HighlightsWidget.vue';
import PricingWidget from '@/components/landing/PricingWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
</script>

<template>
    <div class="bg-black">
        <div id="home" class="overflow-hidden landing-wrapper">
            <div
                class="absolute left-0 right-0 top-0 h-40 bg-gradient-to-b from-blue-400/20 from-15% to-black"
            ></div>

            <div style="width: 60%; margin: auto">
                <TopbarWidget />
            </div>

            <HeroWidget />
            <FeaturesWidget />
            <HighlightsWidget />
            <PricingWidget />
            <ContactWidget />

            <FooterWidget />
        </div>
    </div>
</template>
