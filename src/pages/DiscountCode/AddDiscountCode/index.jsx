import { useCreateVoucherMutation } from '@/providers/apis/voucherApi';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CreateDiscountCode = () => {
    const [newCode, setNewCode] = useState({
        codeName: '',
        quantity: 0,
        discountAmount: 0,
        maxDiscountAmount: 0,
        startDate: '',
        endDate: '',
        status: '',
    });

    const [createVoucher, refetch] = useCreateVoucherMutation();
    const nav = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        setNewCode({ ...newCode, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setNewCode({
            codeName: '',
            quantity: 0,
            discountAmount: 0,
            maxDiscountAmount: 0,
            startDate: '',
            endDate: '',
            status: '',
        });
        if (newCode) {
            await createVoucher(newCode);
            message.success('Tạo mới voucher thành công !!');
            nav('/manager-discount');
        }
        refetch();
    };

    return (
        <div className="w-full">
            <div className="relative flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-black shadow-sm">Thêm Mã giảm giá</h3>
                <button
                    className="absolute top-1 left-10 bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline float-left"
                    onClick={() => nav(-1)}
                >
                    <Link to="/manager-discount"></Link>
                    Trở lại
                </button>
                <div className="w-full flex flex-col items-center justify-center bg-gray-100 pt-2">
                    <form className="bg-white shadow-md rounded w-[50%] px-8 pt-6 pb-8 mb-2" onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="block text-gray-700 text-sm font-bold" for="codeName">
                                Tên Mã Giảm Giá
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="codeName"
                                type="text"
                                value={newCode.codeName}
                                name="codeName"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700 text-sm font-bold" for="quantity">
                                Số Lượng
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="quantity"
                                type="number"
                                value={newCode.quantity}
                                name="quantity"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700 text-sm font-bold" for="discountAmount">
                                Giá Trị Giảm Giá (%)
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="discountAmount"
                                type="number"
                                value={newCode.discountAmount}
                                name="discountAmount"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700 text-sm font-bold" for="maxDiscountAmount">
                                Giá Trị Giảm Tối Đa
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="maxDiscountAmount"
                                type="number"
                                value={newCode.maxDiscountAmount}
                                name="maxDiscountAmount"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700 text-sm font-bold" for="startDate">
                                Ngày Bắt Đầu
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="startDate"
                                type="date"
                                value={newCode.startDate}
                                name="startDate"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700 text-sm font-bold" for="endDate">
                                Ngày Kết Thúc
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="endDate"
                                type="date"
                                value={newCode.endDate}
                                name="endDate"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-bold" for="status">
                                Trạng Thái
                            </label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="status"
                                name="status"
                                value={newCode.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Chọn một trạng thái</option>
                                <option value="ACTIVE">Kích hoạt</option>
                                <option value="UNKNOWN">Vô hiệu hóa</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Tạo Mới
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateDiscountCode;
