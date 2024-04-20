import DetailBill from '@/pages/DetailBill';
import UserManager from '@/pages/UserManager';
import Dashboard from '@/pages/Dashboard';
import * as Course from '@/pages/CourseManager';
import Analytics from '@/pages/Analytics';
import CommentManager from '@/pages/CommentManager';
import DetailComment from '@/pages/DetailComment';
import BillManager from '@/pages/BillManager';

const publicRoutes = [
    { path: 'dashboard', component: Dashboard },
    { path: 'manager-users', component: UserManager },

    { path: 'manager-courses', component: Course.CoursesPage },
    { path: 'manager-courses/create', component: Course.CreateCoursePage },
    { path: 'manager-courses/:courseId', component: Course.CourseDetailPage },
    { path: 'manager-courses/:courseId/:chapterId', component: Course.ChapterDetailPage },

    { path: 'manager-comments', component: CommentManager },
    { path: 'manager-comments/:id', component: DetailComment },
    { path: 'manager-bills', component: BillManager },
    { path: 'manager-bills/:id', component: DetailBill },

    { path: 'statistical', component: Analytics },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
