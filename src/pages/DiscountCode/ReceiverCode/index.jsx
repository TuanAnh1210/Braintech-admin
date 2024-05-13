import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useGetVoucherByIdQuery, useUpdateVoucherMutation } from '@/providers/apis/voucherApi';
import { message } from 'antd';
import { useGetUserByIdQuery, useGetUsersQuery, useUpdateUserMutation } from '@/providers/apis/userApi';

const GiftRecipientSelect = ({ voucherId, changeClose }) => {
    const [updateSucces, setUpdateSucces] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    const { data: currentUser, refetch } = useGetUserByIdQuery(selectedUser._id, { refetchOnMountOrArgChange: true });
    const { data: currentVoucher } = useGetVoucherByIdQuery(voucherId);
    const [cookies, setCookie] = useCookies(['access_token']);
    const [updateUser] = useUpdateUserMutation();
    const [updateVoucher] = useUpdateVoucherMutation();
    const [resultSearch, setResultSearch] = useState([]);
    const { data: allUsers } = useGetUsersQuery();

    useEffect(() => {
        refetch();
        setUpdateSucces(false);
    }, [updateSucces, refetch]);

    const handleConfirm = async () => {
        let newObjectUser = { ...currentUser };
        let newObjectVoucher = { ...currentVoucher };
        const { vouchers, _id } = newObjectUser;
        const { quantity, _id: id } = newObjectVoucher;

        if (quantity <= 0) {
            return message.error('Mã giảm giá này đã hết. Xin thử cái khác!');
        }

        const newUserUpdate = {
            userId: _id,
            vouchers: [...vouchers, voucherId],
            accessToken: cookies.access_token,
        };

        const newVoucherUpdate = {
            voucherId: id,
            quantity: +quantity - 1,
        };

        if (newUserUpdate && newVoucherUpdate) {
            await updateUser({ ...newUserUpdate });
            setUpdateSucces(true);
            await updateVoucher({ ...newVoucherUpdate });
            setUpdateSucces(false); // reset trạng thái sau khi cập nhật
        }
        message.success('Tặng thành công mã nay!');
        changeClose();
    };

    const handleCancel = () => changeClose();

    const handleSearch = (value) => {
        const results = allUsers?.data.filter((user) => {
            return (
                user.full_name.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
                user.email.toLowerCase().indexOf(value.toLowerCase()) > -1
            );
        });
        setResultSearch(results);
    };

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-black opacity-30 z-[-1]"></div>
                <div className="w-full max-w-xs p-4 bg-white rounded-lg shadow-md">
                    <input
                        type="text"
                        className="p-2 outline-none border-2 rounded w-[300px]"
                        placeholder="Nhập tên người tặng..."
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {resultSearch.length > 0 && (
                        <p className="text-green-600 font-base my-2 font-bold">Có {resultSearch.length} kết quả</p>
                    )}

                    {resultSearch?.length > 0 ? (
                        <select className="w-full px-3 py-2 mt-2 text-gray-700 bg-gray-200 rounded">
                            <option value="">Chọn người nhận</option>
                            {resultSearch.map((user) => (
                                <option value={user} onClick={() => setSelectedUser(user)}>
                                    {user.full_name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <select className="w-full px-3 py-2 mt-2 text-gray-700 bg-gray-200 rounded">
                            <option value="">Chọn người nhận</option>
                            {allUsers?.data.map((user) => (
                                <option value={user._id} onClick={() => setSelectedUser(user)}>
                                    {user.full_name}
                                </option>
                            ))}
                        </select>
                    )}
                    <div className="flex items-center justify-between mt-4">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm text-red-500 bg-transparent rounded hover:bg-red-500 hover:text-white"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={() => handleConfirm()}
                            className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-700"
                        >
                            Xác nhận chọn
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GiftRecipientSelect;
