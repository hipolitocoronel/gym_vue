<template>
    <div class="px-6 lg:px-12 mx-0 xl:mx-28">
        <div class="col-span-12 text-center mt-20 mb-6">
            <h2
                class="text-4xl md:text-5xl md:min-h-14 font-extrabold leading-tight bg-gradient-to-r from-white to-gray-700 bg-clip-text text-transparent"
            >
                Impulsa el éxito de tu gimnasio
            </h2>
            <p class="text-muted-color max-w-2xl mx-auto mt-4">
                Herramientas y funciones para mantener su negocio de fitness funcionando sin
                problemas y de manera eficiente.
            </p>
        </div>

        <div class="grid grid-cols-12 gap-10">
            <div
                class="card mb-0 bg-slate-950 col-span-6"
                v-animateonscroll="{ enterClass: 'animate-fadein' }"
            >
                <div class="flex flex-col items-center">
                    <div class="">
                        <img
                            src="@/assets/img/members_landing.png"
                            class="min-h-fit rounded-xl"
                            alt=""
                        />
                    </div>
                    <div class="mb-3 mt-5">
                        <span class="block text-xl text-center font-semibold mb-3"
                            >Estado de miembros</span
                        >

                        <p class="text-gray-300 text-sm">
                            Supervise los ingresos del gimnasio con análisis claros y fáciles de
                            leer.
                        </p>
                    </div>
                </div>
            </div>
            <div
                class="card mb-0 bg-slate-950 overflow-hidden col-span-6"
                v-animateonscroll="{ enterClass: 'animate-fadein' }"
            >
                <div class="flex flex-col items-center">
                    <div class="-mr-20">
                        <img class="!rounded-s-2xl max-h-[260px]" src="" alt="" />
                    </div>
                    <div class="mb-3 mt-5">
                        <span class="block text-center text-xl font-semibold mb-3"
                            >Administrar Miembros</span
                        >

                        <p class="text-gray-300 text-sm">
                            Realizar un seguimiento de la actividad, las suscripciones y las
                            renovaciones de los miembros.
                        </p>
                    </div>
                </div>
            </div>

            <div
                class="card mb-0 bg-slate-950 col-span-6"
                v-animateonscroll="{ enterClass: 'animate-fadein' }"
            >
                <div class="flex flex-col items-center">
                    <div></div>
                    <div class="text-center mb-3 mt-5">
                        <span class="block text-xl font-semibold mb-3"
                            >Gestión de Entrenadores</span
                        >

                        <p class="text-gray-300 text-sm">
                            Administra y supervisa fácilmente a los instructores y sus sesiones.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
