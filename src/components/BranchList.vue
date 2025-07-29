<template>
    <Popover ref="menuSucursales">
        <div class="flex flex-col gap-2 w-[22rem]">
            <p class="p-1 mb-1 font-semibold">Listado de sucursales</p>
            <div v-for="(sucursal, index) in store.sucursales">
                <Button
                    fluid
                    @click="changeSucursal(sucursal, index)"
                    severity="secondary"
                    :variant="store.currentSucursal.id == sucursal.id ? 'secondary' : 'text'"
                >
                    <div class="flex w-full gap-3 text-start">
                        <span class="flex-1">{{ sucursal.nombre }}</span>

                        <span class="flex-1 text-end"> {{ sucursal.direccion }}</span>
                    </div>
                </Button>
            </div>
            <Button
                severity="secondary"
                class="mt-3"
                label="Agregar sucursal"
                icon="pi pi-plus"
                v-if="puedeAgregarSucursal"
            ></Button>
        </div>
    </Popover>
</template>

<script setup>
import { useIndexStore } from '@/storage';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const menuSucursales = ref();
const store = useIndexStore();
const confirm = useConfirm();
const toast = useToast();
const router = useRouter();

const puedeAgregarSucursal = computed(
    () => store.sucursales.length < store.estadoServicio?.limite_sucursales
);

const changeSucursal = (sucursal, index) => {
    menuSucursales.value.hide();
    confirm.require({
        message: '¿Deseas cambiar de sucursal?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Si, cambiar'
        },
        accept: () => {
            store.setCurrentSucursal(sucursal);
            localStorage.setItem('currentSucursalIndex', index.toString());

            router.push({ name: 'dashboard' });
            toast.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'Cambiaste de sucursal',
                life: 3000
            });
        }
    });
};

defineExpose({ menuSucursales });
</script>
