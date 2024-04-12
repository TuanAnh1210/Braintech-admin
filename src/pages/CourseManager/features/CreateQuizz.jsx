/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Radio, Space, Tooltip, message } from 'antd';
import React from 'react';

import { useCreateQuizzsMutation } from '@/providers/apis/quizzApi';

const CreateQuizz = ({ lessonId }) => {
    const [isOpenModalQuizz, setIsOpenModalQuizz] = React.useState(false);

    const [createQuizz, { isLoading }] = useCreateQuizzsMutation();

    const [form] = Form.useForm();

    const handleOk = () => {
        setIsOpenModalQuizz(true);
    };

    const handleAddAnswer = (addCallback, fields) => {
        const fieldKeys = fields.map((field) => field.key);
        const maxKey = Math.max(...fieldKeys) + 1;
        const defaultValue = { [`title_answer_${maxKey}`]: '', [`answer_${maxKey}`]: false };
        addCallback(defaultValue);
    };

    const handleCancel = () => {
        setIsOpenModalQuizz(false);
    };

    const handleSubmit = async () => {
        try {
            form.submit();
            await form.validateFields();

            const quizzFields = form.getFieldValue();

            const dataAnswers = quizzFields.answers.map((a) => {
                let answer = '';
                let title_answer = '';

                Object.keys(a).forEach((key) => {
                    if (key.includes('answer')) {
                        answer = a[key];
                    }
                    if (key.includes('title_answer')) {
                        title_answer = a[key];
                    }
                });

                return { title_answer, answer };
            });

            const datas = {
                lesson_id: lessonId,
                title: quizzFields.title,
                answers: dataAnswers,
            };

            await createQuizz(datas);
            message.success('Thêm Quizz thành công!');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Space>
                <Button onClick={handleOk} type="primary">
                    Thêm Quizz
                </Button>
            </Space>
            <Modal
                width={620}
                onOk={handleSubmit}
                title="Thêm Quizz"
                onCancel={handleCancel}
                open={isOpenModalQuizz}
                confirmLoading={isLoading}
                destroyOnClose={true}
                okText={'Xác nhận'}
                cancelText={'Quay lại'}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="w-full py-3"
                    requiredMark={'optional'}
                    autoComplete="off"
                    initialValues={{
                        title: '',
                        answers: [
                            { title_answer_0: '', answer_0: false },
                            { title_answer_1: '', answer_1: false },
                        ],
                    }}
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề câu hỏi"
                        className="w-full"
                        rules={[
                            { whitespace: true, message: 'Vui lòng nhập tiêu đề câu hỏi!' },
                            { required: true, message: 'Vui lòng nhập tiêu đề câu hỏi!' },
                        ]}
                    >
                        <Input className="w-full p-2" placeholder="Nhập tiêu đề câu hỏi" />
                    </Form.Item>

                    <Form.List name="answers">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <Form.Item
                                            {...restField}
                                            className="w-full"
                                            name={[name, `title_answer_${key}`]}
                                            label={`Đáp án ${index + 1}`}
                                            rules={[
                                                { whitespace: true, message: 'Vui lòng nhập tiêu đề đáp án!' },
                                                { required: true, message: 'Vui lòng nhập tiêu đề đáp án!' },
                                            ]}
                                        >
                                            <Input className="w-full p-2" placeholder={`Nhập đáp án ${index + 1}`} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            label="Đúng/Sai"
                                            name={[name, `answer_${key}`]}
                                            rules={[{ required: true, message: 'Answer is required!' }]}
                                        >
                                            <Radio.Group className="flex border p-2 rounded-md">
                                                <Radio value={true}>Đúng</Radio>
                                                <Radio value={false}>Sai</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {fields.length > 2 && (
                                            <Tooltip title={'Xóa câu trả lời'} color="#f5700c">
                                                <div
                                                    onClick={() => remove(name)}
                                                    className="border border-dashed py-2 px-3 mt-1.5 rounded-md cursor-pointer hover:bg-red-50 font-medium"
                                                >
                                                    <CloseOutlined className="text-gray-600" />
                                                </div>
                                            </Tooltip>
                                        )}
                                    </div>
                                ))}

                                {fields.length < 5 && (
                                    <div
                                        className="flex items-center justify-center gap-3 border p-3 rounded-md mb-6 cursor-pointer hover:bg-green-50 font-medium"
                                        onClick={() => handleAddAnswer(add, fields)}
                                    >
                                        <PlusOutlined />
                                        <span className="text-sm whitespace-nowrap select-none">Thêm đáp án</span>
                                    </div>
                                )}
                            </>
                        )}
                    </Form.List>

                    <p className="text-red-500 mb-6">
                        <b>Lưu ý</b>: Trong tất cả các đáp án phải có ít nhất 1 đáp án <b>đúng</b>.
                    </p>
                </Form>
            </Modal>
        </>
    );
};

export default CreateQuizz;
