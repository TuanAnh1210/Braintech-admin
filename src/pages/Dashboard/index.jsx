import { Breadcrumb, Button, Col, Input, Row, Space, Table } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useGetCoursesQuery } from '@/providers/apis/courseApi';
import { useGetBillsQuery } from '@/providers/apis/billApi';
import { useGetUsersQuery } from '@/providers/apis/userApi';

const Dashboard = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const { data: listCourses } = useGetCoursesQuery();
    const { data: listBills } = useGetBillsQuery();
    const { data: listUser } = useGetUsersQuery();
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            width: '5%',
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'name',
            key: 'name',
            width: '35%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Số lượng bán',
            dataIndex: 'count',
            key: 'count',
            width: '15%',
            ...getColumnSearchProps('count'),
        },

        {
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            width: '20%',
            ...getColumnSearchProps('price'),
        },

        {
            title: 'Tổng',
            dataIndex: 'totalSum',
            key: `totalSum`,
            ...getColumnSearchProps('totalSum'),
            sorter: (a, b) => a.description.length - b.description.length,
            sortDirections: ['descend', 'ascend'],
        },
    ];
    // const langs = listBills?.coursesBuy?.map((i) => i?.course_id?.name)
    // const setLang = new Set(langs)

    // // for (let l of setLang) {
    // //     const filterlang = langs.filter((lang) => lang === l)

    // //     Counts.push({ name: l, count: filterlang.length })
    // // }
    // Tạo một đối tượng băm (hash object) để đếm số lần xuất hiện của mỗi object
    const Counts = [];
    const langsPrice = listBills?.coursesBuy?.map((i) => i?.course_id);
    let countMap = {};
    langsPrice?.forEach((obj) => {
        const key = JSON.stringify(obj); // Tạo một key dựa trên JSON của object
        countMap[key] = (countMap[key] || 0) + 1; // Đếm số lần xuất hiện của mỗi object
    });

    // Lọc ra các object không trùng lặp
    const uniqueObjects = Object.keys(countMap).map((key) => JSON.parse(key));

    // Hiển thị số lượng và các object không trùng lặp
    uniqueObjects.forEach((obj, index) => {
        let key = JSON.stringify(obj);
        Counts.push({
            id: index + 1,
            name: obj.name,
            price: VND.format(obj.price),
            count: countMap[key],
            total: countMap[key] * obj.price,
            totalSum: VND.format(countMap[key] * obj.price),
        });
    });

    function SumCourt(arr) {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    }

    let sumItem = SumCourt(Counts?.map((i) => i?.total));

    return (
        <div className="w-full">
            <Breadcrumb
                className="mb-5"
                items={[
                    {
                        title: 'Trang chủ',
                    },
                    {
                        title: 'Dashboard',
                    },
                ]}
            />
            <Row className="pr-[30px] w-[100%] ">
                <Col className="gutter-row " span={6}>
                    <div className="lg:w-[190px] xl:w-[280px] sm:w-[80px] md:w-[100px] relative px-[5px] py-[10px]">
                        <div className=" static   ">
                            <div className="bg-[#f5700c] absolute top-0 left-0 sm:w-[40px] sm:h-[60px] md:h-[75px] md:w-[50px] lg:w-[86px] lg:h-[86px]  sm:ml-[15px] lg:ml-[20px] text-center sm:pl-[15px] lg:pl-[25px] p-[25px] rounded ">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sm:w-[15px] sm:h-[15px] md:w-[20px] md:h-[20px] lg:w-[36px] lg:h-[36px]"
                                    width=""
                                    height=""
                                    fill="white"
                                    class="bi bi-people-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-gray-600 h-[100%] mt-[20px] pt-[50px] pb-[10px] rounded w-full">
                            <div className="lg:ml-[65%] xl:ml-[65%] sm:ml-[20%]">
                                <p className="text-white sm:text-[10px] md:text-[10px] lg:text-[17px] xl:text-[17px]">
                                    Học viên
                                </p>
                                <h3 className="text-white xl:ml-[65%] lg:ml-[60%] sm:ml-[30%] lg:text-[17px]">
                                    {listUser?.data?.filter((user) => user?.role == 'user').length}
                                </h3>
                            </div>
                            <div className="mt-[30px] mx-[20px]  border-t-2 border-white  ">
                                <div className=" flex flex-row pt-[10px] text-center items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className=""
                                        height="16"
                                        width="16"
                                        viewBox="0 0 640 512"
                                        fill="white"
                                    >
                                        <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                                    </svg>
                                    <a href="#pablo" className="warning-link  text-white sm:text-[10px] lg:text-[15px]">
                                        Tổng học viên
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col className="gutter-row" span={6}>
                    <div className="lg:w-[190px] xl:w-[280px] sm:w-[80px] md:w-[100px] relative p-[5px] py-[10px] ">
                        <div className="static ">
                            <div className="card-icon bg-[#288c6c] absolute top-0 left-0  sm:w-[40px] md:w-[40px] lg:w-[86px] lg:h-[86px]  sm:ml-[15px] lg:ml-[20px] text-center sm:pl-[15px] lg:pl-[25px] p-[25px] rounded ">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sm:w-[15px] sm:h-[15px] md:w-[20px] md:h-[20px] lg:w-[36px] lg:h-[36px]"
                                    width=""
                                    height=""
                                    fill="white"
                                    class="bi bi-code"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8z" />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-gray-600 h-[100%] mt-[20px] pt-[50px] pb-[10px]  rounded w-full">
                            <div className="lg:ml-[65%] xl:ml-[65%] sm:ml-[20%]">
                                <p className="text-white sm:text-[10px] md:text-[10px] lg:text-[17px] xl:text-[17px]">
                                    Front-End
                                </p>
                                <h3 className="text-white xl:ml-[65%] lg:ml-[60%] sm:ml-[30%] lg:text-[17px]">
                                    {listCourses?.courses?.filter((course) => course?.cate_id?.name == 'fe').length}
                                </h3>
                            </div>
                            <div className="mt-[30px] mx-[20px]  border-t-2 border-white  ">
                                <div className=" flex flex-row pt-[10px] text-center items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="sm:w-[0px] sm:h-[0px]"
                                        width="16"
                                        height="16"
                                        fill="white"
                                        class="bi bi-clipboard-fill"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2"
                                        />
                                    </svg>
                                    <a href="#pablo" className="warning-link  text-white sm:text-[10px] lg:text-[15px]">
                                        Tổng khóa học
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col className="gutter-row" span={6}>
                    <div className=" lg:w-[190px] xl:w-[280px] sm:w-[80px] md:w-[100px] relative p-[5px] py-[10px] ">
                        <div className=" static   ">
                            <div className="bg-[#d22824] absolute top-0 left-0 sm:w-[40px] md:w-[40px] lg:w-[86px] lg:h-[86px]  sm:ml-[15px] lg:ml-[20px] text-center sm:pl-[15px] lg:pl-[25px] p-[25px] rounded ">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sm:w-[15px] sm:h-[15px] md:w-[20px] md:h-[20px] lg:w-[36px] lg:h-[36px]"
                                    width=""
                                    height=""
                                    fill="white"
                                    class="bi bi-braces"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M2.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C3.25 2 2.49 2.759 2.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M13.886 7.9v.163c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456V7.332c-1.114 0-1.49-.362-1.49-1.456V4.352C13.51 2.759 12.75 2 11.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6" />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-gray-600 h-[100%] mt-[20px]  pt-[50px] pb-[10px]  rounded w-full">
                            <div className="lg:ml-[65%] xl:ml-[65%] sm:ml-[20%]">
                                <p className="text-white sm:text-[10px] md:text-[10px] lg:text-[17px] xl:text-[17px]">
                                    Back-End
                                </p>
                                <h3 className="text-white xl:ml-[65%] lg:ml-[60%] sm:ml-[30%] lg:text-[17px]">
                                    {listCourses?.courses?.filter((course) => course?.cate_id?.name == 'be').length}
                                </h3>
                            </div>
                            <div className="mt-[30px] mx-[20px]  border-t-2 border-white  ">
                                <div className=" flex flex-row pt-[10px] text-center items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="sm:w-[0px] sm:h-[0px]"
                                        width="16"
                                        height="16"
                                        fill="white"
                                        class="bi bi-clipboard-fill"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2"
                                        />
                                    </svg>
                                    <a href="#pablo" className="warning-link  text-white sm:text-[10px] lg:text-[15px]">
                                        Tổng khóa học
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col className="gutter-row " span={6}>
                    <div className="lg:w-[190px] xl:w-[280px] sm:w-[80px] md:w-[100px] relative p-[5px] py-[10px] ">
                        <div className="static">
                            <div className="bg-[#029eb1] absolute top-0 left-0 sm:w-[40px] md:w-[40px] lg:w-[86px] lg:h-[86px]  sm:ml-[15px] lg:ml-[20px] sm:pl-[15px] lg:pl-[25px] p-[25px] rounded ">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sm:w-[15px] sm:h-[15px] md:w-[20px] md:h-[20px] lg:w-[36px] lg:h-[36px]"
                                    width=""
                                    height=""
                                    fill="white"
                                    class="bi bi-file-code"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M6.646 5.646a.5.5 0 1 1 .708.708L5.707 8l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708zm2.708 0a.5.5 0 1 0-.708.708L10.293 8 8.646 9.646a.5.5 0 0 0 .708.708l2-2a.5.5 0 0 0 0-.708z" />
                                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1" />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-gray-600 h-[100%] mt-[20px] pt-[50px] pb-[10px]  rounded w-full">
                            <div className="lg:ml-[65%] xl:ml-[65%] sm:ml-[20%]">
                                <p className="text-white sm:text-[10px] md:text-[10px] lg:text-[17px] xl:text-[17px]">
                                    Khóa Pro
                                </p>
                                <h3 className="text-white xl:ml-[65%] lg:ml-[60%] sm:ml-[30%] lg:text-[17px]">
                                    {listCourses?.courses?.filter((course) => course?.cate_id?.name == 'pro').length}
                                </h3>
                            </div>
                            <div className="mt-[30px] mx-[20px]  border-t-2 border-white  ">
                                <div className=" flex flex-row pt-[10px] text-center items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="sm:w-[0px] sm:h-[0px]"
                                        width="16"
                                        height="16"
                                        fill="white"
                                        class="bi bi-clipboard-fill"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2"
                                        />
                                    </svg>
                                    <a href="#pablo" className="warning-link text-white sm:text-[10px] lg:text-[15px]">
                                        Tổng khóa học
                                    </a>
                                    <a href="#pablo" className="warning-link text-white sm:text-[10px] lg:text-[15px]">
                                        Tổng khóa học
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* <div className=" relative p-[5px] mt-[100px] ">
                <div className="static">
                    <div className="bg-gray-600 absolute top-0 left-0  w-[95%] sm:h-32 md:h-32 h-[105px] ml-[30px] p-[15px] rounded ">
                        <h4 className="text-white xl:text-[25px] lg:text-[25px] sm:text-[18px] md:text-[18px] mt-[10px] mb-[5px]">
                            Doanh thu năm 2024
                        </h4>
                        <p className="text-white pb-[20px] mr-[20px] sm:text-[15px] md:text-[15px] text-[18px]">
                            {' '}
                            Tổng doanh thu: <span className="px-[5px] font-bold">{VND.format(sumItem)}</span>
                        </p>
                    </div>
                </div>   
            </div>      */}
            <div className=" relative p-[5px] mt-[100px] ">
                <div className="static">
                    <div className="bg-gray-600 absolute top-0 left-0  w-[95%] sm:h-32 md:h-32 h-[105px] ml-[30px] p-[15px] rounded ">
                        <h4 className="text-white xl:text-[25px] lg:text-[25px] sm:text-[18px] md:text-[18px] mt-[10px] mb-[5px]">
                            Doanh thu năm 2024
                        </h4>
                        <p className="text-white pb-[20px] mr-[20px] sm:text-[15px] md:text-[15px] text-[18px]">
                            {' '}
                            Tổng doanh thu: <span className="px-[5px] font-bold">{VND.format(sumItem)}</span>
                        </p>
                    </div>
                </div>
                <div className=" relative p-[5px] mt-[100px] ">
                    <div className="static">
                        <div className="bg-gray-600 absolute top-0 left-0  w-[95%] sm:h-32 md:h-32 h-[105px] ml-[30px] p-[15px] rounded ">
                            <h4 className="text-white xl:text-[25px] lg:text-[25px] sm:text-[18px] md:text-[18px] mt-[10px] mb-[5px]">
                                Doanh thu năm 2024
                            </h4>
                            <p className="text-white pb-[20px] mr-[20px] sm:text-[15px] md:text-[15px] text-[18px]">
                                {' '}
                                Tổng doanh thu: <span className="px-[5px] font-bold">{VND.format(sumItem)}</span>
                            </p>
                        </div>
                    </div>
                    <div className="bg-white mt-[30px]  sm:pt-[100px] md:pt-[150px] pt-[80px] rounded w-full">
                        <div className="px-[30px] ">
                            <Table columns={columns} dataSource={Counts} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
