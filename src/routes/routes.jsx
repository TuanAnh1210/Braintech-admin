
import BillManager from '@/pages/BillManager';

import Dashboard from '@/pages/Dashboard';
import CourseManager from '@/pages/CourseManager';

import UserManager from '@/pages/UserManager';
import Analytics from '@/pages/Analytics';
import CommentManager from '@/pages/CommentManager';
import DetailComment from '@/pages/DetailComment';
const publicRoutes = [
    { path: 'dashboard', component: Dashboard },
    { path: 'manager-users', component: UserManager },

    { path: 'manager-courses', component: CourseManager },
    { path: 'manager-comments', component: CommentManager },
    { path: 'manager-comments/:id', component: DetailComment },
    { path: 'manager-bills', component: BillManager },
    { path: 'statistical', component: Analytics },

];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
