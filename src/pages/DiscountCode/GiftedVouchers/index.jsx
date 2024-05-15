import React, { useState, useEffect } from 'react';
import { Table, Avatar, Button, Space, message } from 'antd';
import { useGetUsersQuery } from '@/providers/apis/userApi';
import { useGetAllVoucherQuery } from '@/providers/apis/voucherApi';
import { Link, useNavigate } from 'react-router-dom';

const GiftedVouchers = () => {
    const { data: allVouchers, isLoading: vouchersLoading, refetch: refetchVouchers } = useGetAllVoucherQuery();
    const { data: allUsers, isLoading: usersLoading } = useGetUsersQuery();
    const nav = useNavigate();

    const getRecipients = (voucherId) => {
        return allUsers?.data.find((user) => user.vouchers.includes(voucherId)) || [];
    };

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
    ];

    return (
        <div className="w-full">
            <div className="relative flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md">
                <button
                    className="absolute top-1 left-1 bg-red-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => nav(-1)}
                >
                    <Link to="/manager-discount"></Link>
                    Trở lại
                </button>
                <Table
                    columns={voucherColumns}
                    dataSource={allVouchers?.vouchers}
                    rowKey={(record) => record._id}
                    loading={vouchersLoading}
                    expandable={{
                        expandedRowRender: (record) => (
                            <Table
                                columns={userColumns}
                                dataSource={allUsers?.data}
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
