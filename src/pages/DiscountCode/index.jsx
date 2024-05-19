import {
    Breadcrumb,
    Button,
    Input,
    Space,
    Table,
    Modal,
    Skeleton,
    Popconfirm,
    Flex,
    message,
    Select,
    Avatar,
    Switch,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import {
    useDeleteVoucherMutation,
    useGetAllVoucherQuery,
    useGetVoucherByIdQuery,
    useUpdateVoucherMutation,
} from '@/providers/apis/voucherApi';
import { Link } from 'react-router-dom';
import { useGetUserByIdQuery, useGetUsersQuery, useUpdateUserMutation } from '@/providers/apis/userApi';
import { Option } from 'antd/es/mentions';
import { useCookies } from 'react-cookie';

const DiscountCode = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [currentIdVoucher, setCurrentIdVoucher] = useState(null);
    const { data: allVouchers, isLoading, refetch } = useGetAllVoucherQuery();
    const [deleteVoucher] = useDeleteVoucherMutation();
    const [open, setOpen] = useState(false);
    const [cookies, setCookie] = useCookies(['access_token']);
    const [selectedUser, setSelectedUser] = useState({});
    const [resultSearch, setResultSearch] = useState([]);
    const [voucherStatus, setVoucherStatus] = useState({});

    const { data: allUsers } = useGetUsersQuery();
    const { data: currentUser } = useGetUserByIdQuery(selectedUser, { refetchOnMountOrArgChange: true });
    const { data: currentVoucher } = useGetVoucherByIdQuery(currentIdVoucher);
    const [updateUser] = useUpdateUserMutation();
    const [updateVoucher] = useUpdateVoucherMutation();

    useEffect(() => {
        if (allUsers?.data) {
            setResultSearch(allUsers.data);
        }
    }, [allUsers]);

    useEffect(() => {
        if (allVouchers?.vouchers && allVouchers?.vouchers.length > 0) {
            const initialStatus = allVouchers?.vouchers.reduce((acc, voucher) => {
                acc[voucher._id] = voucher.status === 'ACTIVE';
                return acc;
            }, {});
            setVoucherStatus(initialStatus);
        }
    }, [allVouchers?.vouchers]);

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

    const handleGift = (id) => {
        setOpen(true);
        setCurrentIdVoucher(id);
    };
    const handleFocus = () => {
        setResultSearch(allUsers.data);
    };

    const handleOk = async () => {
        let newObjectUser = { ...currentUser };
        let newObjectVoucher = { ...currentVoucher };
        const { vouchers, _id } = newObjectUser;
        const { quantity, _id: id } = newObjectVoucher;

        if (quantity <= 0) {
            return message.error('Mã giảm giá này đã hết. Xin thử cái khác!');
        }

        const newUserUpdate = {
            userId: _id,
            vouchers: [...vouchers, currentIdVoucher],
            accessToken: cookies.access_token,
        };

        const newVoucherUpdate = {
            voucherId: id,
            quantity: +quantity - 1,
        };

        if (newUserUpdate && newVoucherUpdate) {
            await updateUser(newUserUpdate);
            await updateVoucher(newVoucherUpdate);
            message.success('Tặng thành công mã nay!');
        }
        setOpen(false);
        refetch();
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const confirm = async (id) => {
        await deleteVoucher({ _id: id });
        message.success('Xóa voucher này thành công!');
        refetch();
    };

    const cancel = (e) => {
        message.error('Clicked on No');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const handleChangeState = async (checked, id) => {
        setVoucherStatus((prevState) => ({
            ...prevState,
            [id]: checked,
        }));
        const newState = {
            voucherId: id,
            status: checked ? 'ACTIVE' : 'UNKNOWN',
        };
        if (newState) {
            await updateVoucher(newState);
        }
        refetch();
    };

    const discountCodeColumns = [
        {
            title: 'STT',
            key: 'id',
            align: 'center',
            width: 2,
            render: (data, _, index) => {
                return <p>{index + 1}</p>;
            },
        },
        {
            title: 'Mã giảm giá',
            dataIndex: 'codeName',
            key: 'codeName',
            align: 'center',
            width: 20,
            ...getColumnSearchProps('codeName'),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            width: 5,
        },
        {
            title: 'Giảm giá (%)',
            dataIndex: 'discountAmount',
            key: 'discountAmount',
            align: 'center',
            width: 5,
        },
        {
            title: 'Giảm tối đa (Vnd)',
            dataIndex: 'maxDiscountAmount',
            key: 'maxDiscountAmount',
            align: 'center',
            width: 5,
            render: (value) => formatCurrency(value),
        },
        // {
        //     title: 'Ngày hiệu lực',
        //     dataIndex: 'startDate',
        //     key: 'startDate',
        //     align: 'center',
        //     render: (data) => {
        //         let date = new Date(data).toLocaleDateString('vi-VN');
        //         return <p>{date}</p>;
        //     },
        // },
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
            render: (status, record) => {
                const isActive = (voucherStatus && voucherStatus[record._id]) || false;
                return (
                    <Switch
                        className="bg-red-600"
                        checked={isActive}
                        onChange={(checked) => handleChangeState(checked, record._id)}
                        checkedChildren="Active"
                        unCheckedChildren="Stop"
                    />
                );
            },
        },
        {
            title: 'Điều kiện áp dụng',
            dataIndex: 'conditionAmount',
            key: 'conditionAmount',
            align: 'center',
            render: (conditionAmount = '0') => {
                return <p>{formatCurrency(conditionAmount) || 0}</p>;
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (data) => {
                const isDisabled = !voucherStatus[data._id];
                return (
                    <div className="space-x-2">
                        <Space>
                            <Button type="primary" onClick={() => handleGift(data._id)} disabled={isDisabled}>
                                Tặng
                            </Button>
                        </Space>
                        <Popconfirm
                            placement="topLeft"
                            title="Bạn có chắc muốn xoá voucher này không?"
                            description="Are you sure to delete this voucher?"
                            onConfirm={() => confirm(data._id)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger disabled={isDisabled}>
                                Xoá
                            </Button>
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    const onChange = (value) => {
        setSelectedUser(value);
    };

    const onSearch = (value) => {
        if (value !== '' || value !== null) {
            const filteredUsers = allUsers.data.filter(
                (user) =>
                    user.full_name.toLowerCase().includes(value.toLowerCase()) ||
                    user.email.toLowerCase().includes(value.toLowerCase()),
            );
            setResultSearch(filteredUsers);
        } else {
            setResultSearch(allUsers?.data);
        }
    };
    return (
        <div className="w-full">
            <Breadcrumb
                className="mb-5"
                items={[
                    {
                        title: 'Trang chủ',
                        href: '/dashboard',
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
                <div className="absolute top-[150px] left-10">
                    <Flex gap="small" align="flex-start" vertical>
                        <Flex gap="small" wrap>
                            <Link to={'/manager-discount/gift-voucher'}>
                                <Button type="primary" size={'30'}>
                                    Voucher được tặng
                                </Button>
                            </Link>
                        </Flex>
                    </Flex>
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
                <div>
                    {allVouchers?.vouchers && allVouchers?.vouchers?.length >= 1 ? (
                        <div className="bg-white mt-[30px]  sm:pt-[100px] md:pt-[150px] pt-[80px] rounded w-full">
                            <div className="px-[30px] ">
                                {isLoading ? (
                                    <Skeleton />
                                ) : (
                                    <Table
                                        columns={discountCodeColumns}
                                        dataSource={allVouchers?.vouchers}
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
                </div>
                <>
                    <Modal
                        open={open}
                        title="Tặng voucher"
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={(_, { OkBtn, CancelBtn }) => (
                            <>
                                <CancelBtn />
                                <OkBtn />
                            </>
                        )}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn người nhận voucher"
                            className="flex h-[60px]"
                            onChange={onChange}
                            onSearch={onSearch}
                            onFocus={handleFocus}
                            filterOption={false}
                        >
                            {resultSearch.map((user) => (
                                <Select.Option key={user._id} value={user._id} onClick={() => setSelectedUser(user)}>
                                    {resultSearch.map((user) => (
                                        <Option>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar
                                                    src={`https://picsum.photos/seed/${user._id}/40/40`}
                                                    alt={user.full_name}
                                                    className="h-10 w-10 object-fit"
                                                />
                                                <div className="">
                                                    <p style={{ marginLeft: 8 }}>{user.full_name}</p>
                                                    <span style={{ marginLeft: 8, fontSize: '10px' }}>
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </Option>
                                    ))}
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                            src={`https://picsum.photos/seed/${user?._id}/40/40`}
                                            alt={user?.full_name}
                                            className="h-10 w-10 object-fit"
                                        />
                                        <div className="">
                                            <p style={{ marginLeft: 8, fontSize: '16px', paddingTop: 5 }}>
                                                {user.full_name}
                                            </p>
                                            <span style={{ marginLeft: 8, fontSize: '10px' }}>{user.email}</span>
                                        </div>
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>
                    </Modal>
                </>
                <div className="absolute bottom-5 right-[200px]">
                    <Space>
                        <Button>
                            <h4 className="text-small text-blue-600">
                                Tổng có {allVouchers?.vouchers.length}{' '}
                                {allVouchers?.vouchers.length > 1 ? 'vouchers' : 'voucher'}
                            </h4>
                        </Button>
                    </Space>
                </div>
            </div>
        </div>
    );
};
export default DiscountCode;
