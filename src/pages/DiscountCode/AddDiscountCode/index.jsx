import { useCreateVoucherMutation } from '@/providers/apis/voucherApi';
import { DatePicker, Form, Input, InputNumber, Select, message, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;

const CreateDiscountCode = () => {
    const [form] = Form.useForm();
    const [createVoucher] = useCreateVoucherMutation();
    const nav = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (value) => {
        if (!value) return;

        try {
            const res = await createVoucher(value);
            if (res?.error?.status === 400) {
                throw new Error(res.error.data.msg);
            }
            message.success(res.data.message);
            nav('/manager-discount');
        } catch (error) {
            message.error(error.message || 'Đã có lỗi xảy ra');
        }
    };

    const disabledDate = (current) => {
        return current && current < moment().endOf('day');
    };

    const checkEndDate = (rule, value) => {
        const startDate = form.getFieldValue('startDate');
        if (startDate && value && moment(value.$d).isSameOrBefore(moment(startDate.$d), 'day')) {
            return Promise.reject(new Error('Ngày kết thúc phải là sau ngày bắt đầu'));
        }
        return Promise.resolve();
    };

    return (
        <div className="w-full">
            <div className="relative flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-black shadow-sm">Thêm Mã giảm giá</h3>
                <button
                    className="flex items-center absolute top-1 left-10 bg-red-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline float-left"
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
                <div className="w-full flex flex-col items-center justify-center bg-gray-100 pt-2">
                    <Form
                        form={form}
                        className="bg-white shadow-md rounded w-[50%] px-8 pt-6 pb-8 mb-2"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label="Tên Mã Giảm Giá"
                            name="codeName"
                            rules={[{ required: true, message: 'Vui lòng nhập tên mã giảm giá' }]}
                            className="mb-2"
                        >
                            <Input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </Form.Item>
                        <Form.Item
                            label="Số Lượng"
                            name="quantity"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                            className="mb-2"
                        >
                            <InputNumber
                                min={1}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Giá Trị Giảm Giá (%)"
                            name="discountAmount"
                            rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm giá' }]}
                            className="mb-2"
                        >
                            <InputNumber
                                min={1}
                                max={100}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Giá Trị Giảm Tối Đa"
                            name="maxDiscountAmount"
                            rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm tối đa' }]}
                            className="mb-2"
                        >
                            <InputNumber
                                min={1}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Ngày Bắt Đầu"
                            name="startDate"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                            className="mb-2"
                        >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabledDate={disabledDate} />
                        </Form.Item>
                        <Form.Item
                            label="Ngày Kết Thúc"
                            name="endDate"
                            rules={[
                                { required: true, message: 'Vui lòng chọn ngày kết thúc' },
                                { validator: checkEndDate },
                            ]}
                            className="mb-2"
                        >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabledDate={disabledDate} />
                        </Form.Item>
                        <Form.Item
                            label="Trạng Thái"
                            name="status"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                            className="mb-2"
                        >
                            <Select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <Option value="ACTIVE">Kích hoạt</Option>
                                <Option value="INACTIVE">Vô hiệu hóa</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Mức Áp Dụng (VNĐ)"
                            name="conditionAmount"
                            rules={[{ required: true, message: 'Vui lòng chọn mức áp dụng' }]}
                            className="mb-2"
                        >
                            <Select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <Option value="100000">100,000 VNĐ</Option>
                                <Option value="200000">200,000 VNĐ</Option>
                                <Option value="500000">500,000 VNĐ</Option>
                                <Option value="1000000">1,000,000 VNĐ</Option>
                                <Option value="2000000">2,000,000 VNĐ</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item className="flex items-center justify-center">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                            >
                                Tạo Mới
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default CreateDiscountCode;
