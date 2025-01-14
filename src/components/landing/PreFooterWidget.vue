<template>
    <div class="text-center py-14 md:py-20 mt-14 bg-gradient-to-b from-slate-950 to-black">
        <div class="flex justify-center gap-8 mb-4">
            <img src="@/assets/img/fuego_landing.png" class="h-12 md:h-16" alt="" />
            <img src="@/assets/img/ciclista_landing.png" class="h-12 md:h-16" alt="" />
            <img src="@/assets/img/entrenador_landing.png" class="h-12 md:h-16" alt="" />
        </div>
        <h2
            class="text-4xl font-extrabold leading-tight text-transparent md:text-5xl md:min-h-14 bg-gradient-to-r from-white to-gray-700 bg-clip-text"
        >
            Lleva tu gimnasio al siguiente nivel
        </h2>
        <div class="mt-8 text-muted-color">
            <p>Optimiza las operaciones de tu gimnasio</p>
            <p>Empieza ahora o solicita una demo para ver como podemos ayudarte</p>
        </div>
        <div class="flex justify-center gap-4">
            <Button
                class="font-bold mt-10 !p-3 !px-8 !text-black"
                as="router-link"
                to="/auth/register"
            >
                Empezar Ahora
            </Button>

            <!-- <Button
                outlined
                @click="smoothScroll('contact')"
                class="mt-10 !p-3 !text-white font-bold rounded-md !border-white border hover:bg-primary-200"
            >
                Solicita Una Demo
            </Button> -->
        </div>
    </div>
</template>
<script setup></script>
