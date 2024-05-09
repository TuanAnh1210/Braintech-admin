/* eslint-disable react-hooks/exhaustive-deps */
import { LeftOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { Flex, Breadcrumb, Card, Tag, Tree, Empty } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import CreateLesson from './features/CreateLesson';

import { useGetChapterByIdQuery } from '@/providers/apis/chapterApi';
import React from 'react';
import UpdateLesson from './features/UpdateLesson';

// import UpdateLesson from './features/LessonComponent';

const ChapterDetailPage = () => {
    const [lesson, setLesson] = React.useState(null);
    const { courseId, chapterId } = useParams();

    const navigate = useNavigate();

    const {
        data: chapter = { lessons: [] },
        refetch,
        isLoading,
    } = useGetChapterByIdQuery(chapterId, {
        skip: !chapterId,
    });

    const gLessons = chapter.lessons.map((lesson, index) => {
        const lessonId = lesson._id;
        return {
            key: lessonId,
            title: (
                <Flex justify="space-between" className="font-semibold text-base">
                    <Flex>
                        {index + 1}. {lesson.name}
                    </Flex>

                    <Flex align="flex-start">
                        <Tag color={'processing'}>
                            {lesson?.source_type === 'cloudinary' && 'Cloudinary'}
                            {lesson?.source_type === 'youtube' && 'Youtube'}
                            {lesson?.source_type === 'upload' && 'Upload Video'}
                        </Tag>
                        <Tag color={lesson?.isPublic ? 'success' : 'warning'}>
                            {lesson?.isPublic ? 'Công khai' : 'Bản nháp'}
                        </Tag>

                        <EditOutlined
                            onClick={() => setLesson(lesson)}
                            className="text-green-500 ml-3 text-xl cursor-pointer"
                        />
                    </Flex>
                </Flex>
            ),
        };
    });
    const [gData, setGData] = React.useState(gLessons);

    const onDragEnter = (info) => {
        console.log(info);
    };

    React.useEffect(() => {
        if (chapter.lessons.length > 0) {
            setGData(gLessons);
        }
    }, [chapter]);

    const onDrop = (info) => {
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]); // the drop position relative to the drop node, inside 0, top -1, bottom 1

        const loop = (data, key, callback) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                if (data[i].children) {
                    loop(data[i].children, key, callback);
                }
            }
        };

        const data = [...gData];

        // Find dragObject
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
                item.children.unshift(dragObj);
            });
        } else {
            let ar = [];
            let i;
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                // Drop on the top of the drop node
                ar.splice(i, 0, dragObj);
            } else {
                // Drop on the bottom of the drop node
                ar.splice(i + 1, 0, dragObj);
            }
        }
        setGData(data);
    };

    return (
        <>
            <Flex className="w-full" gap={20} vertical>
                <Breadcrumb
                    items={[
                        { title: 'Trang chủ' },
                        { title: 'Quản lý khóa học', href: '/manager-courses' },
                        { title: 'Chi tiết khóa học', href: `/manager-courses/${courseId}` },
                        { title: 'Chi tiết chương học' },
                    ]}
                />

                <Card
                    title={
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-between gap-3">
                                <LeftOutlined
                                    onClick={() => navigate(-1)}
                                    className="hover:-translate-x-0.5 duration-150 cursor-pointer"
                                />
                                <h3 className="font-bold">Danh sách bài học</h3>
                            </div>
                            <CreateLesson refetch={refetch} />
                        </div>
                    }
                >
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center pt-16 pb-12">
                            <LoadingOutlined className="text-3xl" />
                            <span className="mt-3">Đang tải...</span>
                        </div>
                    ) : (
                        <>
                            <h2 className="font-bold text-lg mb-6">Chương học: {chapter?.name}</h2>

                            <Tree
                                draggable
                                blockNode
                                rootClassName="chapters"
                                onDragEnter={onDragEnter}
                                onDrop={onDrop}
                                treeData={gData}
                                className="draggable-tree"
                            />

                            {gData.length === 0 && <Empty className="my-8" description="Chưa có dữ liệu" />}
                        </>
                    )}
                </Card>
            </Flex>

            <UpdateLesson refetch={refetch} lesson={lesson} setLesson={setLesson} />
        </>
    );
};

export default ChapterDetailPage;
