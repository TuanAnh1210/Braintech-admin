import DetailBill from '@/pages/DetailBill';
import UserManager from '@/pages/UserManager';
import * as Course from '@/pages/CourseManager';
import * as CourseTeacher from '@/pages/CourseTeacher';
import Analytics from '@/pages/Analytics';
import CommentManager from '@/pages/CommentManager';
import DetailComment from '@/pages/DetailComment';
import BillManager from '@/pages/BillManager';
import MyStudents from '@/pages/MyStudents';

const publicRoutes = [
    { path: 'dashboard', component: Analytics },
    { path: 'manager-users', component: UserManager },

    // { path: 'my-students', component: MyStudents },

    { path: 'manager-courses', component: Course.CoursesPage },
    { path: 'manager-courses/create', component: Course.CreateCoursePage },
    { path: 'manager-courses/:courseId', component: Course.CourseDetailPage },
    { path: 'manager-courses/:courseId/:chapterId', component: Course.ChapterDetailPage },

    // { path: 'my-courses', component: CourseTeacher.CoursesPage },
    // { path: 'my-courses/create', component: CourseTeacher.CreateCoursePage },
    // { path: 'my-courses/:courseId', component: CourseTeacher.CourseDetailPage },
    // { path: 'my-courses/:courseId/:chapterId', component: CourseTeacher.ChapterDetailPage },

    { path: 'manager-comments', component: CommentManager },
    { path: 'manager-comments/:id', component: DetailComment },
    { path: 'manager-bills', component: BillManager },
    { path: 'manager-bills/:id', component: DetailBill },
];

const publicRoutesTeacher = [
    { path: 'my-students', component: MyStudents },

    { path: 'my-courses', component: CourseTeacher.CoursesPage },
    { path: 'my-courses/create', component: CourseTeacher.CreateCoursePage },
    { path: 'my-courses/:courseId', component: CourseTeacher.CourseDetailPage },
    { path: 'my-courses/:courseId/:chapterId', component: CourseTeacher.ChapterDetailPage },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes,publicRoutesTeacher };
