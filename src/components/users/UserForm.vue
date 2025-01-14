<script setup>
import pb from '@/service/pocketbase.js';
import { useIndexStore } from '@/storage';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { computed, defineEmits, defineProps, onMounted, ref } from 'vue';
import { z } from 'zod';

const emit = defineEmits(['closeModal', 'reloadData']);
const toast = useToast();
const roles = ref([]);
const store = useIndexStore();
const props = defineProps({
    visible: Boolean,
    data: Object
});

const loading = ref(false);

// Valores iniciales como un computed
const initialValues = computed(() => {
    return {
        name: props.data?.name ?? '',
        email: props.data?.email ?? '',
        phone: props.data?.phone ?? null,
        password: isEditMode.value ? 'password' : '',
        passwordConfirm: isEditMode.value ? 'password' : '',
        role: props.data?.role ?? ''
    };
});

const isEditMode = computed(() => (props.data?.id ? true : false));

const resolver = zodResolver(
    z
        .object({
            name: z
                .string()
                .nonempty({ message: 'El nombre es obligatorio.' })
                .min(5, { message: 'Debe tener al menos 5 caracteres' })
                .max(50, { message: 'No debe exceder 50 caracteres' }),
            email: z.string().email({ message: 'Correo electrónico inválido' }),
            phone: z.coerce
                .number()
                .min(1, { message: 'El teléfono es obligatorio.' })
                .max(999999999999, { message: 'No debe exceder 12 caracteres' }),
            password: z
                .string()
                .min(3, { message: 'Mínimo 3 caracteres.' })
                .max(20, { message: 'No debe exceder 20 caracteres.' }),
            passwordConfirm: z.string().min(3, { message: 'Mínimo 3 caracteres.' }),
            role: z.string().nonempty({ message: 'El rol es obligatorio.' })
        })
        .refine((data) => data.password === data.passwordConfirm, {
            message: 'Las contraseñas no coinciden.',
            path: ['passwordConfirm']
        })
);
const getRoles = async () => {
    try {
        const result = await pb.collection('roles').getFullList({
            sort: '-created',
            filter: `(id_gimnasio = null || id_gimnasio = '${store?.currentGym?.id}') && deleted = null`
        });
        roles.value = result;
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Operación fallida',
            detail: 'No se pudo obtener los roles',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    getRoles();
});
const onFormSubmit = async (e) => {
    console.log(e);
    if (e.valid) {
        try {
            loading.value = true;

            let payload = { ...e.values };
            if (isEditMode.value) {
                delete payload.password;
                delete payload.passwordConfirm;

                await pb.collection('users').update(props.data.id, payload);
            } else {
                payload.emailVisibility = true;
                await pb.collection('users').create(payload);
            }

            toast.add({
                severity: 'success',
                summary: 'Operación exitosa!',
                detail: 'Usuario guardado correctamente!',
                life: 3000
            });

            emit('closeModal');
            emit('reloadData');
        } catch (error) {
            console.log(error);
            toast.add({
                severity: 'error',
                summary: 'Operación fallida!',
                detail: 'Favor, inténtelo nuevamente',
                life: 3000
            });
        } finally {
            loading.value = false;
        }
    }
};
</script>

<template>
    <Dialog
        v-model:visible="props.visible"
        modal
        @update:visible="emit('closeModal')"
        :header="isEditMode ? 'Editar usuario' : 'Nuevo usuario'"
        :style="{ width: '36rem' }"
    >
        <Form
            v-slot="$form"
            :initialValues
            :resolver
            @submit="onFormSubmit"
            class="flex flex-col justify-center gap-4"
        >
            <div class="flex flex-col gap-1" v-auto-animate>
                <label for="name">Nombre</label>
                <InputText
                    id="name"
                    name="name"
                    placeholder="Ej: Juan Perez"
                    fluid
                    autocomplete="off"
                />

                <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.name.error.message }}
                </Message>
            </div>

            <div class="flex flex-col gap-1" v-auto-animate>
                <label for="email">Correo</label>
                <InputText
                    id="email"
                    name="email"
                    placeholder="ejemplo@ejemplo.com"
                    fluid
                    type="email"
                    autocomplete="off"
                />

                <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.email.error.message }}
                </Message>
            </div>

            <div class="flex flex-col gap-1" v-auto-animate>
                <label for="phone">Teléfono</label>
                <InputText
                    id="telefono"
                    type="number"
                    name="phone"
                    fluid
                    placeholder="Ingrese su número telefónico"
                    autocomplete="off"
                />

                <Message v-if="$form.phone?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.phone.error.message }}
                </Message>
            </div>
            <div class="flex flex-col gap-1" v-auto-animate>
                <label for="role">Rol</label>
                <Select
                    id="role"
                    :options="roles"
                    name="role"
                    optionLabel="nombre"
                    optionValue="id"
                    fluid
                    placeholder="Ingrese el rol del usuario"
                />
                <Message v-if="$form.role?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.role.error.message }}
                </Message>
            </div>
            <div class="flex gap-4" :style="isEditMode ? 'display: none' : ''">
                <div class="flex flex-col gap-1" v-auto-animate>
                    <label for="password">Contraseña</label>
                    <Password
                        name="password"
                        id="password"
                        v-model="password"
                        placeholder="* * * * * * * * *"
                        :toggleMask="true"
                        class="mb-2"
                        fluid
                        :feedback="false"
                    >
                    </Password>

                    <Message
                        v-if="$form.password?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.password.error.message }}
                    </Message>
                </div>

                <div class="flex flex-col gap-1" v-auto-animate>
                    <label for="passwordConfirm">Confirmar contraseña</label>
                    <Password
                        name="passwordConfirm"
                        id="passwordConfirm"
                        v-model="passwordConfirm"
                        placeholder="* * * * * * * * *"
                        :toggleMask="true"
                        class="mb-2"
                        fluid
                        :feedback="false"
                    />

                    <Message
                        v-if="$form.passwordConfirm?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.passwordConfirm.error.message }}
                    </Message>
                </div>
            </div>

            <div class="flex justify-end gap-2 mt-1">
                <Button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    @click="emit('closeModal')"
                ></Button>
                <Button label="Guardar" :loading="loading" type="submit"></Button>
            </div>
        </Form>
    </Dialog>
</template>

<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
