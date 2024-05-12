import { Breadcrumb, Button, Input, Space, Table, Skeleton, Popconfirm, Flex, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import GiftRecipientSelect from '@/pages/DiscountCode/ReceiverCode';
import { useDeleteVoucherMutation, useGetAllVoucherQuery } from '@/providers/apis/voucherApi';
import { useGetUsersQuery } from '@/providers/apis/userApi';
import { Link } from 'react-router-dom';

const DiscountCode = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [currentIdVoucer, setCurrentIdVoucher] = useState(null);
    const { data: allVouchers, isLoading, refetch } = useGetAllVoucherQuery();
    const [deleteVoucher] = useDeleteVoucherMutation();

    useEffect(() => {
        refetch();
    }, [refetch]);

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
    function handleGift(id) {
        setIsOpen(true);
        setCurrentIdVoucher(id);
    }

    function handleClose() {
        setIsOpen(false);
        refetch();
    }

    const confirm = async (id) => {
        await deleteVoucher({ _id: id });
        message.success('Xóa voucher này thành công!');
        refetch();
    };
    const cancel = (e) => {
        message.error('Clicked on No');
    };
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
            width: 10,
        },
        {
            title: 'Giảm giá tối đa',
            dataIndex: 'maxDiscountAmount',
            key: 'maxDiscountAmount',
            align: 'center',
            width: 10,
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
                        <div className="">
                            <Button type="primary" className="mr-2" onClick={() => handleGift(data._id)}>
                                Tặng
                            </Button>
                            <Popconfirm
                                placement="topLeft"
                                title="Bạn có chắc muôn xoá voucher này không?"
                                description="Are you sure to delete this voucher?"
                                onConfirm={() => confirm(data._id)}
                                onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button danger>Delete</Button>
                            </Popconfirm>
                        </div>
                    ),
                };
            },
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
                        title: 'Mã giảm giá',
                    },
                ]}
            />

            <div className="relative p-[5px] mt-[100px] ">
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
                <div className="absolute top-[150px] right-10">
                    <Flex gap="small" align="flex-start" vertical>
                        <Flex gap="small" wrap>
                            <Link to={'/manager-discount/add'}>
                                <Button type="primary" size={'30'}>
                                    Thêm mới
                                </Button>
                            </Link>
                        </Flex>
                    </Flex>
                </div>
                {allVouchers?.vouchers && allVouchers?.vouchers?.length >= 1 ? (
                    <div className="bg-white mt-[30px]  sm:pt-[100px] md:pt-[150px] pt-[80px] rounded w-full">
                        <div className="px-[30px] ">
                            {isLoading ? (
                                <Skeleton />
                            ) : (
                                <Table
                                    columns={discountCodeColumns}
                                    dataSource={allVouchers.vouchers}
                                    loading={isLoading}
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white mt-[30px]  sm:pt-[100px] md:pt-[150px] pt-[80px] rounded w-full">
                        <div className="px-[30px] flex justify-center items-center">
                            Hiện tại chưa có voucher nào !!!
                        </div>
                    </div>
                )}
                {isOpen && (
                    <GiftRecipientSelect
                        voucherId={currentIdVoucer}
                        changeOpen={handleGift}
                        changeClose={handleClose}
                    />
                )}
            </div>
        </div>
    );
};
export default DiscountCode;
