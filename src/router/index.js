import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../views/auth/LoginForm.vue';
import RegisterForm from '../views/auth/RegisterForm.vue';
import RefferRegisterForm from '../views/auth/RefferRegisterForm.vue';
import AdminDashboard from '../views/auth/AdminDashboard.vue';
import UserProfile from '../views/auth/UserProfile.vue';
import Home from '../views/UserHome.vue';
import Starred from '../views/StarredEmail.vue';
import Sent from '../views/EmailSent.vue';
import Trash from '../views/TrashEmail.vue';
import Archive from '../views/ArchiveMail.vue';
import Configuration from '../views/MailConfiguration.vue';
import ConfigIndex from '../views/MailConfigIndex.vue';
import ConfigEdit from '../views/MailConfigEdit.vue';
import MailMembers from '../views/MailMembers.vue';
import Spam from '../views/SpamEmail.vue';
import Draft from '../views/DraftMail.vue';
import Settings from '../views/SettingsMail.vue';
import Compose from '../views/emailCompose.vue';
import EmailDetails from '../views/EmailDetails.vue';
import EmailSentDetails from '../views/EmailSentDetails.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'LoginForm', component: LoginForm, meta: { requiresAuth: false } },
        { path: '/register/:id', name: 'RefferRegisterForm', component: RefferRegisterForm, props: true , meta: { requiresAuth: false },}, // Place dynamic route before static one
        { path: '/register', name: 'RegisterForm', component: RegisterForm, meta: { requiresAuth: false }, },
        { path: '/dashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true } },
        { path: '/profile', name: 'UserProfile', component: UserProfile, meta: { requiresAuth: true } },
        { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
        { path: '/starred', name: 'Starred', component: Starred, meta: { requiresAuth: true } },
        { path: '/sent', name: 'Sent', component: Sent, meta: { requiresAuth: true } },
        { path: '/trash', name: 'Trash', component: Trash, meta: { requiresAuth: true } },
        { path: '/archive', name: 'Archive', component: Archive, meta: { requiresAuth: true } },
        { path: '/members', name: 'Members', component: MailMembers, meta: { requiresAuth: true } },
        { path: '/config', name: 'Configuration', component: Configuration, meta: { requiresAuth: true } },
        { path: '/config-index', name: 'ConfigIndex', component: ConfigIndex, meta: { requiresAuth: true } },
        { path: '/config-edit', name: 'ConfigEdit', component: ConfigEdit, meta: { requiresAuth: true } },
        { path: '/spam', name: 'Spam', component: Spam, meta: { requiresAuth: true } },
        { path: '/draft', name: 'Draft', component: Draft, meta: { requiresAuth: true } },
        { path: '/compose', name: 'Compose', component: Compose, meta: { requiresAuth: true } },
        { path: '/emails/:id', name: 'EmailDetails', component: EmailDetails, props: true, meta: { requiresAuth: true } },
        { path: '/configEdit/:id', name: 'ConfigEdit', component: ConfigEdit, props: true, meta: { requiresAuth: true } },
        { path: '/sent-emails/:id', name: 'EmailSentDetails', component: EmailSentDetails, props: true, meta: { requiresAuth: true } },
        { path: '/settings', name: 'Settings', component: Settings, meta: { requiresAuth: true } },
    ],
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});
  



export default router;


