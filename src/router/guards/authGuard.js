import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { useRouter } from 'vue-router';
export default async function loadInitialData() {
    const store = useIndexStore();
    try {
        // Obtener informacion del usuario
        if (!store.userLogged || (store.userLogged && !pb.authStore.isValid)) {
            await getUserLogged();
        }

        // Si no hay gimnasio actual pero hay usuario logueado, cargamos los datos
        if (!store.currentGym && store.userLogged) {
            const sucursales = store.userLogged.expand.sucursal_id;
            const gym = await pb
                .collection('gimnasios')
                .getOne(sucursales[0].gimnasio_id, { expand: 'servicio_id' });
            store.setCurrentGym(gym);
            store.setSucursales(sucursales);
            const savedIndex = localStorage.getItem('currentSucursalIndex');
            if (savedIndex) {
                store.setCurrentSucursal(sucursales[parseInt(savedIndex)]);
            } else {
                store.setCurrentSucursal(sucursales[0]);
            }
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
const getUserLogged = async () => {
    const router = useRouter();
    try {
        const store = useIndexStore();
        const user = await pb.collection('users').getOne(pb.authStore.record.id, {
            expand: 'role, role.permisos, sucursal_id',
            fields: '*, expand.role.expand.permisos.permiso, expand.role.nombre, expand.role.id, expand.sucursal_id'
        });

        // guardando informacion de usuario
        store.setUserLogged(user);
    } catch (error) {
        pb.authStore.clear();
        store.setUserLogged(null);
        router.push({ name: 'login' });
    }
};
