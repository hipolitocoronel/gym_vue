import { useIndexStore } from '@/storage';
export function hasPermission(requiredPermission) {
    const store = useIndexStore();
    return store.userLogged?.expand?.role?.expand?.permisos.some((p) =>
        p.permiso.includes(requiredPermission)
    );
}
