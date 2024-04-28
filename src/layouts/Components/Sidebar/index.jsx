import { FaUser, FaClapperboard, FaCommentDots, FaRegCreditCard, FaHouseChimney } from 'react-icons/fa6';

import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './AdminSidebar.module.scss';

const cx = classNames.bind(styles);

function AdminSidebar() {
    const navItem = [
        { path: '/dashboard', label: 'Dashboard', icon: <FaHouseChimney className="text-lg" /> },
        { path: '/manager-users', label: 'Tài khoản', icon: <FaUser className="text-lg" /> },
        { path: '/manager-courses', label: 'Khóa học', icon: <FaClapperboard className="text-lg" /> },
        { path: '/manager-comments', label: 'Bình luận', icon: <FaCommentDots className="text-lg" /> },
        { path: '/manager-bills', label: 'Hóa đơn', icon: <FaRegCreditCard className="text-lg" /> },
    ];

    return (
        <div className="w-[280px] fixed top-0 bottom-0 bg-white border-r">
            {/* bg-[#111c43] */}
            <div className="flex flex-col">
                <div className="logo flex items-center justify-center border-b pb-4 p-4">
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <img
                            width={35}
                            style={{ borderRadius: '5px' }}
                            src="http://localhost/braintech/public/imgs/logo.png"
                            alt=""
                        />
                        <div style={{ fontWeight: 600, fontSize: '20px' }}>
                            <span style={{ color: '#3dd5a2' }}>Brain</span>
                            <span style={{ color: '#6666ff' }}>Tech</span>
                        </div>
                    </Link>
                </div>
                <div className="flex flex-row p-3 pt-6">
                    <div className={cx('nav')}>
                        {navItem.map((item, index) => {
                            return (
                                <NavLink
                                    key={index}
                                    to={item.path}
                                    className={({ isActive }) => cx(isActive && 'active', 'nav-item', 'duration-150')}
                                >
                                    <div className="flex items-center gap-3.5">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </div>
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminSidebar;
