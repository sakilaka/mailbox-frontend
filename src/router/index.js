import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../views/auth/LoginForm.vue';
import RegisterForm from '../views/auth/RegisterForm.vue';
import UserProfile from '../views/auth/UserProfile.vue';
import Starred from '../views/StarredEmail.vue';
import Sent from '../views/EmailSent.vue';
import Trash from '../views/TrashEmail.vue';
import Archive from '../views/ArchiveMail.vue';
import Configuration from '../views/MailConfiguration.vue';
import Spam from '../views/SpamEmail.vue';
import Draft from '../views/DraftMail.vue';
import Compose from '../views/emailCompose.vue';
import EmailDetails from '../views/EmailDetails.vue';
import EmailSentDetails from '../views/EmailSentDetails.vue';

const routes = [
    { path: '/', name: 'LoginForm', component: LoginForm },
    { path: '/register', name: 'RegisterForm', component: RegisterForm },
    { path: '/profile', name: 'UserProfile', component: UserProfile, meta: { requiresAuth: true } },
    { path: '/starred', name: 'Starred', component: Starred, meta: { requiresAuth: true } },
    { path: '/sent', name: 'Sent', component: Sent, meta: { requiresAuth: true } },
    { path: '/trash', name: 'Trash', component: Trash, meta: { requiresAuth: true } },
    { path: '/archive', name: 'Archive', component: Archive, meta: { requiresAuth: true } },
    { path: '/config', name: 'Configuration', component: Configuration, meta: { requiresAuth: true } },
    { path: '/spam', name: 'Spam', component: Spam, meta: { requiresAuth: true } },
    { path: '/draft', name: 'Draft', component: Draft, meta: { requiresAuth: true } },
    { path: '/compose', name: 'Compose', component: Compose, meta: { requiresAuth: true } },
    { path: '/emails/:id', name: 'EmailDetails', component: EmailDetails, props: true, meta: { requiresAuth: true } },
    { path: '/sent-emails/:id', name: 'EmailSentDetails', component: EmailSentDetails, props: true, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token');
  
    if (to.meta.requiresAuth && !isAuthenticated) {
      next({ name: 'LoginForm' });
    } else if (to.name === 'LoginForm' && isAuthenticated) {
      next({ name: 'UserProfile' });
    } else {
      next();
    }
  });
  
  
  

export default router;
