import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GiftRecipientSelect = ({ users, changeOpen, changeClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleCancel = () => setIsOpen(!isOpen);

    const handleConfirm = () => {
        console.log(selectedUser);
        changeClose();
    };

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-black opacity-30 z-[-1]"></div>
                <div className="w-full max-w-xs p-4 bg-white rounded-lg shadow-md">
                    <select
                        className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded"
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">Chọn người nhận</option>
                        {users.map((user) => (
                            <option value={user.id}>{user.full_name}</option>
                        ))}
                    </select>
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
