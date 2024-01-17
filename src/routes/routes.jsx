import Dashboard from '@/pages/Dashboard';
import UserManager from '@/pages/UserManager';

const publicRoutes = [
    { path: 'dashboard', component: Dashboard },
    { path: 'manager-users', component: UserManager },
    { path: 'manager-courses', component: UserManager },
    { path: 'manager-comments', component: UserManager },
    { path: 'manager-bills', component: UserManager },
    { path: 'statistical', component: UserManager },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
