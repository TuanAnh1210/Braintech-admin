/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { EditOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Input, Modal, Space } from 'antd';
import React from 'react';

import { useGetCourseByIdQuery } from '@/providers/apis/courseApi';

const DrawerChapters = ({ _id }) => {
    const [open, setOpen] = React.useState(false);
    const [lesson, setLesson] = React.useState(null);

    const { data: course = { chapters: [] }, isLoading } = useGetCourseByIdQuery(_id);

    const onOpen = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    let lessonCount = 0;

    return (
        <>
            <Button onClick={onOpen} type="primary">
                Xem
            </Button>
            <Drawer
                open={open}
                width={560}
                onClose={onClose}
                styles={{
                    content: {
                        borderRadius: '16px 0 0 16px',
                    },
                }}
                placement="right"
                title={`Danh sách các chương`}
            >
                <h2 className="font-bold text-lg mb-6">Khóa học: {course.name}</h2>

                {course.chapters.map((chapter, index) => {
                    const lessons = chapter.lessons;
                    return (
                        <div key={chapter._id}>
                            <div className="font-bold text-base">
                                <h3>
                                    {index + 1}. {chapter.name}
                                    <EditOutlined className="text-green-500 ml-3 cursor-pointer" />
                                </h3>
                            </div>

                            <div className="ml-3 font-medium text-sm">
                                {lessons.map((lesson) => {
                                    lessonCount += 1;
                                    return (
                                        <div className="py-3" key={lesson._id}>
                                            <h4 className="flex items-center justify-between">
                                                {lessonCount}. {lesson.name}
                                                <div
                                                    onClick={() => setLesson(lesson)}
                                                    className="border border-[#f5700c] text-[#f5700c] select-none cursor-pointer px-3 py-0.5 rounded-md hover:bg-[#f5700c] hover:text-white duration-100"
                                                >
                                                    <span className="whitespace-nowrap">Chi tiết</span>
                                                </div>
                                            </h4>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </Drawer>
            <DrawerLesson lesson={lesson} setLesson={setLesson} />
        </>
    );
};

const DrawerLesson = ({ lesson, setLesson }) => {
    const [isOpenModalQuizz, setIsOpenModalQuizz] = React.useState(false);

    const [form] = Form.useForm();

    const onClose = () => {
        setLesson(null);
    };

    const handleOk = () => {
        setIsOpenModalQuizz(true);
    };
    const handleCancel = () => {
        setIsOpenModalQuizz(false);
    };

    React.useEffect(() => {
        if (form && lesson) {
            form.setFieldsValue({
                name: lesson.name,
                path_video: lesson.path_video,
            });
        }
    }, [form, lesson]);

    return (
        <>
            <Drawer
                width={420}
                onClose={onClose}
                destroyOnClose={true}
                open={lesson ? true : false}
                title={`Danh sách các bài học`}
                placement="right"
                styles={{
                    content: {
                        borderRadius: '16px 0 0 16px',
                    },
                }}
                extra={
                    <Space>
                        <Button onClick={handleOk} type="primary">
                            Thêm Quizz
                        </Button>
                    </Space>
                }
            >
                <div>
                    <Form form={form} layout="vertical" className="w-full" requiredMark={'optional'} autoComplete="off">
                        <Form.Item
                            name="name"
                            label="Tên bài học"
                            className="w-full"
                            rules={[
                                { whitespace: true, message: 'Vui lòng nhập tên bài học!' },
                                { required: true, message: 'Vui lòng nhập tên bài học!' },
                            ]}
                        >
                            <Input value={lesson?.name} className="w-full p-2" placeholder="Nhập tên bài học" />
                        </Form.Item>
                        <Form.Item
                            name="path_video"
                            label="Nguồn bài học"
                            className="w-full"
                            rules={[
                                { whitespace: true, message: 'Vui lòng nhập nguồn bài học!' },
                                { required: true, message: 'Vui lòng nhập nguồn bài học!' },
                            ]}
                        >
                            <Input value={lesson?.name} className="w-full p-2" placeholder="Nhập nguồn bài học" />
                        </Form.Item>
                    </Form>
                </div>
            </Drawer>

            <Modal
                onOk={handleOk}
                title="Thêm Quizz"
                onCancel={handleCancel}
                open={isOpenModalQuizz}
                destroyOnClose={true}
            >
                <div>
                    <Form form={form} layout="vertical" className="w-full" requiredMark={'optional'} autoComplete="off">
                        <Form.Item
                            name="name_1"
                            label="Tên bài học"
                            className="w-full"
                            rules={[
                                { whitespace: true, message: 'Vui lòng nhập tên bài học!' },
                                { required: true, message: 'Vui lòng nhập tên bài học!' },
                            ]}
                        >
                            <Input value={lesson?.name} className="w-full p-2" placeholder="Nhập tên bài học" />
                        </Form.Item>
                        <Form.Item
                            name="name_2"
                            label="Tên bài học"
                            className="w-full"
                            rules={[
                                { whitespace: true, message: 'Vui lòng nhập tên bài học!' },
                                { required: true, message: 'Vui lòng nhập tên bài học!' },
                            ]}
                        >
                            <Input value={lesson?.name} className="w-full p-2" placeholder="Nhập tên bài học" />
                        </Form.Item>
                        <Form.Item
                            name="path_video_1"
                            label="Nguồn bài học"
                            className="w-full"
                            rules={[
                                { whitespace: true, message: 'Vui lòng nhập nguồn bài học!' },
                                { required: true, message: 'Vui lòng nhập nguồn bài học!' },
                            ]}
                        >
                            <Input value={lesson?.name} className="w-full p-2" placeholder="Nhập nguồn bài học" />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default DrawerChapters;
