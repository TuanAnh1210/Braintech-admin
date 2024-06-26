import DetailBill from '@/pages/DetailBill';
import * as Course from '@/pages/CourseManager';
import * as CourseTeacher from '@/pages/CourseTeacher';
import Analytics from '@/pages/Analytics';
import CommentManager from '@/pages/CommentManager';
import DetailComment from '@/pages/DetailComment';
import BillManager from '@/pages/BillManager';
import DiscountCode from '@/pages/DiscountCode';
import MyStudents from '@/pages/MyStudents';
import TeacherManager from '@/pages/TeacherManager';
import RateManager from '@/pages/RateManager';
import DetailTeacher from '@/pages/DetailTeacher';
import CreateDiscountCode from '@/pages/DiscountCode/AddDiscountCode';
import UserManager from '@/pages/UserManager';

import GiftedVouchers from '@/pages/DiscountCode/GiftedVouchers';


const publicRoutes = [
    { path: 'dashboard', component: Analytics },
    { path: 'manager-users', component: UserManager },
    { path: 'manager-teachers', component: TeacherManager },
    { path: 'manager-teachers/:id', component: DetailTeacher },
    { path: 'manager-courses', component: Course.CoursesPage },
    { path: 'manager-courses/create', component: Course.CreateCoursePage },
    { path: 'manager-courses/:courseId', component: Course.CourseDetailPage },
    { path: 'manager-courses/:courseId/:chapterId', component: Course.ChapterDetailPage },

    { path: 'manager-rating', component: RateManager },

    { path: 'manager-comments', component: CommentManager },
    { path: 'manager-comments/:id', component: DetailComment },
    { path: 'manager-bills', component: BillManager },
    { path: 'manager-bills/:id', component: DetailBill },
    { path: 'manager-discount', component: DiscountCode },
    { path: 'manager-discount/add', component: CreateDiscountCode },
    { path: 'manager-discount/gift-voucher', component: GiftedVouchers },
];

const publicRoutesTeacher = [
    { path: 'my-students', component: MyStudents },
    { path: 'my-courses', component: CourseTeacher.CoursesPage },
    { path: 'my-courses/create', component: CourseTeacher.CreateCoursePage },
    { path: 'my-courses/:courseId', component: CourseTeacher.CourseDetailPage },
    { path: 'my-courses/:courseId/:chapterId', component: CourseTeacher.ChapterDetailPage },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes, publicRoutesTeacher };
