<template>
    <div class="card">
        <h1 class="text-3xl font-bold mb-10">{{ isEditMode ? 'Editar Rol' : 'Agregar Rol' }}</h1>
        <form @submit="onFormSubmit">
            <div class="flex flex-col gap-1 mt-2 mb-6" v-auto-animate>
                <label for="name">Nombre</label>
                <InputText
                    id="name"
                    v-model="nombre"
                    placeholder="Ej: Profesor"
                    fluid
                    :invalid="errors?.nombre ? true : false"
                    autocomplete="off"
                    class="max-w-[400px]"
                />

                <Message v-if="errors?.nombre" severity="error" size="small" variant="simple"
                    >{{ errors.nombre }}
                </Message>
            </div>
            <DataTable :loading :value="permisosPorModulo" size="large">
                <template #empty> Sin registros. </template>
                <Column field="modulo" header="Modulo"></Column>
                <Column v-for="action in actions" :key="action.value" :header="action.label">
                    <template #body="{ data }">
                        <Checkbox
                            v-model="permisosSeleccionados"
                            :binary="false"
                            v-if="data.permisos.some((p) => p.permiso.includes(action.value))"
                            :value="data.permisos.find((p) => p.permiso.includes(action.value))?.id"
                        />
                    </template>
                </Column>
            </DataTable>
            <div v-auto-animate class="mt-4">
                <Message
                    v-if="errors?.permisosSeleccionados"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ errors.permisosSeleccionados }}
                </Message>
            </div>
            <div class="flex justify-end gap-4">
                <Button
                    label="Cancelar"
                    severity="secondary"
                    as="router-link"
                    :disabled="loadingButton"
                    to="/admin/configuracion"
                    class="mt-8"
                />
                <Button label="Guardar" :loading="loadingButton" type="submit" class="mt-8" />
            </div>
        </form>
    </div>
</template>

<script setup>
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { toTypedSchema } from '@vee-validate/zod';
import { useToast } from 'primevue';
import { useField, useForm } from 'vee-validate';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
const loading = ref(false);
const loadingButton = ref(false);
const permissions = ref([]);
const toast = useToast();
const router = useRouter();
const route = useRoute();
const store = useIndexStore();
const isEditMode = computed(() => {
    return route.params?.id ? true : false;
});

const validationSchema = toTypedSchema(
    z.object({
        nombre: z
            .string({ message: 'El nombre es obligatorio.' })
            .nonempty({ message: 'El nombre es obligatorio.' })
            .min(3, { message: 'Debe tener al menos 3 caracteres' })
            .max(20, { message: 'No debe exceder 20 caracteres' }),
        permisosSeleccionados: z
            .array(z.string(), { message: 'Debe seleccionar al menos un permiso' })
            .min(1, { message: 'Debe seleccionar al menos un permiso' })
    })
);
const { handleSubmit, errors } = useForm({
    validationSchema
});
const { value: nombre } = useField('nombre');
const { value: permisosSeleccionados } = useField('permisosSeleccionados', []);

const permisosPorModulo = computed(() => {
    const modulos = [];
    for (const p of permissions.value) {
        if (!modulos[p.expand.id_modulo.nombre]) {
            modulos[p.expand.id_modulo.nombre] = {
                modulo: p.expand.id_modulo.nombre,
                permisos: []
            };
        }
        modulos[p.expand.id_modulo.nombre].permisos.push({
            id: p.id,
            permiso: p.permiso
        });
    }

    return Object.values(modulos);
});

//Obtiene los datos del rol si esta en modo edicion
const fetchData = async () => {
    if (isEditMode.value) {
        try {
            const rol = await pb.collection('roles').getOne(route.params.id);
            nombre.value = rol.nombre;
            permisosSeleccionados.value = rol.permisos;
        } catch (error) {
            showToast('error', 'Operación fallida', 'No se pudo obtener el rol');
        }
    }
};
watch(() => route.params?.id, fetchData, { immediate: true });

const showToast = (severity, summary, detail) => {
    toast.add({
        severity: severity,
        summary: summary,
        detail: detail,
        life: 3000
    });
};
const actions = ref([
    {
        label: 'Ver',
        value: 'index'
    },
    {
        label: 'Crear',
        value: 'create'
    },
    {
        label: 'Actualizar',
        value: 'update'
    },
    {
        label: 'Eliminar',
        value: 'delete'
    }
]);
const onFormSubmit = handleSubmit(async (values) => {
    const payload = {
        nombre: values.nombre,
        permisos: values.permisosSeleccionados,
        id_gimnasio: store.currentGym.id
    };
    try {
        let result;
        loadingButton.value = true;
        if (isEditMode.value) {
            result = await pb.collection('roles').update(route.params.id, payload, {
                expand: 'permisos',
                fields: '*, expand.permisos.permiso, expand.permisos.id'
            });

            // Actualizar el rol en el store si es el rol actual
            if (result.id === store.userLogged?.expand?.role?.id) {
                store.userLogged.expand.role = result;
            }
        } else {
            await pb.collection('roles').create(payload);
        }
        showToast('success', 'Confirmado', `Rol ${isEditMode.value ? 'actualizado' : 'creado'}.`);
        router.push('/admin/configuracion');
    } catch (error) {
        showToast('error', 'Operación fallida', 'Intentelo nuevamente.');
    } finally {
        loadingButton.value = false;
    }
});
onMounted(async () => {
    try {
        loading.value = true;
        const result = await pb
            .collection('permisos')
            .getFullList({ fields: 'id, permiso, expand.id_modulo.nombre', expand: 'id_modulo' });
        permissions.value = result;
    } catch (error) {
        showToast('error', 'Operación fallida', 'No se pudo obtener los permisos');
    } finally {
        loading.value = false;
    }
});
</script>
