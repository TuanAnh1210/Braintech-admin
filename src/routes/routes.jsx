import CourseManager from '@/pages/CourseManager';
import UserManager from '@/pages/UserManager';
import Analytics from '@/pages/Analytics';
const publicRoutes = [
    { path: 'dashboard', component: UserManager },
    { path: 'manager-users', component: UserManager },
    { path: 'manager-courses', component: CourseManager },
    { path: 'manager-comments', component: UserManager },
    { path: 'manager-bills', component: UserManager },
    { path: 'statistical', component: Analytics },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
