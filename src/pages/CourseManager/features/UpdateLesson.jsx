/* eslint-disable react/prop-types */
import { EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { Form, Input, Divider, Empty, message, Card, Button, Space } from 'antd';
import classNames from 'classnames';
import React from 'react';

import { useGetQuizzsByLessonIdQuery } from '@/providers/apis/quizzApi';
import { useUpdateLessonByIdMutation } from '@/providers/apis/lessonApi';

import UpdateQuizz from './UpdateQuizz';

const LessonComponent = () => {
    const [quizz, setQuizz] = React.useState(null);
    const [lessonForm, setLessonForm] = React.useState({
        name: '',
        path_video: '',
    });

    const [form] = Form.useForm();

    const [listInput, setListInput] = React.useState([
        {
            id: 1,
            name: 'name',
            label: 'Tên bài học',
            isFocus: false,
            placeholder: 'Nhập tên bài học',
            rules: [
                { whitespace: true, message: 'Vui lòng nhập tên bài học!' },
                { required: true, message: 'Vui lòng nhập tên bài học!' },
            ],
        },
        {
            id: 2,
            name: 'path_video',
            label: 'Nguồn bài học',
            isFocus: false,
            placeholder: 'Nhập nguồn bài học',
            rules: [
                { whitespace: true, message: 'Vui lòng nhập nguồn bài học!' },
                { required: true, message: 'Vui lòng nhập nguồn bài học!' },
            ],
        },
    ]);

    const [updateLesson] = useUpdateLessonByIdMutation();

    const { data: quizzs = [], isLoading } = useGetQuizzsByLessonIdQuery('', {
        skip: true,
    });

    const handleSubmit = async () => {
        try {
            form.submit();
            await form.validateFields();

            await updateLesson({ ...lessonForm, lessonId: lesson._id });

            message.success('Chỉnh sửa thành công!');
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeInput = (e) => {
        const target = e.target;
        setLessonForm((prev) => ({ ...prev, [target.name]: target.value }));
    };

    const handleFocusInput = ({ id }) => {
        setListInput(listInput.map((p) => (p.id === id ? { ...p, isFocus: !p.isFocus } : p)));
    };

    const handleBlurInput = ({ id }) => {
        // handleSubmit();
        setListInput(listInput.map((p) => (p.id === id ? { ...p, isFocus: !p.isFocus } : p)));
    };

    // React.useEffect(() => {
    //     if (lesson) {
    //         setLessonForm({
    //             name: lesson.name,
    //             path_video: lesson.path_video,
    //         });
    //     }
    // }, [lesson]);

    return (
        <>
            <Card
                title={
                    <Space className="flex items-center justify-between">
                        <p>Danh sách chương học</p>

                        {/* <CreateChapter /> */}
                    </Space>
                }
            >
                {/* <Form form={form} layout="vertical" className="w-full" requiredMark={'optional'} autoComplete="off">
                    {listInput.map((input, index) => {
                        return (
                            <Form.Item key={index} label={input.label} className={'w-full'} rules={input.rules}>
                                <Card className={classNames(!input.isFocus && 'hidden')}>
                                    <Input
                                        autoFocus={true}
                                        name={input.name}
                                        spellCheck={false}
                                        value={lessonForm?.[input.name]}
                                        onChange={handleChangeInput}
                                        placeholder={input.placeholder}
                                        className="w-full font-medium p-2"
                                    />
                                    <div className="flex items-center gap-3">
                                        <Button className="mt-3" onClick={() => handleBlurInput({ id: input.id })}>
                                            Quay lại
                                        </Button>
                                        <Button onClick={handleSubmit} className="mt-3" type="primary">
                                            Lưu
                                        </Button>
                                    </div>
                                </Card>

                                <div className={'relative'}>
                                    <div
                                        onClick={() => handleFocusInput({ id: input.id })}
                                        className={classNames(
                                            'flex items-center justify-between border p-2 rounded-md',
                                            input.isFocus && 'hidden',
                                        )}
                                    >
                                        <p className="font-medium">{lesson?.[input.name]}</p>
                                        <EditOutlined className="text-green-500 text-lg ml-3 cursor-pointer" />
                                    </div>
                                </div>
                            </Form.Item>
                        );
                    })}
                </Form> */}

                <div>
                    <Divider />
                    <h2 className="font-bold text-base">Danh sách Quizz</h2>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center pt-16">
                            <LoadingOutlined className="text-3xl" />
                            <span className="mt-3">Đang tải...</span>
                        </div>
                    ) : (
                        <>
                            <div className="ml-3 font-medium text-sm">
                                {quizzs.map((quizz, index) => {
                                    return (
                                        <div className="flex items-center justify-between py-3" key={quizz._id}>
                                            <div>
                                                {index + 1}. <span>{quizz.title}</span>
                                            </div>
                                            <div
                                                onClick={() => setQuizz(quizz)}
                                                className="border border-[#f5700c] text-[#f5700c] select-none cursor-pointer px-3 py-0.5 rounded-md hover:bg-[#f5700c] hover:text-white duration-100"
                                            >
                                                <span className="whitespace-nowrap">Chỉnh sửa</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {quizzs.length === 0 && <Empty className="mt-16" description="Chưa có dữ liệu" />}
                        </>
                    )}
                </div>
            </Card>

            <UpdateQuizz quizz={quizz} setQuizz={setQuizz} />
        </>
    );
};

export default LessonComponent;
