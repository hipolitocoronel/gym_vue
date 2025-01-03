import AppLayout from '@/layout/AppLayout.vue';
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
                    component: () => import('@/views/members/Members.vue')
                },
                {
                    path: '/usuarios',
                    name: 'usuarios',
                    component: () => import('@/views/pages/Users.vue')
                },
                {
                    path: '/pagos',
                    name: 'pagos',
                    component: () => import('@/views/pages/Payments.vue')
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
                    ]
                }
            ]
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
            component: () => import('@/views/pages/auth/Login.vue')
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
        }
    ]
});

export default router;
