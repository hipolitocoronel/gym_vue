<template>
    <div id="hero" class="flex flex-col px-4 overflow-hidden bg-black lg:px-20">
        <div></div>
        <div class="max-w-3xl mx-auto mt-24 text-center md:mt-36">
            <h1
                class="text-[42px] sm:text-6xl md:text-7xl lg:text-8xl lg:min-h-52 font-extrabold leading-tight bg-gradient-to-r from-white to-gray-700 bg-clip-text text-transparent animate-blurred-fade-in animate-delay-300"
            >
                Simplifica Tu Negocio Fitness
            </h1>
            <p
                class="max-w-2xl mx-auto mt-6 text-sm font-normal leading-normal text-gray-200 md:text-xl md:mt-10 animate-blurred-fade-in animate-delay-400"
            >
                Optimiza tus operaciones, impulsa el crecimiento y mejora la experiencia de tus
                clientes con nuestro sistema integral de gestión para gimnasios.
            </p>
            <div
                class="flex flex-col justify-center gap-4 md:flex-row animate-blurred-fade-in animate-delay-400"
            >
                <Button
                    class="!font-bold mt-10 !rounded-xl !p-4 dark:!text-black"
                    as="router-link"
                    to="/auth/register"
                    >Comenzar Gratis
                </Button>

                <Button
                    outlined
                    @click="smoothScroll('pricing')"
                    class="md:mt-10 !p-4 !text-white font-bold !border-white border hover:bg-primary-200 !rounded-xl"
                >
                    Ver Planes y Precios
                </Button>
            </div>
        </div>

        <div class="w-full aspect-video">
            <img
                src="@/assets/img/captura_sistema.webp"
                class="mt-10 lg:mt-2 animate-fade-in-up animate-delay-700"
                alt="Captura Sistema"
            />
        </div>
    </div>
</template>
<script setup>
import smoothScroll from '@/utils/smoothScroll';
</script>
