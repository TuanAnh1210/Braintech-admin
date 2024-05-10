import { useCreateVoucherMutation } from '@/providers/apis/voucherApi';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            nav('/manager-discount');
        }
        refetch();
    };
    return (
        <div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-black opacity-30 z-[-1]"></div>
                <div className="w-full  p-4 bg-white rounded-lg shadow-md">
                    <div className="flex flex-col items-center justify-center bg-gray-100">
                        <form
                            className="bg-white shadow-md rounded w-[50%] px-8 pt-6 pb-8 mb-4"
                            onSubmit={handleSubmit}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" for="codeName">
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
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" for="quantity">
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
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" for="discountAmount">
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
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" for="maxDiscountAmount">
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
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" for="startDate">
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
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" for="endDate">
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
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" for="status">
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
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Tạo Mới
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateDiscountCode;
