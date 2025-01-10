<template>
    <div id="hero" class="flex flex-col px-4 lg:px-20 overflow-hidden bg-black">
        <div></div>
        <div class="mt-24 md:mt-36 max-w-3xl mx-auto text-center">
            <h1
                class="text-[42px] sm:text-6xl md:text-7xl lg:text-8xl lg:min-h-52 font-extrabold leading-tight bg-gradient-to-r from-white to-gray-700 bg-clip-text text-transparent"
            >
                Simplifica Tu Negocio Fitness
            </h1>
            <p
                class="font-normal text-sm md:text-xl max-w-2xl leading-normal mx-auto mt-6 md:mt-10 text-gray-200"
            >
                Optimiza tus operaciones, impulsa el crecimiento y mejora la experiencia de tus
                clientes con nuestro sistema integral de gestión para gimnasios.
            </p>
            <div class="flex gap-4 flex-col md:flex-row justify-center">
                <Button class="font-bold mt-10 !p-4 !text-black"> Solicita Una Demo </Button>

                <Button
                    outlined
                    @click="smoothScroll('pricing')"
                    class="md:mt-10 !p-4 !text-white font-bold rounded-md !border-white border hover:bg-primary-200"
                >
                    Ver Planes y Precios
                </Button>
            </div>
        </div>
    </div>
</template>
<script setup>
import smoothScroll from '@/utils/smoothScroll';
</script>
