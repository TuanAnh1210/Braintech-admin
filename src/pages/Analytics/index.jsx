/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Layout, Table, Card, Input, Space, Button, Breadcrumb, Form, DatePicker, Row, Col } from 'antd';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { useGetUsersQuery } from '@/providers/apis/userApi';
import { useGetCoursesQuery } from '@/providers/apis/courseApi';
import { useGetBillsQuery } from '@/providers/apis/billApi';

import { formatMoneyInt } from '@/lib/utils';
import { TIMEFRAMES } from '@/lib/utils';
import { Overview } from './overview';
import { CourseCategoryChart } from './charts';
import { useGetAllCoursesQuery } from '@/providers/apis/courseTeacherApi';
const { Content } = Layout;
const { RangePicker } = DatePicker;

dayjs.extend(isBetween);

const rangeFitler = (items, { fromDate, toDate }) => {
    return items.filter((item) => {
        if (!item?.createdAt) return false;
        return dayjs(item?.createdAt).isBetween(fromDate, toDate);
    });
};

const Analytics = () => {
    const [timeframe, setTimeframe] = useState(TIMEFRAMES.thisMonth);
    const { data: billResponse, isLoading } = useGetBillsQuery(timeframe, { skip: !timeframe });
    const { data: userResponse } = useGetUsersQuery();
    //const { data: courseTeacher } = useGetCoursesQuery();
    const { data: courseTeacher } = useGetAllCoursesQuery()
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [billData, setBillData] = useState([]);

    const [userData, setUserData] = useState(userResponse?.data);
    const [courseData, setCourseData] = useState(courseTeacher?.data);

    const [sortedInfo, setSortedInfo] = useState({});
    const searchInput = useRef(null);

    const handleNameSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    //! BAD CODE but will work
    useEffect(() => {
        if (billResponse) {
            const data = billResponse.map((bill) => {
                // eslint-disable-next-line no-unused-vars
                const { course_info, user_info, category_info, ...rest } = bill;

                return { course_info, user_info, ...rest };
            });

            const groupedData = data.reduce((group, b) => {
                const i = group.findIndex((item) => item._id === b.course_info._id);
                return (
                    i === -1
                        ? group.push({
                            _id: b.course_info._id,
                            subscribers: 1,
                            price: b.course_info.price,
                            name: b.course_info.name,
                            chapters: b.course_info.chapters,
                            totalLessons: b.course_info.totalLessons,
                        })
                        : group[i].subscribers++,
                    group
                );
            }, []);

            setBillData(groupedData);
        }
    }, [billResponse]);

    // handle time range filter
    useEffect(() => {
        if (userResponse?.data) {
            const original = userResponse.data.filter((u) => !u.isAdmin);
            const filtered = rangeFitler(original, timeframe);

            setUserData({ original, filtered });
        }

        if (courseTeacher) {
            const original = courseTeacher;
            const filtered = rangeFitler(original, timeframe);

            setCourseData({ original, filtered });
        }
    }, [timeframe, userResponse, courseTeacher]);

    // handle sort
    const handleSorted = (sortOrder, columnKey) => {
        const sortedData = [...billData].sort((a, b) => {
            if (sortOrder === 'ascend') {
                return a[columnKey] - b[columnKey];
            } else {
                return b[columnKey] - a[columnKey];
            }
        });

        setSortedInfo({ columnKey, order: sortOrder });
        setBillData(sortedData);
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
                    spellCheck={false}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleNameSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleNameSearch(selectedKeys, confirm, dataIndex)}
                        icon={''}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Xác nhận
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
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Lọc
                    </Button>
                    <Button type="link" size="small" onClick={() => close()}>
                        Đóng
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <FontAwesomeIcon
                icon={faSearch}
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) setTimeout(() => searchInput.current?.select(), 100);
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

    // Table columns
    const columnCourse = [
        { title: 'ID', dataIndex: '_id', key: 'id', width: '10%' },
        {
            title: 'Tên Khóa Học',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Đơn Giá',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
            onHeaderCell: () => ({
                onClick: () => {
                    handleSorted(sortedInfo.order === 'ascend' ? 'descend' : 'ascend', 'price');
                },
            }),
            ...getColumnSearchProps('price'),
            render: (price) => (price !== 0 ? formatMoneyInt(price) + 'đ' : 'Miễn Phí'),
        },
        {
            title: 'Doanh Thu',
            dataIndex: 'price',
            key: 'revenue',
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'revenue' && sortedInfo.order,
            onHeaderCell: () => ({
                onClick: () => {
                    handleSorted(sortedInfo.order === 'ascend' ? 'descend' : 'ascend', 'revenue');
                },
            }),
            ...getColumnSearchProps('revenue'),
            render: (price, data) => {
                return formatMoneyInt(price * data.subscribers) + 'đ';
            },
        },
        {
            title: 'Học Viên',
            dataIndex: 'subscribers',
            key: 'subscribers',
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'full_name' && sortedInfo.order,
            onHeaderCell: () => ({
                onClick: () => {
                    handleSorted(sortedInfo.order === 'ascend' ? 'descend' : 'ascend', 'subscribers');
                },
            }),
        },
        {
            title: 'Chương',
            dataIndex: 'chapters',
            key: 'chapters',
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'full_name' && sortedInfo.order,
            onHeaderCell: () => ({
                onClick: () => {
                    handleSorted(sortedInfo.order === 'ascend' ? 'descend' : 'ascend', 'chapters');
                },
            }),
            render: (chapters) => chapters?.length,
        },
        {
            title: 'Bài học',
            dataIndex: 'totalLessons',
            key: 'totalLessons',
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'totalLessons' && sortedInfo.order,
            onHeaderCell: () => ({
                onClick: () => {
                    handleSorted(sortedInfo.order === 'ascend' ? 'descend' : 'ascend', 'totalLessons');
                },
            }),
        },
    ];

    const [form] = Form.useForm();

    // Update range
    const updateTimeframe = (date) => {
        let [fromDate, toDate] = date;
        setTimeframe({ fromDate: fromDate.valueOf(), toDate: toDate.endOf('day').valueOf() });
    };

    return (
        <Layout>
            <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: ' Thống kê' }]} />
            <Content>
                <Overview userData={userData} billData={billData} courseData={courseData} />
                <Row gutter={[16, 16]}>
                    <Col span={18} xl={18} md={24}>
                        <Card
                            title={
                                <Form
                                    className="mt-6"
                                    form={form}
                                    initialValues={{
                                        range_picker: [dayjs().startOf('month'), dayjs()],
                                    }}
                                >
                                    <Form.Item name="range_picker" label="Thống Kê">
                                        <RangePicker onChange={updateTimeframe} />
                                    </Form.Item>
                                </Form>
                            }
                        >
                            <Table loading={isLoading} dataSource={billData} columns={columnCourse} />
                        </Card>
                    </Col>
                    <Col span={6} className="relative h-100" xl={6} md={0}>
                        <p className="text-black text-bold text-right absolute text-lg mt-2 ml-6 z-[100] left-0">
                            Thông kê danh mục
                        </p>
                        <CourseCategoryChart courseData={courseData} />
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default Analytics;
