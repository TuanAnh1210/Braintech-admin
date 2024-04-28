/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Layout, Table, Card, Input, Space, Button, Breadcrumb, Form, DatePicker } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { useGetSttCourseQuery } from '@/providers/apis/sttCourseApi';
import { useGetUsersQuery } from '@/providers/apis/userApi';
import { useGetCoursesQuery } from '@/providers/apis/courseApi';
import { formatMoneyInt } from '@/lib/utils';
import { TIMEFRAMES } from './common';
import { Overview } from './components';

const { Content } = Layout;
const { RangePicker } = DatePicker;

dayjs.extend(isBetween);

const rangeFitler = (items, { fromDate, toDate }) => {
    return items.filter((item) => dayjs(item.createdAt).isBetween(fromDate, toDate));
};

const Analytics = () => {
    const [timeStamp, setTimeStamp] = useState(TIMEFRAMES.thisMonth);
    const { data: statusCourseResponse, isLoading } = useGetSttCourseQuery(timeStamp, { skip: !timeStamp });
    const { data: userResponse } = useGetUsersQuery();
    const { data: courseResponse } = useGetCoursesQuery();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [statCourseData, setStatCourseData] = useState([]);

    const [userData, setUserData] = useState(userResponse?.data);

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

    useEffect(() => {
        if (typeof statusCourseResponse === 'object' && statusCourseResponse?.data) {
            setStatCourseData(statusCourseResponse?.data);
        }
    }, [statusCourseResponse]);

    // handle time range filter
    useEffect(() => {
        if (userResponse?.data) {
            const original = userResponse.data.filter((u) => !u.isAdmin);
            const filtered = rangeFitler(original, timeStamp);

            setUserData({ original, filtered });
        }
    }, [timeStamp, userResponse, courseResponse]);

    // handle sort
    const handleSorted = (sortOrder, columnKey) => {
        const sortedData = [...statCourseData].sort((a, b) => {
            if (sortOrder === 'ascend') {
                return a[columnKey] - b[columnKey];
            } else {
                return b[columnKey] - a[columnKey];
            }
        });

        setSortedInfo({ columnKey, order: sortOrder });
        setStatCourseData(sortedData);
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
            dataIndex: 'revenue',
            key: 'revenue',
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'revenue' && sortedInfo.order,
            onHeaderCell: () => ({
                onClick: () => {
                    handleSorted(sortedInfo.order === 'ascend' ? 'descend' : 'ascend', 'revenue');
                },
            }),
            ...getColumnSearchProps('revenue'),
            render: (price) => formatMoneyInt(price) + 'đ',
        },
        {
            title: 'Học Viên',
            dataIndex: 'subscribers',
            key: 'subscribers',
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'subscribers' && sortedInfo.order,
            onHeaderCell: () => ({
                onClick: () => {
                    handleSorted(sortedInfo.order === 'ascend' ? 'descend' : 'ascend', 'subscribers');
                },
            }),
        },
    ];

    const [form] = Form.useForm();

    // Update range
    const updateCourseData = (date) => {
        let [fromDate, toDate] = date;
        setTimeStamp({ fromDate: fromDate.valueOf(), toDate: toDate.valueOf() });
    };

    return (
        <Layout>
            <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: ' Thống kê' }]} />
            <Content>
                <Overview userData={userData} statCourseData={statCourseData} courseData={courseResponse} />
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
                                <RangePicker onChange={updateCourseData} />
                            </Form.Item>
                        </Form>
                    }
                >
                    <Table loading={isLoading} dataSource={statCourseData} columns={columnCourse} />
                </Card>
            </Content>
        </Layout>
    );
};

export default Analytics;
