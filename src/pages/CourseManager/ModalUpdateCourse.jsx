/* eslint-disable react/prop-types */
import { InfoCircleOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Form, Input, Modal, Select, message, notification } from 'antd';
import React from 'react';

import { useUpdateCourseMutation } from '@/providers/apis/courseApi';

import UploadThumbCourse from './UploadThumbCourse';
import CourseMDXEditor from './CourseMDXEditor';

const ModalUpdateCourse = ({ course, categories, setCourse }) => {
    const [thumbnail, setThumbnail] = React.useState(null);
    const [description, setDescription] = React.useState('');

    const [updateCourse, { isLoading: isLoadingUpdateCourse }] = useUpdateCourseMutation();

    const [form] = Form.useForm();

    const handleCancel = () => {
        setCourse(null);
        handleCancelThumb();
    };

    const onFinish = async () => {
        try {
            form.submit();

            if (!description) {
                notification.error({
                    message: <b>Lỗi xử lý dữ liệu</b>,
                    description: 'Hãy thực hiện nhập mô tả khóa học',
                });
                return null;
            }

            await form.validateFields();

            const payload = {
                _id: course._id,
                ...form.getFieldValue(),
                description: description,
                thumb: thumbnail ? thumbnail.url : course.thumb,
            };

            await updateCourse(payload);
            message.success('Cập nhật khóa học thành công!');
            handleCancel();
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancelThumb = () => {
        setThumbnail(null);
    }; // Hủy thay đổi ảnh bìa

    React.useEffect(() => {
        if (form && course) {
            form.setFieldsValue({
                name: course.name,
                price: course.price,
                old_price: course.old_price,
                cate_id: course.cate_id._id,
            });
            setDescription(course.description);
        }
    }, [form, course]);

    const categoriesFormat = categories.map((c) => ({ label: c.name, value: c._id }));

    return (
        <Modal
            width={820}
            onOk={onFinish}
            okText={'Lưu lại'}
            cancelText={'Quay lại'}
            onCancel={handleCancel}
            destroyOnClose={true}
            open={course ? true : false}
            title={'Chỉnh sửa khóa học'}
            confirmLoading={isLoadingUpdateCourse}
            style={{ top: 36 }}
        >
            <UploadThumbCourse course={course} thumbnail={thumbnail} setThumbnail={setThumbnail} />
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
                        name="name"
                        label="Tên khóa học"
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
                                placeholder="Nhập giá cũ khóa học"
                                onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
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
                                placeholder="Nhập giá mới khóa học"
                                onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
                            />
                        </Form.Item>
                    </div>

                    <div className="s-course">
                        <Form.Item
                            name="cate_id"
                            label="Chủ đề khóa học"
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

                    <CourseMDXEditor markdown={description} setDescription={setDescription} />
                </Form>
            </div>
        </Modal>
    );
};

export default ModalUpdateCourse;
