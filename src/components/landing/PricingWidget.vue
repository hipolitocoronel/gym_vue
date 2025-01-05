<template>
    <div id="pricing" class="pt-10 px-6 md:px-10 lg:px-6 xl:px-20">
        <div class="text-center mb-4 mt-14">
            <div
                class="text-4xl md:text-5xl md:min-h-14 font-extrabold leading-tight mb-2 bg-gradient-to-r from-white to-gray-700 bg-clip-text text-transparent"
            >
                Planes Diseñados Para Tu Bolsillo
            </div>
            <p class="text-muted-color">
                Elige el plan que mejor se adapte a tu gimnasio. Todos incluyen nuestras
                características principales.
            </p>
        </div>

        <div class="grid grid-cols-12 gap-8 justify-between mt-8 md:mt-0">
            <div class="col-span-12 lg:col-span-4 p-0 mt-6">
                <div class="pricing-card">
                    <div
                        class="text-surface-900 dark:text-surface-0 text-start my-8 pl-2 text-2xl font-semibold"
                    >
                        Plan Gratuito
                    </div>
                    <div class="my-8 flex flex-col items-center gap-4">
                        <div class="flex items-center">
                            <span
                                class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0"
                                >$0</span
                            >
                            <span class="text-surface-600 dark:text-surface-200">por mes</span>
                        </div>
                    </div>
                    <Divider class="w-full"></Divider>
                    <ul
                        class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-4"
                    >
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span>Administra hasta 10 miembros</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span>Administra 1 sucursal</span>
                        </li>

                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span>Soporte Gratuito</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span>Reportes mensuales</span>
                        </li>
                    </ul>
                    <Button
                        label="Empezar Ahora"
                        class="!border-none !py-3 !font-bold !bg-gray-700 !text-white hover:!bg-primary duration-300 transition-all hover:!text-black"
                    ></Button>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-4 p-0 mt-6">
                <div class="pricing-card">
                    <div
                        class="text-surface-900 dark:text-surface-0 text-start my-8 pl-2 text-2xl font-semibold"
                    >
                        Plan Pro
                    </div>

                    <div class="my-8 flex flex-col items-center gap-4">
                        <div class="flex items-center">
                            <span
                                class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0"
                                >$10.000</span
                            >
                            <span class="text-surface-600 dark:text-surface-200">por mes</span>
                        </div>
                    </div>
                    <Divider class="w-full bg-surface-200"></Divider>
                    <ul
                        class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-4"
                    >
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span>Administra hasta 300 miembros</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span>Administra hasta 3 sucursales</span>
                        </li>

                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span>Soporte dedicado </span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span>Reportes avanzados</span>
                        </li>
                    </ul>
                    <Button
                        label="Empezar Ahora"
                        class="!border-none !py-3 !font-bold !bg-gray-700 !text-white hover:!bg-primary duration-300 transition-all hover:!text-black"
                    ></Button>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-4 p-0 mt-6">
                <div class="pricing-card">
                    <div
                        class="text-surface-900 dark:text-surface-0 text-start my-8 text-2xl pl-2 font-semibold"
                    >
                        Plan Empresarial
                    </div>

                    <div class="my-8 flex flex-col items-center gap-4">
                        <div class="flex items-center">
                            <span
                                class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0"
                                >$15.000</span
                            >
                            <span class="text-surface-600 dark:text-surface-200">por mes</span>
                        </div>
                    </div>
                    <Divider class="w-full bg-surface-200"></Divider>
                    <ul
                        class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-4"
                    >
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span>Miembros ilimitados</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span>Sucursales ilimitadas</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span>Soporte 24/7</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span>Panel Personalizable</span>
                        </li>
                    </ul>
                    <Button
                        label="Empezar Ahora"
                        class="!border-none !py-3 !font-bold !bg-gray-700 !text-white hover:!bg-primary duration-300 transition-all hover:!text-black"
                    ></Button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.pricing-card {
    @apply p-4 flex flex-col cursor-pointer border-black border-2 hover:border-primary hover:bg-none duration-300 transition-all rounded-[10px] bg-gradient-to-b from-slate-950 to-black bg-slate-950;
}
</style>
