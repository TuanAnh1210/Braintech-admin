import { Breadcrumb, Button, Input, Space, Table, Form, DatePicker, Card } from 'antd';
import { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useGetBillsQuery } from '@/providers/apis/billApi';
import { TIMEFRAMES } from '@/lib/utils';
import moment from 'moment';
import GiftRecipientSelect from '@/pages/DiscountCode/ReceiverCode';

const DiscountCode = () => {
    const [timeStamp, setTimeStamp] = useState(TIMEFRAMES.thisMonth);
    const { data: paymentData, isLoading } = useGetBillsQuery(timeStamp, { skip: !timeStamp });
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

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

    const users = [
        {
            id: 1,
            username: 'Trung',
            age: 10,
        },
        {
            id: 2,
            username: 'Trung 1',
            age: 10,
        },
    ];
    let discountCodes = [
        {
            codeName: 'SUMMER2024',
            quantity: 100,
            discountAmount: 10,
            maxDiscountAmount: 5,
            startDate: '2020-05-01',
            endDate: '2025-05-01',
            status: 'ACTIVE',
        },
        {
            codeName: 'SUMMER2025',
            quantity: 100,
            discountAmount: 10,
            maxDiscountAmount: 5,
            startDate: '2020-05-01',
            endDate: '2025-05-01',
            status: 'ACTIVE',
        },
    ];
    const discountCodeColumns = [
        {
            title: 'Mã giảm giá',
            dataIndex: 'codeName',
            key: 'codeName',
            align: 'center',
            ...getColumnSearchProps('codeName'),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
        },
        {
            title: 'Số lượng giảm giá',
            dataIndex: 'discountAmount',
            key: 'discountAmount',
            align: 'center',
        },
        {
            title: 'Giảm giá tối đa',
            dataIndex: 'maxDiscountAmount',
            key: 'maxDiscountAmount',
            align: 'center',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            align: 'center',
            render: (data) => {
                let date = new Date(data).toLocaleDateString('vi-VN');
                return <p>{date}</p>;
            },
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            align: 'center',
            render: (data) => {
                let date = new Date(data).toLocaleDateString('vi-VN');
                return <p>{date}</p>;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            ...getColumnSearchProps('status'),
            render: (status) => {
                const statusEnum = {
                    ACTIVE: { color: 'PaleGreen', msg: 'Đang hoạt động' },
                    INACTIVE: { color: 'Tomato', msg: 'Không hoạt động' },
                };
                const { color, msg } = statusEnum[status] ?? { color: 'Tomato', msg: 'Unknown' };
                return {
                    props: {
                        style: { background: color },
                    },
                    children: <p className="font-semibold">{msg}</p>,
                };
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (data) => {
                return {
                    children: (
                        <button
                            className="text-blue-500 border-blue-500 border-2 bg-white rounded px-2 py-1 hover:bg-blue-500 hover:text-white"
                            onClick={() => handleGift()}
                        >
                            Tặng
                        </button>
                    ),
                };
            },
        },
    ];

    function handleGift() {
        setIsOpen(true);
    }

    function handleClose() {
        setIsOpen(false);
    }

    function generateDiscountCode(newCode) {
        discountCodes.push(newCode);
    }

    let newCode = {
        codeName: 'NEW_CODE',
        quantity: 50,
        discountAmount: 5,
        maxDiscountAmount: 2,
        startDate: '2024-05-01',
        endDate: '2026-05-01',
        status: 'active',
    };

    generateDiscountCode(newCode);

    return (
        <div className="w-full">
            <Breadcrumb
                className="mb-5"
                items={[
                    {
                        title: 'Trang chủ',
                    },
                    {
                        title: 'Mã giảm giá',
                    },
                ]}
            />
            <div className=" relative p-[5px] mt-[100px] ">
                <div className="static">
                    <div className="bg-gray-600 flex justify-between absolute top-0 left-0  w-[95%] sm:h-32 md:h-32 h-[105px] ml-[30px] p-[15px] rounded ">
                        <div className="text-white ">
                            <h4 className="xl:text-[25px] lg:text-[25px] sm:text-[18px] md:text-[18px] mt-[10px] mb-[5px]">
                                Mã giảm giá
                            </h4>
                            <p>Discount Code</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white mt-[30px]  sm:pt-[100px] md:pt-[150px] pt-[80px] rounded w-full">
                    <div className="px-[30px] ">
                        <Table columns={discountCodeColumns} dataSource={discountCodes} loading={isLoading} />
                    </div>
                </div>
                {isOpen && <GiftRecipientSelect users={users} changeOpen={handleGift} changeClose={handleClose} />}
            </div>
        </div>
    );
};
export default DiscountCode;
