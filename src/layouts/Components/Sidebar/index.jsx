import { FaUser, FaClapperboard, FaCommentDots, FaRegCreditCard, FaHouseChimney } from 'react-icons/fa6';

import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './AdminSidebar.module.scss';

import logoImage from '@/assets/images/logo.png';
import { useCookies } from 'react-cookie';

const cx = classNames.bind(styles);

function AdminSidebar() {
    const [cookies] = useCookies(['cookieLoginStudent']);
    const navItemAdmin = [
        { path: '/dashboard', label: 'Dashboard', icon: <FaHouseChimney className="text-lg" /> },
        { path: '/manager-users', label: 'Học viên', icon: <FaUser className="text-lg" /> },
        { path: '/manager-teachers', label: 'Giảng viên', icon: <FaUser className="text-lg" /> },
        { path: '/manager-courses', label: 'Khóa học', icon: <FaClapperboard className="text-lg" /> },
        { path: '/manager-comments', label: 'Bình luận', icon: <FaCommentDots className="text-lg" /> },
        { path: '/manager-bills', label: 'Hóa đơn', icon: <FaRegCreditCard className="text-lg" /> },
    ];
    const navItemTeacher = [
        { path: '/my-courses', label: 'Khóa học của tôi', icon: <FaClapperboard className="text-lg" /> },
        { path: '/my-students', label: 'Sinh viên của tôi', icon: <FaUser className="text-lg" /> },
    ];

    return (
        <div className="w-[280px] fixed top-0 bottom-0 bg-white border-r">
            {/* bg-[#111c43] */}
            <div className="flex flex-col">
                <div className="logo flex items-center justify-center border-b pb-4 p-4">
                    <a href={import.meta.env.VITE_REACT_APP_APP_PATH} className="flex items-center gap-3">
                        <img width={35} style={{ borderRadius: '5px' }} src={logoImage} alt="" />
                        <div style={{ fontWeight: 600, fontSize: '20px' }}>
                            <span style={{ color: '#3dd5a2' }}>Brain</span>
                            <span style={{ color: '#6666ff' }}>Tech</span>
                        </div>
                    </a>
                </div>
                <div className="flex flex-row p-3 pt-6">
                    {(cookies?.cookieLoginStudent?.isAdmin && !cookies?.cookieLoginStudent?.isTeacher) && (
                        <div className={cx('nav')}>
                            {navItemAdmin.map((item, index) => {
                                return (
                                    <NavLink
                                        key={index}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            cx(isActive && 'active', 'nav-item', 'duration-150')
                                        }
                                    >
                                        <div className="flex items-center gap-3.5">
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                    </NavLink>
                                );
                            })}
                        </div>
                    )}
                    {cookies?.cookieLoginStudent?.isTeacher && (
                        <div className={cx('nav')}>
                            {navItemTeacher.map((item, index) => {
                                return (
                                    <NavLink
                                        key={index}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            cx(isActive && 'active', 'nav-item', 'duration-150')
                                        }
                                    >
                                        <div className="flex items-center gap-3.5">
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                    </NavLink>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminSidebar;
