import { useGetContentRatingQuery } from '@/providers/apis/rateApi';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Breadcrumb, Button, Input, Space, Table } from 'antd';
import { useRef, useState } from 'react';
import { render } from 'react-dom';
import Highlighter from 'react-highlight-words';
import { FaStar } from 'react-icons/fa6';

function RateManager() {
    const { data: dataRating } = useGetContentRatingQuery();
    const rates = dataRating?.rates;
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [dataRate, setData] = useState('');
    const searchInput = useRef(null);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 6,
        },
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
                    spellCheck={false}
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
                        icon={''} // <SearchOutlined />
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

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            render: (id, record, index) => {
                ++index;
                return index;
            },
            showSorterTooltip: false,
        },
        {
            title: 'Họ tên',
            dataIndex: ['user_id', 'full_name'],
            sorter: true,
            ...getColumnSearchProps('user_id'),
        },
        {
            title: 'Khóa học',
            dataIndex: ['course_id', 'name'],
            ...getColumnSearchProps('course_id'),
        },

        {
            title: 'Nội dung',
            dataIndex: 'content',
            ...getColumnSearchProps('content'),
        },
        {
            title: 'Báo cáo',
            dataIndex: 'isReported',
            ...getColumnSearchProps('isReported'),
            render: (isReported) => (isReported ? <Button danger>Có</Button> : <Button disabled>Không</Button>),
        },
        {
            title: 'Điểm', 
            dataIndex: 'rating',
            defaultSortOrder: 'descend',

            sorter: (a, b) => a.rating - b.rating,

            ...getColumnSearchProps('rating'),

            render: (rating) => (
                <>
                    <div className="flex">
                        {[...Array(rating)].map((_, index) => (
                            <FaStar size={20} color={'#ffc107'} key={index} />
                        ))}
                    </div>
                </>
            ),
        },
    ];
    return (
        <>
            <div className="w-full">
                <Breadcrumb
                    className="mb-5"
                    items={[
                        {
                            title: 'Trang chủ',
                        },

                        {
                            title: 'Quản lý đánh giá',
                        },
                    ]}
                />
                <div className="overflow-x-auto min-w-[20px]">
                    <Table
                        style={{ overflowX: 'auto' }}
                        className="bg-white p-3 rounded"
                        columns={columns}
                        dataSource={rates}
                        title={() => {
                            return <p style={{ fontWeight: 600, fontSize: '20px' }}>Đánh giá của các khóa học</p>;
                        }}
                        onChange={onChange}
                    />
                </div>
            </div>
        </>
    );
}

export default RateManager;
