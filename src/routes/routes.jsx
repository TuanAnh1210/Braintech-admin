import BillManager from '@/pages/BillManager';
import DetailBill from '@/pages/DetailBill';
import UserManager from '@/pages/UserManager';

const publicRoutes = [
    { path: 'dashboard', component: UserManager },
    { path: 'manager-users', component: UserManager },
    { path: 'manager-courses', component: UserManager },
    { path: 'manager-comments', component: UserManager },
    { path: 'manager-bills', component: BillManager },
    { path: 'manager-bills/:id', component: DetailBill},
    { path: 'statistical', component: UserManager },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
