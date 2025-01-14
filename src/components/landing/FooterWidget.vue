<template>
    <div class="py-5 px-6 mx-0 mt-0 md:mt-10 lg:mx-20">
        <div class="grid grid-cols-12 gap-4 mb-16">
            <div class="col-span-12 md:col-span-3 sm:hidden md:block">
                <a
                    class="flex flex-wrap items-center justify-center md:justify-start md:mb-0 mb-4 cursor-pointer"
                >
                    <img src="/src/assets/img/logo-white.png" alt="logo" width="70px" />
                    <p class="font-extrabold text-white">
                        Gym<span class="font-bold text-primary text-lg">Admin</span>
                    </p>
                </a>
            </div>

            <div class="col-span-12 md:col-span-9">
                <div
                    class="flex sm:justify-between items-center text-center gap-8 flex-col justify-center sm:flex-row"
                >
                    <div>
                        <h4 class="font-medium text-lg text-gray-400">Producto</h4>
                        <ul class="flex flex-col gap-2 mt-2 text-gray-200">
                            <li><a @click="smoothScroll('features')">Características</a @click="smoothScroll('pricing')"></li>
                            <li><a @click="smoothScroll('pricing')">Precios</a @click="smoothScroll('pricing')"></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="font-medium text-lg text-gray-400">Nosotros</h4>
                        <ul class="flex flex-col gap-2 mt-2 text-gray-200">
                            <li><a @click="smoothScroll('pricing')">Acerca de</a @click="smoothScroll('pricing')"></li>
                            <li><a @click="smoothScroll('contact')">Contacto</a @click="smoothScroll('pricing')"></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="font-medium text-lg text-gray-400">Legal</h4>
                        <ul class="flex flex-col gap-2 mt-2 text-gray-200">
                            <li><a @click="smoothScroll('pricing')">Términos de Servicio</a @click="smoothScroll('pricing')"></li>
                            <li><a @click="smoothScroll('pricing')">Política de Privacidad</a @click="smoothScroll('pricing')"></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <Divider />
        <div
            class="flex justify-between flex-col sm:flex-row gap-3 items-center sm:mb-2 mt-4 sm:mt-7 text-gray-300"
        >
            <p class="text-sm sm:text-base">© 2024 GymAdmin. Todos los derechos reservados</p>
            <div class="flex gap-4">
                <a href="https://www.facebook.com/" target="_blank">
                    <i class="pi pi-facebook sm:!text-lg"></i>
                </a>
                <a href="https://www.instagram.com/" target="_blank">
                    <i class="pi pi-instagram sm:!text-lg"></i>
                </a>
                <a href="https://www.x.com/" target="_blank">
                    <i class="pi pi-twitter sm:!text-lg"></i>
                </a>
            </div>
        </div>
    </div>
</template>
<script setup>
import smoothScroll from '@/utils/smoothScroll';
</script>
<style scoped>
a{
    cursor: pointer;
}
</style>