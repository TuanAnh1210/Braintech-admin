import React, { useRef, useState } from 'react';
import { Layout, Table, Card, Row, Col, Input, Space, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Highlighter from 'react-highlight-words';

const { Content } = Layout;

const data = [
    {
        id: 1,
        name: 'HTML, CSS Pro',
        price: 120,
        subcribers: 200,
        image: 'https://picsum.photos/64/64',
    },
    {
        id: 2,
        name: 'React Native',
        price: 200,
        subcribers: 100,
        image: 'https://picsum.photos/64/64',
    },
    {
        id: 3,
        name: 'Vue 3 Js',
        price: 210,
        subcribers: 70,
        image: 'https://picsum.photos/64/64',
    },
];

const Analytics = () => {
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [courseData, setCourseData] = useState(data);
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

    // handle sort
    const handleSorted = (sortOrder, columnKey) => {
        const sortedData = [...courseData].sort((a, b) => {
            if (sortOrder === 'ascend') {
                return a[columnKey] - b[columnKey];
            } else {
                return b[columnKey] - a[columnKey];
            }
        });

        setSortedInfo({ columnKey, order: sortOrder });
        setCourseData(sortedData);
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
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button type="link" size="small" onClick={() => close()}>
                        close
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
        { title: 'ID', dataIndex: 'id', key: 'id', width: '10%' },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Price',
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
        },
        {
            title: 'Subcribers',
            dataIndex: 'subcribers',
            key: 'subcribers',
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'subcribers' && sortedInfo.order,
            onHeaderCell: () => ({
                onClick: () => {
                    handleSorted(sortedInfo.order === 'ascend' ? 'descend' : 'ascend', 'subcribers');
                },
            }),
        },
    ];

    const overAll = {
        totalRevenue: () => {
            return courseData.reduce((total, course) => total + course.subcribers * course.price, 0);
        },
        totalCourses: courseData.length,
        totalStudents: () => {
            return courseData.reduce((total, course) => total + course.subcribers, 0);
        },
    };
    return (
        <Layout>
            <Content>
                <Row gutter={[16, 16]} className="mb-6">
                    <Col span={8}>
                        <div style={{ background: '#fff', padding: 24, textAlign: 'center' }}>
                            <h3 className="text-2xl text-teal-600">Total Revenue</h3>
                            <p className="text-base font-bold">$ {overAll.totalRevenue()}</p>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ background: '#fff', padding: 24, textAlign: 'center' }}>
                            <h3 className="text-2xl text-orange-600">Total Courses</h3>
                            <p className="text-base font-bold">{overAll.totalCourses}</p>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ background: '#fff', padding: 24, textAlign: 'center' }}>
                            <h3 className="text-2xl text-sky-600">Total Students</h3>
                            <p className="text-base font-bold">{overAll.totalStudents()}</p>
                        </div>
                    </Col>
                </Row>
                <Card title="Course Statistics">
                    <Table loading={loading} dataSource={courseData} columns={columnCourse} />
                </Card>
            </Content>
        </Layout>
    );
};

export default Analytics;
