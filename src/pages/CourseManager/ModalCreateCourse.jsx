/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { InfoCircleOutlined, CaretDownOutlined, FormOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, message, notification } from 'antd';
import React from 'react';

import { useCreateCourseMutation } from '@/providers/apis/courseApi';

import UploadThumbCourse from './UploadThumbCourse';
import CourseMDXEditor from './CourseMDXEditor';

const ModalCreateCourse = ({ categories }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [description, setDescription] = React.useState('');
    const [thumbnail, setThumbnail] = React.useState(null);

    const [createCourse, { isLoading: isLoadingCreateCourse }] = useCreateCourseMutation();

    const [form] = Form.useForm();

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async () => {
        try {
            form.submit();
            if (!thumbnail) {
                notification.error({
                    message: <b>Lỗi xử lý dữ liệu</b>,
                    description: 'Hãy thực hiện tải lên ảnh bìa khóa học',
                });
                return null;
            }
            if (!description) {
                notification.error({
                    message: <b>Lỗi xử lý dữ liệu</b>,
                    description: 'Hãy thực hiện nhập mô tả khóa học',
                });
                return null;
            }

            await form.validateFields();

            const payload = { ...form.getFieldValue(), description: description, thumb: thumbnail.url };

            await createCourse(payload);
            message.success('Thêm khóa học thành công!');
            handleCancel();
        } catch (error) {
            console.log(error);
        }
    }; // Xử lý thêm mới khóa học

    const categoriesFormat = categories.map((c) => ({ label: c.name, value: c._id }));

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center" type="primary">
                <FormOutlined />
                Thêm khóa học
            </Button>
            <Modal
                width={820}
                onOk={handleSubmit}
                okText={'Lưu lại'}
                cancelText={'Quay lại'}
                onCancel={handleCancel}
                open={isModalOpen}
                destroyOnClose={true}
                title={'Thêm khóa học'}
                confirmLoading={isLoadingCreateCourse}
                style={{ top: 36 }}
            >
                <UploadThumbCourse thumbnail={thumbnail} setThumbnail={setThumbnail} />
                <div className="flex gap-6 pt-3 pb-6">
                    <Form
                        form={form}
                        layout="vertical"
                        className="w-full"
                        requiredMark={'optional'}
                        autoComplete="off"
                        name="courseForm"
                    >
                        <Form.Item
                            label="Tên khóa học"
                            name="name"
                            rules={[
                                { whitespace: true, message: 'Vui lòng nhập tên khóa học!' },
                                { required: true, message: 'Vui lòng nhập tên khóa học!' },
                            ]}
                            tooltip={{
                                title: 'Tooltip with customize icon',
                                icon: <InfoCircleOutlined />,
                            }}
                        >
                            <Input className="w-full p-2" placeholder="Nhập tên khóa học" />
                        </Form.Item>
                        <div className="flex items-center gap-3">
                            <Form.Item
                                name="old_price"
                                label="Giá khóa học cũ"
                                className="w-full"
                                rules={[{ required: true, message: 'Vui lòng nhập giá cũ khóa học!' }]}
                                tooltip={{
                                    title: 'Tooltip with customize icon',
                                    icon: <InfoCircleOutlined />,
                                }}
                            >
                                <Input
                                    className="w-full p-2"
                                    onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
                                    placeholder="Nhập giá cũ khóa học"
                                />
                            </Form.Item>
                            <Form.Item
                                name="price"
                                label="Giá khóa học mới"
                                className="w-full"
                                rules={[{ required: true, message: 'Vui lòng nhập giá mới khóa học!' }]}
                                tooltip={{
                                    title: 'Tooltip with customize icon',
                                    icon: <InfoCircleOutlined />,
                                }}
                            >
                                <Input
                                    className="w-full p-2"
                                    onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
                                    placeholder="Nhập giá mới khóa học"
                                />
                            </Form.Item>
                        </div>

                        <div className="s-course">
                            <Form.Item
                                label="Chủ đề khóa học"
                                name="cate_id"
                                rules={[
                                    { whitespace: true, message: 'Vui lòng chọn chủ đề khóa học!' },
                                    { required: true, message: 'Vui lòng chọn chủ đề khóa học!' },
                                ]}
                                tooltip={{
                                    title: 'Tooltip with customize icon',
                                    icon: <InfoCircleOutlined />,
                                }}
                            >
                                <Select
                                    size="large"
                                    showSearch={true}
                                    options={categoriesFormat}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '')
                                            .toLowerCase()
                                            .localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    suffixIcon={<CaretDownOutlined />}
                                />
                            </Form.Item>
                        </div>

                        <CourseMDXEditor setDescription={setDescription} />
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default ModalCreateCourse;
