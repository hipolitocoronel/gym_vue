<template>
    <div id="hero" class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden bg-black">
        <div class="mt-0 md:mt-16 max-w-3xl mx-auto text-center">
            <h1
                class="text-8xl font-extrabold leading-tight bg-gradient-to-r from-white to-gray-700 bg-clip-text text-transparent"
            >
                Simplifica Tu Negocio Fitness
            </h1>
            <p class="font-normal text-xl max-w-2xl leading-normal mx-auto md:mt-8 text-gray-200">
                Optimiza tus operaciones, impulsa el crecimiento y mejora la experiencia de tus
                clientes con nuestro sistema integral de gestión para gimnasios.
            </p>
            <div class="flex gap-4 justify-center">
                <Button class="font-bold mt-10 !p-4 !text-black"> Solicta Una Demo </Button>

                <Button
                    outlined
                    @click="smoothScroll('pricing')"
                    class="mt-10 !p-4 !text-white font-bold rounded-md !border-white border hover:bg-primary-200"
                >
                    Ver Planes y Precios
                </Button>
            </div>
        </div>
    </div>
</template>
<script setup>
function smoothScroll(id) {
    document.body.click();
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
</script>
