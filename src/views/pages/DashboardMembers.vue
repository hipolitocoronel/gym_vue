<template>
    <nav class="p-4 flex justify-between items-center bg-surface-900">
        <div class="flex items-center gap-2">
            <img src="@/assets/img/logo-white.png" class="w-12" alt="Logo GymAdmin" />
            <p class="font-extrabold text-white">
                Gym<span class="text-lg font-bold text-primary">Admin</span>
            </p>
        </div>
        <div>
            <Avatar :label="member?.nombre?.substring(0, 1)" class="mr-2" />
            <Button type="button" size="small" variant="text" @click="toggle" severity="contrast">
                <span class="text-base">
                    {{ member?.nombre }}
                </span>
                <i class="ml-1 pi pi-fw pi-chevron-down"></i>
            </Button>

            <Popover ref="op">
                <div class="flex flex-col gap-4 w-[18rem]">
                    <div>
                        <span class="block mb-2 font-medium"> Acciones </span>

                        <Button fluid severity="secondary" @click="logout()">
                            <i class="mr-2 pi pi-sign-out"></i>
                            Cerrar sesión
                        </Button>
                    </div>
                </div>
            </Popover>
        </div>
    </nav>
    <div class="mt-8 mx-2">
        <div class="card !px-4">
            <h1 class="text-2xl font-bold mb-4">Hola, {{ member?.nombre.split(' ')[0] }} !</h1>
            <div
                v-for="gym in member?.gimnasios"
                class="bg-black p-4 mb-4 rounded-lg flex justify-between items-center"
            >
                <div>
                    <div class="flex items-center gap-4 mb-4">
                        <img
                            v-if="gym.gimnasio.logo"
                            :src="getGymLogoUrl(gym.gimnasio)"
                            alt="Logo Gym"
                            class="w-20"
                        />
                        <Avatar
                            v-else
                            class="!w-20 !h-20"
                            :label="gym.gimnasio?.nombre?.substring(0, 1)"
                        />
                        {{ gym.gimnasio.nombre }}
                    </div>

                    <p class="text-sm font-bold">
                        Vencimiento: {{ dayjs(gym.fecha_vencimiento).format('DD/MM/YYYY') }}
                    </p>
                </div>
                <Tag
                    :value="getMembershipStatus(gym) ? 'Vigente' : 'Vencido'"
                    :severity="getMembershipStatus(gym) ? 'success' : 'danger'"
                />
            </div>
        </div>
        <h2 class="text-3xl font-bold mt-8">Rutinas</h2>
        <div v-if="loadingWorkouts" class="flex justify-center mt-8">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" fill="transparent" />
        </div>
        <div v-else>
            <div v-if="workouts.length !== 0" class="flex flex-col mt-4">
                <div v-for="workout in workouts" class="card my-2">
                    <div class="flex justify-between items-center">
                        <p class="text-lg font-bold">{{ workout.nombre }}</p>
                        <Button
                            type="button"
                            severity="secondary"
                            size="small"
                            @click="showWorkoutDetails(workout)"
                            label="Ver Detalle"
                        />
                    </div>
                </div>
            </div>
            <p v-else class="text-center text-lg mt-4">No hay rutinas disponibles</p>
        </div>
    </div>
    <WorkoutDetails
        :visible="modalWorkoutDetails"
        :workoutData
        @closeModal="modalWorkoutDetails = $event"
    />
</template>

<script setup>
import WorkoutDetails from '@/components/workouts/WorkoutDetails.vue';
import pb from '@/service/pocketbase';
import getMembershipStatus from '@/utils/getMembershipStatus';
import dayjs from 'dayjs/esm';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const member = ref(null);
const op = ref(null);
const router = useRouter();
const workouts = ref([]);
const modalWorkoutDetails = ref(false);
const workoutData = ref(null);
const loadingWorkouts = ref(false);
const backend = import.meta.env.VITE_BACKEND_URL;
const getGymLogoUrl = (gym) => `${backend}/api/files/${gym.collectionId}/${gym.id}/${gym.logo}`;

const toggle = (event) => {
    op.value.toggle(event);
};
const logout = () => {
    localStorage.removeItem('member');
    router.push({ name: 'login-miembros' });
};
const showWorkoutDetails = (workout) => {
    modalWorkoutDetails.value = true;
    workoutData.value = workout;
};
onMounted(async () => {
    try {
        loadingWorkouts.value = true;
        workouts.value = await pb.collection('planes_entrenamientos').getFullList({
            filter: `sucursal_id ~ "${member.value.sucursales[0]}"`
        });
    } catch (error) {
        console.log(error);
    } finally {
        loadingWorkouts.value = false;
    }
});
onBeforeMount(async () => {
    member.value = JSON.parse(localStorage.getItem('member'));
});
</script>
