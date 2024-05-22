import classNames from 'classnames/bind';
import { CgSun } from 'react-icons/cg';
import { FaGear, FaExpand, FaCompress, FaBell, FaRightFromBracket } from 'react-icons/fa6';
import { useEffect, useState } from 'react';

import styles from './AdminHeader.module.scss';

import facesImage from '@/assets/images/faces.jpg';
import { Cookies, useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function AdminHeader() {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['cookieLoginStudent']);

    const [fullScreen, setFullScreen] = useState(false);

    const handleFullScreen = () => {
        const eBody = document.documentElement;
        if (eBody.requestFullscreen) eBody.requestFullscreen();
        /* Safari */
        if (eBody.webkitRequestFullscreen) eBody.webkitRequestFullscreen();
        /* IE11 */
        if (eBody.msRequestFullscreen) eBody.msRequestFullscreen();
        setFullScreen(true);
    };

    const handleExitFullScreen = () => {
        if (document.exitFullscreen) document.exitFullscreen();
        /* Safari */
        if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        /* IE11 */
        if (document.msExitFullscreen) document.msExitFullscreen();
        setFullScreen(false);
    };

    useEffect(() => {
        if (Object.keys(cookies).length === 0 || !cookies?.cookieLoginStudent?.isTeacher && !cookies?.cookieLoginStudent?.isAdmin) {
            window.location.href = 'http://localhost:3000/';
        }
        const handleFullScreenChange = () => {
            if (document.fullscreenElement) {
                setFullScreen(true);
            } else {
                setFullScreen(false);
            }
        };

        const handleFullScreenError = (event) => {
            console.error('Lỗi full screen:', event);
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('fullscreenerror', handleFullScreenError);

        // Cleanup khi component unmount
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('fullscreenerror', handleFullScreenError);
        };
    }, []);

    const handleScreen = () => {
        if (!fullScreen) {
            handleFullScreen();
        } else {
            handleExitFullScreen();
        }
    };
    const _cookies = new Cookies(); // Tạo một instance mới của Cookies

    const handleLogout = () => {
        _cookies.remove('cookieLoginStudent');
        window.location.reload();
    };

    return (
        <div className={cx('header', 'h-[68px] border-b z-30')}>
            <div className="cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6Z"
                        fill="#536485"
                    />
                    <path
                        d="M4 18C4 17.4477 4.44772 17 5 17H19C19.5523 17 20 17.4477 20 18C20 18.5523 19.5523 19 19 19H5C4.44772 19 4 18.5523 4 18Z"
                        fill="#536485"
                    />
                    <path
                        d="M5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H13C13.5523 13 14 12.5523 14 12C14 11.4477 13.5523 11 13 11H5Z"
                        fill="#536485"
                    />
                </svg>
            </div>
            <div className="flex items-center gap-6 text-[#536485] text-lg">
                {/* <CgSun className="cursor-pointer text-[#ffa735] hover:rotate-180 duration-150" /> */}

                {/* <div className={classNames('relative cursor-pointer')}>
                    <FaBell />
                    <div className="absolute -right-1 -top-1">
                        <span className="relative flex w-2.5 h-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-sky-500"></span>
                        </span>
                    </div>
                </div> */}

                <div className="cursor-pointer" onClick={handleScreen}>
                    {!fullScreen ? <FaExpand /> : <FaCompress />}
                </div>
                {
                    <div className="flex items-center gap-3 cursor-pointer">
                        <img
                            width={30}
                            height={30}
                            className="rounded-full"
                            src={cookies?.cookieLoginStudent?.avatar}
                            alt=""
                        />
                        <div className="flex items-start flex-col">
                            <span className="leading-5" style={{ fontSize: '12px', fontWeight: '600' }}>
                                {cookies?.cookieLoginStudent?.fullName}
                            </span>
                            <span className="leading-4" style={{ fontSize: '10px' }}>
                                {cookies?.cookieLoginStudent?.email}
                            </span>
                        </div>
                    </div>
                }

                <FaRightFromBracket title="Đăng xuất" className={cx('cursor-pointer')} onClick={handleLogout} />
            </div>
        </div>
    );
}

export default AdminHeader;
