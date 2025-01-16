import { useIndexStore } from '@/storage';
export default function isSuperAdmin() {
    const store = useIndexStore();
    return store.userLogged.expand.role.nombre === 'SuperAdmin';
}
