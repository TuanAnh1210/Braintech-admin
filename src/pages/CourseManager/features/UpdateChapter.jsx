/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { EditOutlined } from '@ant-design/icons';
import { Form, Input, Modal, Space, Flex, message, Checkbox, Alert } from 'antd';
import { useParams } from 'react-router-dom';
import React from 'react';

import { useUpdateChapterMutation } from '@/providers/apis/chapterApi';

const UpdateChapter = ({ chapter, refetch }) => {
    const [isOpenModal, setIsOpenModal] = React.useState(false);

    const [updateChapter, { isLoading }] = useUpdateChapterMutation();

    const { courseId } = useParams();

    const [form] = Form.useForm();

    const handleShow = () => {
        setIsOpenModal(true);
    };

    const handleCancel = () => {
        setIsOpenModal(false);
    };

    const handleSubmit = async () => {
        try {
            form.submit();
            await form.validateFields();

            const chapterData = {
                chapterId: chapter._id,
                ...form.getFieldValue(),
            };

            await updateChapter(chapterData);

            handleCancel();
            refetch();
            // form.resetFields();
            message.success('Cập Nhật Chương Học Thành Công!');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Space>
                <EditOutlined onClick={handleShow} className="text-green-500 ml-3 text-xl cursor-pointer" />
            </Space>
            <Modal
                width={620}
                onOk={handleSubmit}
                title="Chỉnh sửa chương học"
                onCancel={handleCancel}
                open={isOpenModal}
                confirmLoading={isLoading}
                destroyOnClose={true}
                okText={'Xác nhận'}
                centered={true}
                cancelText={'Quay lại'}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="w-full py-3"
                    requiredMark={'optional'}
                    autoComplete="off"
                    initialValues={{
                        name: chapter.name,
                        isPublic: chapter.isPublic,
                        isFree: chapter.isFree,
                    }}
                >
                    <Alert
                        className="mb-5"
                        type="warning"
                        description={`Xin lưu ý rằng khi tùy chọn "Xác nhận xuất bản" được chọn, chương học sẽ được
                                    công khai ra ngoài giao diện người dùng.`}
                    />

                    <Form.Item
                        name="name"
                        label="Tiêu đề chương"
                        className="w-full"
                        rules={[
                            { whitespace: true, message: 'Vui lòng nhập tiêu đề chương!' },
                            { required: true, message: 'Vui lòng nhập tiêu đề chương!' },
                        ]}
                    >
                        <Input className="w-full p-2" placeholder="Nhập tiêu đề chương học" />
                    </Form.Item>

                    <Flex className="flex items-center gap-6">
                        <Form.Item name="isPublic" valuePropName="checked">
                            <Checkbox onChange={() => console.log(true)}>Xác nhận xuất bản</Checkbox>
                        </Form.Item>
                        <Form.Item name={'isFree'} valuePropName="checked">
                            <Checkbox onChange={() => console.log(true)}>Chương học miễn phí</Checkbox>
                        </Form.Item>
                    </Flex>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateChapter;
