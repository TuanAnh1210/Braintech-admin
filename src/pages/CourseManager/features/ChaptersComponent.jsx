/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { LoadingOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { Flex, Card, Space, Empty, Tag, Tree } from 'antd';
import React from 'react';

import { useGetCourseByIdQuery } from '@/providers/apis/courseApi';

import CreateChapter from './CreateChapter';
import UpdateChapter from './UpdateChapter';

const ChaptersComponent = () => {
    const { courseId } = useParams();

    const { data: course = { chapters: [] }, isLoading } = useGetCourseByIdQuery(courseId, {
        skip: !courseId,
    });

    const gchapters = course.chapters.map((chapter, index) => {
        const chapterId = chapter._id;
        return {
            key: chapterId,
            title: (
                <Flex justify="space-between" className="font-semibold text-base">
                    <Flex>
                        {index + 1}. {chapter.name}
                        <UpdateChapter chapter={chapter} />
                    </Flex>

                    <Flex align="flex-start">
                        {chapter?.isFree && <Tag color="processing">Miễn phí</Tag>}
                        <Tag color={chapter?.isPublic ? 'success' : 'warning'}>
                            {chapter?.isPublic ? 'Công khai' : 'Bản nháp'}
                        </Tag>
                        <Link to={chapterId}>
                            <div className="border border-[#f5700c] text-[#f5700c] select-none cursor-pointer px-3 py-0.5 rounded-md hover:bg-[#f5700c] hover:text-white duration-100">
                                <span className="whitespace-nowrap text-sm">Chi tiết</span>
                            </div>
                        </Link>
                    </Flex>
                </Flex>
            ),
        };
    });
    const [gData, setGData] = React.useState(gchapters);

    const onDragEnter = (info) => {
        console.log(info);
    };

    React.useEffect(() => {
        if (course.chapters.length > 0) {
            setGData(gchapters);
        }
    }, [course]);

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
        <Card
            title={
                <Space className="flex items-center justify-between">
                    <p>Danh sách chương học</p>

                    <CreateChapter />
                </Space>
            }
            className="w-full min-h-[680px]"
            size="default"
        >
            {isLoading ? (
                <div className="flex flex-col items-center justify-center pt-16">
                    <LoadingOutlined className="text-3xl" />
                    <span className="mt-3">Đang tải...</span>
                </div>
            ) : (
                <>
                    <h2 className="font-bold text-lg mb-6">Khóa học: {course.name}</h2>

                    <Tree
                        draggable
                        blockNode
                        rootClassName="chapters"
                        onDragEnter={onDragEnter}
                        onDrop={onDrop}
                        treeData={gData}
                        className="draggable-tree"
                    />

                    {gData.length === 0 && <Empty className="mt-16" description="Chưa có dữ liệu" />}

                    {/* {course.chapters.map((chapter, index) => {
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
                        })} */}
                </>
            )}
        </Card>
    );
};

export default ChaptersComponent;
