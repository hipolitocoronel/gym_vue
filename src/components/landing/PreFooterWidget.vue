<template>
    <div class="text-center py-14 md:py-20 mt-14 bg-gradient-to-b from-slate-950 to-black">
        <div class="flex gap-8 justify-center mb-4">
            <img src="@/assets/img/fuego_landing.png" class="h-12 md:h-16" alt="" />
            <img src="@/assets/img/ciclista_landing.png" class="h-12 md:h-16" alt="" />
            <img src="@/assets/img/entrenador_landing.png" class="h-12 md:h-16" alt="" />
        </div>
        <h2
            class="text-4xl md:text-5xl md:min-h-14 font-extrabold leading-tight bg-gradient-to-r from-white to-gray-700 bg-clip-text text-transparent"
        >
            Lleva tu gimnasio al siguiente nivel
        </h2>
        <div class="mt-8 text-muted-color">
            <p>Optimiza las operaciones de tu gimnasio</p>
            <p>Empieza ahora o solicita una demo para ver como podemos ayudarte</p>
        </div>
        <div class="flex gap-4 justify-center">
            <Button class="font-bold mt-10 !p-3 !text-black" as="router-link" to="/auth/register">
                Empezar Ahora
            </Button>

            <Button
                outlined
                @click="smoothScroll('contact')"
                class="mt-10 !p-3 !text-white font-bold rounded-md !border-white border hover:bg-primary-200"
            >
                Solicita Una Demo
            </Button>
        </div>
    </div>
</template>
<script setup>
import smoothScroll from '@/utils/smoothScroll';
</script>
