import AppLayout from '@/layout/AppLayout.vue';
import pb from '@/service/pocketbase';
import { useIndexStore } from '@/storage';
import { hasPermission } from '@/utils/hasPermission';
import isSuperAdmin from '@/utils/isSuperAdmin';
import { createRouter, createWebHistory } from 'vue-router';
import loadInitialData from './guards/authGuard';
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/admin',
            component: AppLayout,
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: 'miembros',
                    name: 'miembros',
                    component: () => import('@/views/members/Members.vue'),
                    meta: {
                        requiredPermission: 'members.index'
                    }
                },
                {
                    path: 'usuarios',
                    name: 'usuarios',
                    component: () => import('@/views/pages/Users.vue'),
                    meta: {
                        requiredPermission: 'users.index'
                    }
                },
                {
                    path: 'pagos',
                    name: 'pagos',
                    component: () => import('@/views/pages/Payments.vue'),
                    meta: {
                        requiredPermission: 'payments.index'
                    }
                },
                {
                    path: 'reportes',
                    name: 'reportes',
                    component: () => import('@/views/pages/Reports.vue'),
                    meta: {
                        requiredPermission: 'reports.index'
                    }
                },
                {
                    path: 'planes',
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
                    path: 'configuracion',
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
                    path: 'gimnasios',
                    name: 'gimnasios',
                    component: () => import('@/views/pages/superadmin/Gyms.vue'),
                    meta: {
                        requiresSuperAdmin: true
                    }
                },
                {
                    path: 'pagos-gimnasios',
                    name: 'pagos-gimnasios',
                    component: () => import('@/views/pages/superadmin/GymPayments.vue'),
                    meta: {
                        requiresSuperAdmin: true
                    }
                },
                {
                    path: 'reportes-gimnasios',
                    name: 'reportes-gimnasios',
                    component: () => import('@/views/pages/superadmin/GymReports.vue'),
                    meta: {
                        requiresSuperAdmin: true
                    }
                },
                {
                    path: 'consultas',
                    name: 'consultas',
                    component: () => import('@/views/pages/superadmin/Inquiries.vue'),
                    meta: {
                        requiresSuperAdmin: true
                    }
                },
                {
                    path: 'cambiar-plan',
                    name: 'cambiar-plan',
                    component: () => import('@/views/pages/ChangePlan.vue')
                }
            ],
            meta: {
                requiresAuth: true
            }
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
            component: () => import('@/views/pages/auth/Register.vue')
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
            component: () => import('@/views/pages/auth/RegisterSteps.vue')
        }
    ]
});
router.beforeEach(async (to, from, next) => {
    const store = useIndexStore();

    // Si el usuario no está autenticado y la ruta requiere autenticación
    if (to.meta.requiresAuth && !pb.authStore.isValid) {
        if (to.name !== 'login') {
            return next({ name: 'login' });
        }
        return;
    }

    // Cargar datos iniciales si el usuario esta autenticado
    if (pb.authStore.isValid && !store.currentGym) {
        const isDataLoaded = await loadInitialData();
        if (!isDataLoaded) {
            return next({ name: 'login' });
        }
    }
    if (to.meta.requiresSuperAdmin && !isSuperAdmin()) {
        return next({ name: 'accessDenied' });
    }
    // Si en usuario ya esta autenticado no pueda acceder al login
    if (to.meta.requiresUnauth && store.userLogged) {
        return next({ name: 'dashboard' });
    }
    if (to.meta.requiredPermission) {
        const hasRequiredPermission = hasPermission(to.meta.requiredPermission);

        if (!hasRequiredPermission) {
            return next({ name: 'accessDenied' });
        }
    }

    next();
});

export default router;
