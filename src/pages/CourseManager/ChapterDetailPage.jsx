/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Breadcrumb, Card, Tag, Tree } from 'antd';
import { useParams } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';

import CreateLesson from './features/CreateLesson';

import { useGetChapterByIdQuery } from '@/providers/apis/chapterApi';
import React from 'react';

// import UpdateLesson from './features/LessonComponent';

const ChapterDetailPage = () => {
    const { courseId, chapterId } = useParams();

    const { data: chapter = { lessons: [] }, isLoading } = useGetChapterByIdQuery(chapterId, {
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
                            {lesson?.source_type === 'cloudinary' ? 'Cloudinary' : 'Youtube'}
                        </Tag>
                        <Tag color={lesson?.isPublic ? 'success' : 'warning'}>
                            {lesson?.isPublic ? 'Công khai' : 'Bản nháp'}
                        </Tag>
                        <EditOutlined className="text-green-500 ml-3 text-xl cursor-pointer" />
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
        <Flex className="w-full" gap={20} vertical>
            <Breadcrumb
                items={[
                    { title: 'Trang chủ' },
                    { title: 'Quản lý khóa học', href: '/manager-courses' },
                    { title: 'Chi tiết khóa học', href: `/manager-courses/${courseId}` },
                    { title: 'Chi tiết chương học' },
                ]}
            />

            <CreateLesson />

            <Card title="Danh sách bài học">
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
            </Card>
        </Flex>
    );
};

export default ChapterDetailPage;
