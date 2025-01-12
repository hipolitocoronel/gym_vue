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
                class="card mb-0 bg-slate-950 col-span-12 md:col-span-6"
                data-aos="fade-up"
                data-aos-duration="700"
            >
                <div class="flex flex-col items-center">
                    <img
                        src="@/assets/img/members_landing.png"
                        class="min-h-fit rounded-xl"
                        alt=""
                    />

                    <div class="mb-3 mt-5">
                        <span class="block text-xl text-center font-semibold mb-3"
                            >Estado de miembros</span
                        >

                        <p class="text-gray-300 text-sm">
                            Administre fácilmente la información de los miembros, realice un
                            seguimiento de las fechas de vencimiento y mantenga actualizado su
                            estado.
                        </p>
                    </div>
                </div>
            </div>
            <div
                class="card mb-0 bg-slate-950 overflow-hidden col-span-12 md:col-span-6"
                data-aos="fade-up"
                data-aos-duration="700"
            >
                <div class="flex flex-col items-center">
                    <img
                        src="@/assets/img/revenue_landing.png"
                        class="min-h-fit rounded-xl"
                        alt=""
                    />
                    <div class="mb-3 mt-5">
                        <span class="block text-center text-xl font-semibold mb-3"
                            >Seguimiento de ingresos</span
                        >

                        <p class="text-gray-300 text-sm">
                            Realice un seguimiento de las tendencias de ingresos de su gimnasio en
                            tiempo real para tomar decisiones financieras.
                        </p>
                    </div>
                </div>
            </div>
            <div
                class="card mb-0 bg-slate-950 overflow-hidden col-span-12 md:col-span-6"
                data-aos="fade-up"
                data-aos-duration="700"
            >
                <div class="flex flex-col items-center">
                    <img
                        src="@/assets/img/payments_landing.png"
                        class="min-h-fit rounded-xl"
                        alt=""
                    />
                    <div class="mb-3 mt-5">
                        <span class="block text-center text-xl font-semibold mb-3"
                            >Gestiona tus cobros</span
                        >

                        <p class="text-gray-300 text-sm">
                            Registra y gestiona los pagos de las membresías de manera rápida y
                            eficiente. Lleva un control detallado de los pagos realizados por los
                            miembros.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup></script>
