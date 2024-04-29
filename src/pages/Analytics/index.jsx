/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Layout, Table, Card, Input, Space, Button, Breadcrumb, Form, DatePicker } from 'antd';
import dayjs from 'dayjs';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { useGetUsersQuery } from '@/providers/apis/userApi';
import { useGetCoursesQuery } from '@/providers/apis/courseApi';
import { useGetBillsQuery } from '@/providers/apis/billApi';
import { formatMoneyInt } from '@/lib/utils';
import { TIMEFRAMES } from '@/lib/utils';
import { Overview } from './components';
import { useGetSttCourseQuery } from '@/providers/apis/sttCourseApi';

const { Content } = Layout;
const { RangePicker } = DatePicker;

const rangeFitler = (items, { fromDate, toDate }) => {
    return items.filter((item) => dayjs(item.createdAt).isBetween(fromDate, toDate));
};

const Analytics = () => {
    const [timeStamp, setTimeStamp] = useState(TIMEFRAMES.thisMonth);
    const { data: billResponse, isLoading } = useGetBillsQuery(timeStamp, { skip: !timeStamp });
    const { data: userResponse } = useGetUsersQuery();
    const { data: courseResponse } = useGetCoursesQuery();
    const { data: statusCourseData } = useGetSttCourseQuery(timeStamp, { skip: !timeStamp });

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [billData, setStatCourseData] = useState([]);

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

    //! BAD CODE but will work
    useEffect(() => {
        if (billResponse?.data) {
            const data = billResponse.data.map((bill) => {
                // eslint-disable-next-line no-unused-vars
                const { course_info, user_info, category_info, ...rest } = bill;

                return { course_info, user_info, ...rest };
            });

            const groupedData = data.reduce((a, b) => {
                const i = a.findIndex((x) => x._id === b.course_info._id);
                return (
                    i === -1
                        ? a.push({
                              _id: b.course_info._id,
                              subscribers: 1,
                              price: b.course_info.price,
                              name: b.course_info.name,
                          })
                        : a[i].subscribers++,
                    a
                );
            }, []);

            setStatCourseData(groupedData);
        }
    }, [billResponse]);

    // handle time range filter
    useEffect(() => {
        if (userResponse?.data) {
            const original = userResponse.data.filter((u) => !u.isAdmin);
            const filtered = rangeFitler(original, timeStamp);

            setUserData({ original, filtered });
        }
    }, [timeStamp, userResponse]);

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
                <Overview
                    userData={userData}
                    statusCourseData={statusCourseData}
                    billData={billData}
                    courseData={courseResponse}
                />
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
                    <Table loading={isLoading} dataSource={billData} columns={columnCourse} />
                </Card>
            </Content>
        </Layout>
    );
};

export default Analytics;
