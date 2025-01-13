import AppLayout from '@/layout/AppLayout.vue';
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { hasPermission } from '@/utils/hasPermission';
import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/miembros',
                    name: 'miembros',
                    component: () => import('@/views/members/Members.vue'),
                    meta: {
                        requiredPermission: 'members.index'
                    }
                },
                {
                    path: '/usuarios',
                    name: 'usuarios',
                    component: () => import('@/views/pages/Users.vue'),
                    meta: {
                        requiredPermission: 'users.index'
                    }
                },
                {
                    path: '/pagos',
                    name: 'pagos',
                    component: () => import('@/views/pages/Payments.vue'),
                    meta: {
                        requiredPermission: 'payments.index'
                    }
                },
                {
                    path: '/reportes',
                    name: 'reportes',
                    component: () => import('@/views/pages/Reports.vue'),
                    meta: {
                        requiredPermission: 'reports.index'
                    }
                },
                {
                    path: '/planes',
                    children: [
                        {
                            path: '',
                            name: 'planes',
                            component: () => import('@/views/pages/Memberships.vue')
                        },
                        {
                            path: 'agregar-plan',
                            name: 'agregar-plan',
                            component: () => import('@/views/pages/MembershipsForm.vue')
                        },
                        {
                            path: 'editar-plan/:id',
                            name: 'editar-plan',
                            sensitive: true,
                            component: () => import('@/views/pages/MembershipsForm.vue')
                        }
                    ],
                    meta: {
                        requiredPermission: 'plan.index'
                    }
                },
                {
                    path: '/configuracion',
                    children: [
                        {
                            path: '',
                            name: 'configuracion',
                            component: () => import('@/views/pages/Settings.vue')
                        },
                        {
                            path: 'agregar-rol',
                            name: 'agregar-rol',
                            component: () => import('@/views/pages/RoleForm.vue')
                        },
                        {
                            path: 'editar-rol/:id',
                            name: 'editar-rol',
                            sensitive: true,
                            component: () => import('@/views/pages/RoleForm.vue')
                        }
                    ],
                    meta: {
                        requiredPermission: 'settings.index'
                    }
                },
                {
                    path: '/cambiar-plan',
                    name: 'cambiar-plan',
                    component: () => import('@/views/pages/ChangePlan.vue')
                }
            ],
            meta: { requiresAuth: true }
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue'),
            meta: { requiresUnauth: true }
        },
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue'),
            meta: { requiresUnauth: true }
        },
        {
            path: '/auth/forgot-password',
            name: 'forgotPassword',
            component: () => import('@/views/pages/auth/ForgotPassword.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/auth/completar-registro',
            name: 'completar-registro',
            component: () => import('@/views/pages/auth/RegisterSteps.vue'),
            meta: { requiresUnauth: true }
        }
    ]
});
router.beforeEach(async (to, from, next) => {
    const store = useIndexStore();
    //Si el usuario no esta autenticado y la ruta requiere autenticacion
    if (to.meta.requiresAuth && !pb.authStore.isValid) {
        return next({ name: 'login' });
    }
    // Obtener informacion del usuario
    if (!store.userLogged) {
        await getUserLogged();
    }
    //Si el usuario esta autenticado y la ruta es de autenticacion redirigir al dashboard
    if (to.meta.requiresUnauth && pb.authStore.isValid) {
        return next({ name: 'dashboard' });
    }
    if (to.meta.requiredPermission) {
        const hasRequired = hasPermission(
            store.userLogged?.expand?.role?.expand?.permisos,
            to.meta.requiredPermission
        );

        if (!hasRequired) {
            return next({ name: 'accessDenied' });
        }
    }

    next();
});
const getUserLogged = async () => {
    try {
        const store = useIndexStore();
        const user = await pb.collection('users').getOne(pb.authStore.record.id, {
            expand: 'role, role.permisos',
            fields: '*, expand.role.expand.permisos.permiso, expand.role.nombre, expand.role.id'
        });

        // guardando informacion de usuario
        store.setUserLogged(user);
    } catch (error) {
        console.log(error);
    }
};
export default router;
