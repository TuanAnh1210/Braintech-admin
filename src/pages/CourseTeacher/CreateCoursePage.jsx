/* eslint-disable react/prop-types */
import { InfoCircleOutlined, CaretDownOutlined, LoadingOutlined, LeftOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Card,
    Select,
    message,
    notification,
    Space,
    Breadcrumb,
    Button,
    Col,
    Flex,
    Row,
    Checkbox,
    Alert,
} from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useCreateCourseMutation } from '@/providers/apis/courseTeacherApi';
import { useGetCateQuery } from '@/providers/apis/cateApi';

import UploadThumbCourse from './components/UploadThumbCourse';
import CourseMDXEditor from './components/CourseMDXEditor';
import { useCookies } from 'react-cookie';

const CreateCoursePage = () => {
    const [cookies] = useCookies(['cookieLoginStudent']);
    const [isFree, setIsFree] = React.useState(false);
    const [isPublic, setIsPublic] = React.useState(false);
    const [enableCheckbox, setEnableCheckbox] = React.useState(false);
    const [description, setDescription] = React.useState('');
    const [thumbnail, setThumbnail] = React.useState(null);

    const [createCourse, { isLoading }] = useCreateCourseMutation();
    const { data: categories = [] } = useGetCateQuery();

    const navigate = useNavigate();

    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            form.submit();

            if (!thumbnail) {
                notification.warning({
                    message: <b>Lỗi xử lý dữ liệu</b>,
                    description: 'Hãy thực hiện tải lên ảnh bìa khóa học',
                });
                return null;
            }

            if (!description) {
                notification.warning({
                    message: <b>Lỗi xử lý dữ liệu</b>,
                    description: 'Hãy thực hiện nhập mô tả khóa học',
                });
                return null;
            }

            await form.validateFields();

            const payload = { ...form.getFieldValue(), description: description, thumb: thumbnail.url };

            await createCourse({
                ...payload,
                teacherId: cookies.cookieLoginStudent._id,
            });

            message.success('Thêm khóa học thành công!');
        } catch (error) {
            console.log(error);
        }
    }; // Xử lý thêm mới khóa học

    const categoriesFormat = categories.map((c) => ({ label: c.name, value: c._id }));

    const handleIsFreeChange = (e) => {
        const isFree = e.target.checked;
        setIsFree(isFree);

        // Cập nhật trạng thái của Form khi checkbox thay đổi
        const value = isFree ? 0 : '';
        form.setFieldsValue({ price: value, old_price: value });
    };

    const handleIsPublicChange = async (e) => {
        try {
            if (!thumbnail || !description) return null;
            await form.validateFields();
            const isPublic = e.target.checked;
            setIsPublic(isPublic);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFormValuesChange = async () => {
        try {
            if (!thumbnail || !description) return null;
            await form.validateFields();
            setEnableCheckbox(true);
        } catch (e) {
            const enable = e.errorFields.length === 0;
            setEnableCheckbox(enable);
            if (!enable) {
                setIsPublic(false);
                form.setFieldsValue({ isPublic: false });
            }
        }
    }; // Bắt tất cả sự kiện thay đổi trong form

    return (
        <div className="w-full">
            <Breadcrumb
                className="mb-4"
                items={[
                    { title: 'Trang chủ' },
                    { title: 'Quản lý khóa học', href: '/manager-courses' },
                    { title: 'Thêm mới' },
                ]}
            />
            <Card
                title={
                    <Space className="flex items-center justify-between">
                        <Flex gap={10}>
                            <LeftOutlined
                                onClick={() => navigate(-1)}
                                className="hover:-translate-x-0.5 duration-100 cursor-pointer"
                            />
                            <p>Thêm khóa học mới</p>
                        </Flex>
                        <Space>
                            <Button
                                disabled={isLoading}
                                onClick={handleSubmit}
                                type={isLoading ? 'default' : 'primary'}
                            >
                                {isLoading ? <LoadingOutlined /> : <span>Xác nhận</span>}
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
                    <Alert
                        showIcon
                        type="success"
                        description={`Hãy thực hiện bước cuối cùng để công khai khóa học!`}
                    />
                )}
                <div className="flex gap-6 py-6">
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
                                <UploadThumbCourse thumbnail={thumbnail} setThumbnail={setThumbnail} />
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
                                    <Form.Item valuePropName="checked">
                                        <Checkbox onChange={handleIsFreeChange}>Khóa học miễn phí</Checkbox>
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>
                        <CourseMDXEditor markdown={''} setDescription={setDescription} />
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default CreateCoursePage;
