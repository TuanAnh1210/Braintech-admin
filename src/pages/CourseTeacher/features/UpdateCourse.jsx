/* eslint-disable react/prop-types */
import { InfoCircleOutlined, CaretDownOutlined, LoadingOutlined, LeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import React from 'react';
import { Form, Input, Card, Select, message, notification, Space, Button, Col, Row, Checkbox, Alert, Flex } from 'antd';

import { useGetCourseByIdQuery, useUpdateCourseMutation } from '@/providers/apis/courseTeacherApi';
import { useGetCateQuery } from '@/providers/apis/cateApi';

import UploadThumbCourse from '../components/UploadThumbCourse';
import CourseMDXEditor from '../components/CourseMDXEditor';
const UpdateCourse = () => {
    const [isFree, setIsFree] = React.useState(false);
    const [isPublic, setIsPublic] = React.useState(false);
    const [enableCheckbox, setEnableCheckbox] = React.useState(true);
    const [description, setDescription] = React.useState('');
    const [thumbnail, setThumbnail] = React.useState(null);

    const { courseId } = useParams();
    const navigate = useNavigate();

    const [updateCourse, { isLoading }] = useUpdateCourseMutation();

    const { data: categories = [] } = useGetCateQuery();
    const { data: course } = useGetCourseByIdQuery(courseId, {
        skip: !courseId,
        refetchOnMountOrArgChange: true,
    });

    const [form] = Form.useForm();

    const handleSubmit = async () => {
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
                _id: courseId,
                ...form.getFieldValue(),
                description: description,
                thumb: thumbnail ? thumbnail.url : course.thumb,
            };

            await updateCourse(payload);
            message.success('Cập nhật khóa học thành công!');
        } catch (error) {
            console.log(error);
        }
    }; // Xử lý thêm mới khóa học

    const categoriesFormat = categories.map((c) => ({ label: c.name, value: c._id }));

    const handleIsFreeChange = (e) => {
        const isFree = e.target.checked;
        setIsFree(isFree);

        // Cập nhật trạng thái của Form khi checkbox thay đổi
        const price = isFree ? 0 : course.price || '';
        const old_price = isFree ? 0 : course.old_price || '';
        form.setFieldsValue({ price: price, old_price: old_price });
    };

    const handleIsPublicChange = async (e) => {
        try {
            await form.validateFields();
            const isPublic = e.target.checked;
            setIsPublic(isPublic);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFormValuesChange = async () => {
        try {
            if (!description) return;
            await form.validateFields();
        } catch (e) {
            const enable = e.errorFields.length === 0;
            setEnableCheckbox(enable);
            if (!enable) {
                setIsPublic(false);
                form.setFieldsValue({ isPublic: false });
            }
            console.log(e);
        }
    }; // Bắt tất cả sự kiện thay đổi trong form

    React.useEffect(() => {
        if (form && course) {
            form.setFieldsValue({
                name: course.name,
                price: course.price,
                old_price: course.old_price,
                cate_id: course.cate_id,
                isFree: course.price === 0,
                isPublic: course.isPublic,
            });
            setIsPublic(course.isPublic);
            setIsFree(course.price === 0);
            setDescription(course.description);
        }
    }, [form, course]);

    return (
        <div className="w-full">
            <Card
                title={
                    <Space className="flex items-center justify-between">
                        <Flex gap={10}>
                            <LeftOutlined onClick={() => navigate(-1)} className="cursor-pointer" />
                            <p>Chỉnh sửa khóa học</p>
                        </Flex>
                        <Space>
                            <Button
                                disabled={isLoading}
                                onClick={handleSubmit}
                                type={isLoading ? 'default' : 'primary'}
                            >
                                {isLoading ? <LoadingOutlined /> : <span>Lưu lại</span>}
                            </Button>
                        </Space>
                    </Space>
                }
                className="w-full"
                size="default"
            >
                {!isPublic ? (
                    <Alert
                        showIcon
                        type="warning"
                        description={`Vui lòng đảm bảo rằng bạn đã điền đầy đủ thông tin trước khi xuất bản. Thông tin không đầy đủ có thể ảnh hưởng đến trải nghiệm của người dùng. Xin cảm ơn sự hợp tác của bạn!`}
                    />
                ) : (
                    <Alert showIcon type="info" description={`Hãy thực hiện bước cuối cùng để công khai khóa học!`} />
                )}
                <div className="flex gap-6 pt-6">
                    <Form
                        onValuesChange={handleFormValuesChange}
                        form={form}
                        layout="vertical"
                        className="w-full"
                        requiredMark={'optional'}
                        autoComplete="off"
                        initialValues={{
                            isPublic: false,
                        }}
                    >
                        <Row>
                            <Col className="pr-12" span={8}>
                                <UploadThumbCourse course={course} thumbnail={thumbnail} setThumbnail={setThumbnail} />
                            </Col>
                            <Col span={16}>
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
                                        label="Giá cũ khóa học"
                                        className="w-full"
                                        rules={[{ required: true, message: 'Vui lòng nhập giá cũ khóa học!' }]}
                                        tooltip={{
                                            title: 'Tooltip with customize icon',
                                            icon: <InfoCircleOutlined />,
                                        }}
                                    >
                                        <Input
                                            disabled={isFree}
                                            className="w-full p-2"
                                            onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
                                            placeholder="Nhập giá cũ khóa học"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="price"
                                        label="Giá mới khóa học"
                                        className="w-full"
                                        rules={[{ required: true, message: 'Vui lòng nhập giá mới khóa học!' }]}
                                        tooltip={{
                                            title: 'Tooltip with customize icon',
                                            icon: <InfoCircleOutlined />,
                                        }}
                                    >
                                        <Input
                                            disabled={isFree}
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

                                <Alert
                                    className="mb-3"
                                    type="warning"
                                    description={`Xin lưu ý rằng khi tùy chọn "Xác nhận xuất bản" được chọn, khóa học sẽ được
                                    công khai ra ngoài giao diện người dùng.`}
                                />

                                <div className="flex items-center gap-6">
                                    <Form.Item name="isPublic" valuePropName="checked">
                                        <Checkbox disabled={!enableCheckbox} onChange={handleIsPublicChange}>
                                            Xác nhận xuất bản
                                        </Checkbox>
                                    </Form.Item>
                                    <Form.Item name={'isFree'} valuePropName="checked">
                                        <Checkbox onChange={handleIsFreeChange}>Khóa học miễn phí</Checkbox>
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>

                {description ? (
                    <CourseMDXEditor markdown={description} setDescription={setDescription} />
                ) : (
                    <div className="border p-3 rounded-md">Loading...</div>
                )}
            </Card>
        </div>
    );
};

export default UpdateCourse;
