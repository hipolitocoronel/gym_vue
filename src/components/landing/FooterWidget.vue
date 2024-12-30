<template>
    <div class="py-6 px-6 mx-0 mt-20 lg:mx-20">
        <div class="grid grid-cols-12 gap-4 mb-16">
            <div class="col-span-12 md:col-span-3">
                <a
                    @click="smoothScroll('#home')"
                    class="flex flex-wrap items-center justify-center md:justify-start md:mb-0 mb-4 cursor-pointer"
                >
                    <img src="/src/assets/img/logo-white.png" alt="logo" width="70px" />
                    <p class="font-extrabold text-white">
                        Gym<span class="font-bold text-primary text-lg">Master</span>
                    </p>
                </a>
            </div>

            <div class="col-span-12 md:col-span-9">
                <div class="grid grid-cols-12 gap-8 text-center md:text-left">
                    <div class="col-span-12 md:col-span-4">
                        <h4 class="font-medium text-lg text-gray-400">Producto</h4>
                        <ul class="flex flex-col gap-2 mt-2 text-gray-200">
                            <li><router-link>Características</router-link></li>
                            <li><router-link>Precios</router-link></li>
                        </ul>
                    </div>

                    <div class="col-span-12 md:col-span-4">
                        <h4 class="font-medium text-lg text-gray-400">Nosotros</h4>
                        <ul class="flex flex-col gap-2 mt-2 text-gray-200">
                            <li><router-link>Acerca de</router-link></li>
                            <li><router-link>Contacto</router-link></li>
                        </ul>
                    </div>

                    <div class="col-span-12 md:col-span-4">
                        <h4 class="font-medium text-lg text-gray-400">Legal</h4>
                        <ul class="flex flex-col gap-2 mt-2 text-gray-200">
                            <li><router-link>Términos de Servicio</router-link></li>
                            <li><router-link>Política de Privacidad</router-link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <Divider />
        <div class="flex justify-between mb-1 mt-8 text-gray-300">
            <p>© 2024 GymMaster. Todos los derechos reservados</p>
            <div class="flex gap-4">
                <a href="https://www.facebook.com/" target="_blank">
                    <i class="pi pi-facebook !text-lg"></i>
                </a>
                <a href="https://www.instagram.com/" target="_blank">
                    <i class="pi pi-instagram !text-lg"></i>
                </a>
                <a href="https://www.x.com/" target="_blank">
                    <i class="pi pi-twitter !text-lg"></i>
                </a>
            </div>
        </div>
    </div>
</template>
