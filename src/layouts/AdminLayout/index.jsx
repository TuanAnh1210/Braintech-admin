/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';

import AdminHeader from '../Components/Header';
import AdminFooter from '../Components/Footer';
import AdminSidebar from '../Components/Sidebar';

import styles from './AdminLayout.module.scss';

const cx = classNames.bind(styles);

const AdminLayout = ({ children }) => {
    return (
        <div className={cx('main')}>
            <AdminSidebar />
            <AdminHeader />
            <div className={cx('main-layout')} style={{ padding: '0 24px' }}>
                <div className={cx('main-content')}>{children}</div>
                <AdminFooter />
            </div>
        </div>
    );
};

export default AdminLayout;
