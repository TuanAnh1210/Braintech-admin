import { Breadcrumb, Button, Col, Input, Row, Space, Table } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useGetCoursesQuery } from '@/providers/apis/courseApi';
import { useGetBillsQuery } from '@/providers/apis/billApi';
import { useGetUsersQuery } from '@/providers/apis/userApi';

export const dataBill = [
    { id: 1, name: 'HTML CSS Pro', image: 'https://picsum.photos/100/50', quantity: 3 },
    { id: 2, name: 'JS Pro', image: 'https://picsum.photos/100/50', quantity: 2 },
    { id: 3, name: 'React Vue JS', image: 'https://picsum.photos/100/50', quantity: 1 },
];

const BillManager = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

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
            textAlign: 'center',
        },
        {
            title: 'Khoá học',
            dataIndex: 'name',
            key: 'name',
            width: '35%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            width: '30%',
            render: (_, item) => (
                <Space>
                    <img src={item.image} alt="" className="object-contain w-[250px] h-[100px]" />
                </Space>
            ),
        },

        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '20%',
            ...getColumnSearchProps('quantity'),
        },

        {
            title: 'Chi tiết',
            dataIndex: 'detail',
            key: `detail`,
            render: (_, id) => (
                <Space size="middle">
                    <a href={`/manager-bills/${id.id}`}>
                        <button className="px-3 py-2 bg-green-600 text-white rounded">Xem</button>
                    </a>
                </Space>
            ),
            width: '15%',
        },
    ];

    return (
        <div className="w-full">
            <Breadcrumb
                className="mb-5"
                items={[
                    {
                        title: 'Trang chủ',
                    },
                    {
                        title: 'Bill Manager',
                    },
                ]}
            />
            <div className=" relative p-[5px] mt-[100px] ">
                <div className="static">
                    <div className="bg-gray-600 flex justify-between absolute top-0 left-0  w-[95%] sm:h-32 md:h-32 h-[105px] ml-[30px] p-[15px] rounded ">
                        <div className="">
                            <h4 className="text-white xl:text-[25px] lg:text-[25px] sm:text-[18px] md:text-[18px] mt-[10px] mb-[5px]">
                                Hoá đơn
                            </h4>
                            <p className="text-white pb-[20px] mr-[20px] sm:text-[15px] md:text-[15px] text-[18px]">
                                Danh sách đơn hàng
                            </p>
                        </div>
                        <button className="rounded text-white px-3 bg-green-600">Biểu đồ</button>
                    </div>
                </div>
                <div className="bg-white mt-[30px]  sm:pt-[100px] md:pt-[150px] pt-[80px] rounded w-full">
                    <div className="px-[30px] ">
                        <Table columns={columns} dataSource={dataBill} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default BillManager;
