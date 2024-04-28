/* eslint-disable react/prop-types */
import { Row, Col } from 'antd';
import { formatMoneyInt } from '@/lib/utils';

export const Overview = ({ userData, courseData, statCourseData }) => {
    return (
        <Row gutter={[16, 16]}>
            <Col span={8}>
                <div className="relative px-[5px] py-[10px]">
                    <div className="static">
                        <div className="bg-[#f5700c] absolute top-0 left-0 sm:w-[40px] sm:h-[60px] md:h-[75px] md:w-[50px] lg:w-[86px] lg:h-[86px]  sm:ml-[15px] lg:ml-[20px] text-center sm:pl-[15px] lg:pl-[25px] p-[25px] rounded ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="bi bi-people-fill sm:w-[15px] sm:h-[15px] md:w-[20px] md:h-[20px] lg:w-[36px] lg:h-[36px]"
                                fill="white"
                                viewBox="0 0 16 16"
                            >
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-gray-600 h-[100%] mt-[20px] pt-[50px] pb-[10px] rounded w-full">
                        <div className="text-right text-white px-4">
                            <p className=" sm:text-[10px] md:text-[10px] lg:text-[17px] xl:text-[17px]">Học viên mới</p>
                            <h3 className="text-white lg:text-[26px] lg:text-bold">{userData?.filtered?.length}</h3>
                        </div>
                        <div className="mt-[30px] mx-[20px]  border-t-2 border-white">
                            <div className=" flex flex-row pt-[10px] text-center items-center">
                                <a href="#pablo" className="warning-link text-white sm:text-[10px] lg:text-[15px]">
                                    Tổng học viên : {userData?.original?.length}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col className="gutter-row" span={8}>
                <div className=" relative p-[5px] py-[10px] ">
                    <div className="static">
                        <div className="card-icon bg-[#288c6c] absolute top-0 left-0  sm:w-[40px] md:w-[40px] lg:w-[86px] lg:h-[86px]  sm:ml-[15px] lg:ml-[20px] text-center sm:pl-[15px] lg:pl-[25px] p-[25px] rounded ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="white"
                                className="bi bi-book-half sm:w-[15px] sm:h-[15px] md:w-[20px] md:h-[20px] lg:w-[36px] lg:h-[36px]"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-gray-600 h-[100%] mt-[20px] pt-[50px] pb-[10px]  rounded w-full">
                        <div className="text-white text-right px-4">
                            <p className="sm:text-[10px] md:text-[10px] lg:text-[17px] xl:text-[17px]">
                                Khóa học đang hoạt động
                            </p>
                            <h3 className=" lg:text-[26px] lg:text-bold">{statCourseData?.length}</h3>
                        </div>
                        <div className="mt-[30px] mx-[20px]  border-t-2 border-white  ">
                            <div className=" flex flex-row pt-[10px] text-center items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="bi bi-clipboard-fill sm:w-[0px] sm:h-[0px]"
                                    width="16"
                                    height="16"
                                    fill="white"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2"
                                    />
                                </svg>
                                <a href="#pablo" className="warning-link text-white sm:text-[10px] lg:text-[15px]">
                                    Tổng khóa học: {courseData?.length}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col className="gutter-row" span={8}>
                <div className="  relative p-[5px] py-[10px] ">
                    <div className="static">
                        <div className="bg-[#d22824] absolute top-0 left-0 sm:w-[40px] md:w-[40px] lg:w-[86px] lg:h-[86px]  sm:ml-[15px] lg:ml-[20px] text-center sm:pl-[15px] lg:pl-[25px] p-[25px] rounded ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="white"
                                className="bi bi-receipt sm:w-[15px] sm:h-[15px] md:w-[20px] md:h-[20px] lg:w-[36px] lg:h-[36px]"
                                viewBox="0 0 16 16"
                            >
                                <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z" />
                                <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-gray-600 h-[100%] mt-[20px]  pt-[50px] pb-[10px]  rounded w-full">
                        <div className="text-white text-right px-4">
                            <p className="sm:text-[10px] md:text-[10px] lg:text-[17px] xl:text-[17px]">
                                Tổng doanh thu
                            </p>
                            <h3 className="lg:text-[17px] lg:text-[26px] lg:text-bold">
                                {formatMoneyInt(statCourseData.reduce((pre, cur) => cur.revenue + pre, 0)) + 'đ'}
                            </h3>
                        </div>
                        <div className="mt-[30px] mx-[20px]  border-t-2 border-white  ">
                            <div className=" flex flex-row pt-[10px] text-center items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="bi bi-clipboard-fill sm:w-[0px] sm:h-[0px]"
                                    width="16"
                                    height="16"
                                    fill="white"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2"
                                    />
                                </svg>
                                <span className="mt-5"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    );
};
