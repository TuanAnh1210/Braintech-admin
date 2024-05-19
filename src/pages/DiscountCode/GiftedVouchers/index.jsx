import React, { useEffect } from 'react';
import { Table, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useGetAllVoucherQuery } from '@/providers/apis/voucherApi';
import { useGetUsersQuery, useRemoveExpiredVouchersMutation } from '@/providers/apis/userApi';

const GiftedVouchers = () => {
    const { data: allVouchers, isLoading: vouchersLoading } = useGetAllVoucherQuery();
    const { data: allUsers, isLoading: usersLoading, refetch: refetchUsers } = useGetUsersQuery();
    const nav = useNavigate();
    const [updateUser] = useRemoveExpiredVouchersMutation();

    useEffect(() => {
        const checkExpiredVouchers = async () => {
            const currentDate = new Date();
            const usersToUpdate = [];

            allUsers?.data.forEach((user) => {
                const validVouchers = user.vouchers.filter((voucher) => {
                    const expiryDate = new Date(voucher.endDate);
                    return expiryDate >= currentDate;
                });

                if (validVouchers.length !== user.vouchers.length) {
                    usersToUpdate.push({ ...user, vouchers: validVouchers });
                }
            });

            for (const user of usersToUpdate) {
                await updateUser(user);
            }

            if (usersToUpdate.length > 0) {
                refetchUsers();
                message.info('Đã xóa voucher hết hạn khỏi danh sách người dùng.');
            }
        };

        if (allUsers && allUsers.data) {
            checkExpiredVouchers();
        }
    }, [allUsers, updateUser, refetchUsers]);

    const getRecipients = (voucherId) => {
        if (!allUsers || !allUsers.data) return [];
        return allUsers.data
            .filter((user) => user.vouchers.some((voucher) => voucher._id === voucherId))
            .map((user) => {
                const voucherCount = user.vouchers.filter((voucher) => voucher._id === voucherId).length;
                return { ...user, voucherCount };
            });
    };
    useEffect(() => {
        refetchUsers();
    }, [allUsers]);
    const voucherColumns = [
        {
            title: 'Mã giảm giá',
            dataIndex: 'codeName',
            key: 'codeName',
            align: 'center',
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
            render: (data) => new Date(data).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            align: 'center',
            render: (data) => new Date(data).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => {
                const statusEnum = {
                    ACTIVE: { color: 'PaleGreen', msg: 'Đang hoạt động' },
                    INACTIVE: { color: 'Tomato', msg: 'Không hoạt động' },
                };
                const { color, msg } = statusEnum[status] ?? { color: 'Tomato', msg: 'Unknown' };
                return <span style={{ color }}>{msg}</span>;
            },
        },
    ];

    const userColumns = [
        {
            title: 'Tên người nhận',
            dataIndex: 'full_name',
            key: 'full_name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={`https://picsum.photos/seed/${record._id}/40/40`} alt={record.full_name} />
                    <span style={{ marginLeft: 8 }}>{record.full_name}</span>
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số lượng voucher',
            dataIndex: 'voucherCount',
            key: 'voucherCount',
            align: 'center',
            render: (count) => <span>{count}</span>,
        },
    ];

    return (
        <div className="w-full p-4">
            <div className="flex flex-col items-start justify-center bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold mb-2">Quản Lý Voucher</h1>
                <div className="mb-8">
                    <button
                        className="flex items-center bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => nav(-1)}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                            />
                        </svg>
                        Trở lại
                    </button>
                </div>
                <Table
                    className="self-start"
                    columns={voucherColumns}
                    dataSource={allVouchers?.vouchers}
                    rowKey={(record) => record._id}
                    loading={vouchersLoading}
                    expandable={{
                        expandedRowRender: (record) => (
                            <Table
                                columns={userColumns}
                                dataSource={getRecipients(record._id)}
                                rowKey={(recipient) => recipient._id}
                                pagination={false}
                                loading={usersLoading}
                            />
                        ),
                    }}
                />
            </div>
        </div>
    );
};

export default GiftedVouchers;
