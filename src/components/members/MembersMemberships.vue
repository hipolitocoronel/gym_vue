<template>
    <div>
        <p class="text-xl font-semibold mb-3">Membresías Contratadas</p>
        <MembershipSummaryList :memberships :loading />
    </div>
</template>
<script setup>
import pb from '@/service/pocketbase';
import { onMounted, ref } from 'vue';
const props = defineProps({
    memberData: Object
});
const loading = ref(false);
const memberships = ref([]);
onMounted(async () => {
    try {
        loading.value = true;
        const result = await pb.collection('pagos').getFullList({
            expand: 'id_plan_plazo, id_plan_plazo.id_plan',
            fields: 'expand.id_plan_plazo.expand.id_plan.nombre, fecha_pago,fecha_vencimiento',
            sort: '-fecha_pago',
            filter: `id_miembro = '${props.memberData.id}'`
        });
        memberships.value = result;
    } catch (error) {
        console.error('Error al cargar membresías:', error);
    } finally {
        loading.value = false;
    }
});
</script>
