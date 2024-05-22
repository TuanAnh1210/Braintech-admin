/* eslint-disable react/prop-types */
import { Button, Modal, message } from 'antd';
import React from 'react';

import { useDeleteCourseMutation } from '@/providers/apis/courseTeacherApi';



const ModalDeleteCourse = ({ courseId }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const [deleteCourse] = useDeleteCourseMutation();

    const handleDeleteCourse = async () => {
        await deleteCourse({ _id: courseId });
        setIsModalOpen(false);
        message.success('Xóa khóa học thành công!');
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button onClick={showModal} danger>
                Xóa
            </Button>
            <Modal
                title={<span className="text-red-600 font-bold">Xác nhận xóa khóa học</span>}
                centered
                open={isModalOpen}
                footer={false}
                onCancel={handleCancel}
            >
                <div className="w-full flex items-center gap-3">
                    <Button onClick={handleCancel} className="w-full" type="dashed">
                        Quay lại
                    </Button>
                    <Button onClick={handleDeleteCourse} className="w-full" danger>
                        Xác nhận
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default ModalDeleteCourse;
