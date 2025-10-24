<template>
    <Drawer
        v-model:visible="props.visible"
        modal
        @update:visible="$emit('closeModal')"
        header="Detalle Del Miembro"
        position="right"
        :style="{ width: '79rem' }"
    >
        <div class="grid grid-cols-7 items-center gap-8">
            <div class="flex gap-4 items-center col-span-3">
                <img
                    src="https://static.vecteezy.com/system/resources/previews/005/267/443/non_2x/avatar-icon-white-color-illustration-image-flat-style-vector.jpg"
                    :alt="`Foto de ${memberData?.nombre}`"
                    class="w-32 h-32 rounded-lg"
                />
                <div class="flex flex-col">
                    <p class="text-3xl font-semibold">{{ memberData?.nombre }}</p>
                    <p>{{ memberData?.expand.id_plan_plazo.expand.id_plan.nombre }}</p>
                    <p>
                        Tel:
                        <span>{{ memberData?.telefono }}</span>
                    </p>
                    <p v-if="memberData?.direccion">
                        Direccion: <span>{{ memberData?.direccion }}</span>
                    </p>
                </div>
            </div>
            <div class="space-y-3 col-span-2">
                <p class="rounded-md p-3 max-w-[270px] bg-primary-50/20">
                    Última Visita:
                    <span>{{ dayjs().format('D, MMMM YYYY') }}</span>
                </p>
                <p class="rounded-md p-3 max-w-[270px] bg-primary-50/20">
                    Vigente Hasta:
                    <span>{{ dayjs(memberData?.fecha_vencimiento).format('D, MMMM YYYY') }}</span>
                </p>
            </div>
            <div class="space-y-3 col-span-2">
                <p>
                    Fecha de Inscripción:
                    <span>{{ dayjs(memberData?.created).format('D, MMMM YYYY') }}</span>
                </p>
                <p class="flex items-center gap-3 p-2 w-fit rounded-md" :class="tagClasses">
                    Estado de Membresía:
                    <span
                        class="rounded-full h-4 w-4 inline-block"
                        :class="getMembershipStatus(memberData) ? 'bg-green-300' : 'bg-red-300'"
                    ></span>
                </p>
            </div>
        </div>
        <div class="mt-8">
            <SelectButton
                v-model="selectedTab"
                :options="options"
                optionLabel="label"
                optionValue="value"
                :allow-empty="false"
            />
        </div>
        <div class="mt-8">
            <component :is="currentTab" :memberData="memberData" />
        </div>
    </Drawer>
</template>
<script setup>
import { useIndexStore } from '@/storage';
import getMembershipStatus from '@/utils/getMembershipStatus';
import dayjs from 'dayjs/esm';
import 'dayjs/esm/locale/es';
import { computed, defineProps, ref } from 'vue';
import MemberAttendances from './MemberAttendances.vue';
import MembersMemberships from './MembersMemberships.vue';
import MembersPayments from './MembersPayments.vue';
const storage = useIndexStore();
const props = defineProps({
    visible: Boolean,
    memberData: Object
});
const selectedTab = ref('membership');
const options = ref([
    { label: 'Membresia', value: 'membership' },
    { label: 'Historial de Pagos', value: 'payments' },
    { label: 'Asistencias', value: 'attendances' }
]);
const tabs = {
    payments: MembersPayments,
    membership: MembersMemberships,
    attendances: MemberAttendances
};
const tagClasses = computed(() =>
    getMembershipStatus(props.memberData)
        ? 'bg-green-950 !text-green-200'
        : 'bg-red-950 !text-red-200'
);
const currentTab = computed(() => tabs[selectedTab.value]);
dayjs.locale('es');
</script>
<style scoped>
.sub-header {
    @apply text-gray-400 col-span-1 font-light !text-sm;
}
.main-info {
    @apply col-span-1 font-bold text-[15px];
}
span {
    @apply text-primary-200 font-semibold;
}
</style>
