/* eslint-disable react/prop-types */
import { Button, Modal, message } from 'antd';
import React from 'react';

import { useDeleteCourseMutation } from '@/providers/apis/courseApi';

import { formatMoneyInt } from '@/lib/utils';

const ModalDeleteCourse = ({ course }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const [deleteCourse] = useDeleteCourseMutation();

    const handleDeleteCourse = async () => {
        await deleteCourse({ _id: course?._id });
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
                Nháp
            </Button>
            <Modal
                title={<span className="text-red-600 font-bold">Xác nhận xóa khóa học</span>}
                centered
                open={isModalOpen}
                footer={false}
                onCancel={handleCancel}
            >
                <div className="flex gap-6 pt-6 pb-12">
                    <div>
                        <img className="w-48 rounded-md" src={course.thumb} />
                    </div>
                    <div>
                        <div className="font-medium">
                            Tên khóa học:
                            <h3 className="font-bold">{course.name}</h3>
                        </div>
                        <div className="font-medium">
                            Chủ đề:
                            <h3 className="font-bold">{course.cate_id.name}</h3>
                        </div>
                        <div className="font-medium my-2">
                            Tổng bài học:
                            <span className="font-semibold text-amber-600"> {course.chapters.length} bài học</span>
                        </div>
                        <div className="font-medium">
                            Giá khóa học:
                            <span className="font-semibold text-green-600">
                                {' '}
                                {course.price === 0 ? 'Miễn phí' : formatMoneyInt(course.price) + 'đ'}
                            </span>
                        </div>
                    </div>
                </div>

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
