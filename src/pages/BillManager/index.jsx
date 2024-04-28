import { Breadcrumb, Button, Input, Space, Table } from 'antd';
import { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useGetBillsQuery } from '@/providers/apis/billApi';
import { formatMoneyInt } from '@/lib/utils';

const BillManager = () => {
    const { data: paymentData, isLoading } = useGetBillsQuery();
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
            title: 'Mã hóa đơn',
            dataIndex: 'transaction_id',
            key: 'id',
            width: '10%',
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
            title: 'Người mua',
            dataIndex: 'username',
            key: 'username',
            width: '10%',
            ...getColumnSearchProps('username'),
        },

        {
            title: 'Đơn giá',
            dataIndex: 'amount',
            key: 'amount',
            width: '10%',
            ...getColumnSearchProps('amount'),
            render: (price) => formatMoneyInt(price) + 'đ',
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            ...getColumnSearchProps('status'),
            render: (status) => {
                const statusEnum = {
                    SUCCESS: { color: 'PaleGreen', msg: 'Đã thanh toán' },
                    PENDING: { color: 'green', msg: 'Đang xử lý' },
                };

                const { color, msg } = statusEnum[status];

                return {
                    props: {
                        style: { background: color },
                    },
                    children: <p className="font-semibold">{msg}</p>,
                };
            },
        },
        {
            title: 'Chi tiết',
            dataIndex: 'transaction_id',
            width: '5%',
            key: `detail`,
            render: (id) => (
                <Button type="primary" href={`/manager-bills/${id}`} size="middle">
                    Xem chi tiết
                </Button>
            ),
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
                        title: 'Hoá đơn',
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
                    </div>
                </div>
                <div className="bg-white mt-[30px]  sm:pt-[100px] md:pt-[150px] pt-[80px] rounded w-full">
                    <div className="px-[30px] ">
                        <Table columns={columns} dataSource={paymentData?.data} loading={isLoading} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default BillManager;
