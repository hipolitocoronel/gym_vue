<template>
    <Dialog
        v-model:visible="props.visible"
        modal
        :draggable="false"
        :closable="props.estadoServicio?.puede_usar_servicio"
        :header="props.estadoServicio?.plan"
        :style="{ width: '38rem' }"
        @update:visible="$emit('closeModal')"
    >
        <div class="mt-1">
            <Message
                :severity="getSeveriryAndIcon(props.estadoServicio?.estado).severity"
                :icon="getSeveriryAndIcon(props.estadoServicio?.estado).icon"
            >
                {{ props.estadoServicio?.mensaje }}
            </Message>

            <div class="mt-4" v-if="!props.estadoServicio?.estado == 'pendiente'">
                <p>
                    <i class="mr-1 pi pi-info-circle text-muted-color"></i>
                    Por favor, completa el pago para continuar usando el servicio.
                </p>
            </div>
        </div>

        <div
            class="flex items-center justify-between mt-10"
            v-if="!props.estadoServicio?.puede_usar_servicio"
        >
            <p class="text-muted-color">
                Problemas con el pago?
                <a href="#" class="font-semibold underline text-primary">Click aquí</a>
            </p>
            <Button label="Abonar servicio" severity="primary" icon="pi pi-money-bill"></Button>
        </div>
    </Dialog>
</template>

<script setup>
const props = defineProps({
    visible: Boolean,
    estadoServicio: Object
});

const getSeveriryAndIcon = (estado) => {
    switch (estado) {
        case 'activo':
            return { severity: 'success', icon: 'pi pi-check' };
        case 'por_vencer':
            return { severity: 'info', icon: 'pi pi-info-circle' };
        case 'pendiente':
            return { severity: 'warn', icon: 'pi pi-exclamation-triangle' };
        default:
            return { severity: 'error', icon: 'pi pi-times-circle' };
    }
};
</script>
