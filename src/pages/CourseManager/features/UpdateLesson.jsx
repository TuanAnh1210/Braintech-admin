/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { InfoCircleOutlined, CaretDownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Form, Input, Select, Col, Row, Flex, Checkbox, Alert, Empty, message, Card, Space, Button, Modal } from 'antd';
import { useParams } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
import readXlsxFile from 'read-excel-file';
import classNames from 'classnames';
import videojs from 'video.js';
import React from 'react';
import axios from 'axios';

import 'video.js/dist/video-js.css';

// import UploadThumbCourse from '../components/UploadThumbCourse';

import uploadImageSvg from '@/assets/images/upload.svg';
import documentImageSvg from '@/assets/images/document.svg';
import { useUpdateLessonByIdMutation } from '@/providers/apis/lessonApi';

const UpdateLesson = ({ lesson, setLesson, refetch }) => {
    const [progress, setProgress] = React.useState(0);
    const [sourceType, setSourceType] = React.useState('youtube');
    const [url, setUrl] = React.useState('');

    const [updateLesson, { isLoading }] = useUpdateLessonByIdMutation();
    const [form] = Form.useForm();

    const selects = [
        { label: 'Link Video Youtube', value: 'youtube' },
        { label: 'Link Video Cloudinary', value: 'cloudinary' },
        { label: 'Tải lên video', value: 'upload' },
    ];

    const handleUploadVideo = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file || (!file.type.includes('mp4') && !file.type.includes('webm'))) {
                message.error('File không đúng định dạng.');
                return;
            }

            const formData = new FormData();
            formData.append('video', file);

            const response = await axios.post('http://localhost:8080/api/courses/upload-video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                },
            });

            const playback_url = response.data.playback_url;
            form.setFieldsValue({ url_video: playback_url });
            setUrl(playback_url);
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
        }
    };

    const handleChangeXlsxFile = (e) => {
        const file = e.target.files[0];
        readXlsxFile(file).then((rows) => {
            console.log(rows);
            // `rows` is an array of rows
            // each row being an array of cells.
        });
    };

    const handleChangeUrl = (e) => {
        const url = e.target.value;
        setUrl(url);

        const isUrlCloudinary = url.includes('cloudinary');
        const isUrlYoutube = url.includes('youtube');

        if (isUrlCloudinary) {
            setSourceType('cloudinary');
            form.setFieldValue('source_type', 'cloudinary');
        }

        if (isUrlYoutube) {
            setSourceType('youtube');
            form.setFieldValue('source_type', 'youtube');
        }

        if (!isUrlYoutube && !isUrlCloudinary) setUrl('');

        form.setFieldValue('url_video', url);
    };

    const handleChangeSourceType = (value) => {
        setUrl('');
        setSourceType(value);

        form.setFieldValue('url_video', '');

        if (value === 'cloudinary') {
            setUrl(lesson.url_video);
            if (lesson.source_type === 'cloudinary') {
                form.setFieldValue('url_video', lesson.url_video);
            }
            // form.setFieldValue('isPrivateVideo', true);
        }

        if (value === 'youtube') {
            setUrl(lesson.url_video);
            if (lesson.source_type === 'youtube') {
                form.setFieldValue('url_video', lesson.url_video);
            }
            // form.setFieldValue('isPrivateVideo', false);
        }
    };

    const handleSubmit = async () => {
        try {
            form.submit();

            if (sourceType === 'upload' && !url.trim()) {
                message.error('Vui lòng tải lên video bài học!');
            }

            await form.validateFields();

            const lessonData = {
                lessonId: lesson._id,
                ...form.getFieldValue(),
            };

            await updateLesson(lessonData);
            refetch();
            setLesson(null);
            message.success('Thêm Bài Học Thành Công!');
        } catch (error) {
            message.error('Thêm Bài Học Thất Bại!');
            console.log(error);
        }
    };

    // React.useEffect(() => {
    //     const isUrlCloudinary = url.includes('cloudinary');
    //     const isUrlYoutube = url.includes('youtube');

    //     if (isUrlCloudinary) {
    //         form.setFieldValue('isPrivateVideo', true);
    //     }

    //     if (isUrlYoutube) {
    //         form.setFieldValue('isPrivateVideo', false);
    //     }
    // }, [url]);

    React.useEffect(() => {
        if (form && lesson) {
            form.setFieldsValue({
                name: lesson.name,
                url_video: lesson.url_video,
                source_type: lesson.source_type,
                isPublic: lesson.isPublic,
            });
            setUrl(lesson.url_video ? lesson.url_video : '');
            setSourceType(lesson.source_type);
        }
    }, [form, lesson]);

    return (
        <>
            <Modal
                width={1080}
                onCancel={() => setLesson(null)}
                open={lesson ? true : false}
                confirmLoading={isLoading}
                destroyOnClose={true}
                centered={true}
                closable={false}
                footer={null}
                styles={{
                    content: {
                        margin: '16px',
                    },
                }}
            >
                <Card
                    title={
                        <Space className="flex items-center justify-between">
                            Cập nhật bài học
                            <Space>
                                <Button onClick={() => setLesson(null)} type={'default'}>
                                    <span>Quay lại</span>
                                </Button>
                                <Button onClick={handleSubmit} type={isLoading ? 'default' : 'primary'}>
                                    {isLoading ? <LoadingOutlined /> : <span>Xác nhận</span>}
                                </Button>
                            </Space>
                        </Space>
                    }
                >
                    <div className="w-full">
                        <Form
                            form={form}
                            layout="vertical"
                            className="w-full"
                            requiredMark={'optional'}
                            autoComplete="off"
                            initialValues={{
                                source_type: 'youtube',
                            }}
                        >
                            <Row className="justify-between">
                                <Col className={classNames('border rounded-md p-3')} span={15}>
                                    <Form.Item
                                        label="Tiêu đề chương học"
                                        name="name"
                                        rules={[
                                            { whitespace: true, message: 'Vui lòng nhập tiêu đề chương học!' },
                                            { required: true, message: 'Vui lòng nhập tiêu đề chương học!' },
                                        ]}
                                        tooltip={{
                                            title: 'Tooltip with customize icon',
                                            icon: <InfoCircleOutlined />,
                                        }}
                                    >
                                        <Input className="w-full p-2" placeholder="Nhập tiêu đề chương học" />
                                    </Form.Item>

                                    <div className="s-course">
                                        <Form.Item
                                            label="Nguồn video"
                                            name="source_type"
                                            rules={[
                                                { whitespace: true, message: 'Vui lòng chọn nguồn video!' },
                                                { required: true, message: 'Vui lòng chọn nguồn video!' },
                                            ]}
                                            tooltip={{
                                                title: 'Tooltip with customize icon',
                                                icon: <InfoCircleOutlined />,
                                            }}
                                        >
                                            <Select
                                                size="large"
                                                showSearch={true}
                                                options={selects}
                                                optionFilterProp="children"
                                                onChange={handleChangeSourceType}
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

                                    {sourceType !== 'upload' && (
                                        <Form.Item
                                            label="URL video"
                                            name="url_video"
                                            rules={[
                                                { whitespace: true, message: 'Vui lòng nhập url video bài học!' },
                                                { required: true, message: 'Vui lòng nhập url video bài học!' },
                                            ]}
                                            tooltip={{
                                                title: 'Tooltip with customize icon',
                                                icon: <InfoCircleOutlined />,
                                            }}
                                        >
                                            <Input
                                                onChange={handleChangeUrl}
                                                className="w-full p-2"
                                                placeholder="VD: https://www.youtube.com/watch?v=uN5HsXRLUyo"
                                            />
                                        </Form.Item>
                                    )}

                                    <Alert
                                        className="mb-3"
                                        type="warning"
                                        description={`Xin lưu ý rằng khi tùy chọn "Xác nhận xuất bản" được chọn, khóa học sẽ được
                                    công khai ra ngoài giao diện người dùng.`}
                                    />

                                    <div className="flex items-center gap-6">
                                        <Form.Item name="isPublic" valuePropName="checked">
                                            <Checkbox>Xác nhận xuất bản</Checkbox>
                                        </Form.Item>
                                    </div>

                                    <div className="w-full min-h-[380px] flex items-center justify-center border rounded-md">
                                        {!url && <Empty className="mt-3" description="Chưa có dữ liệu Video" />}
                                        {sourceType === 'youtube' && url && <VideoYoutubePlayer url={url ? url : ''} />}
                                        {sourceType !== 'youtube' && url && (
                                            <VideoCloudinaryPlayer url={url ? url : ''} />
                                        )}
                                    </div>
                                </Col>
                                <Col className="flex flex-col" span={8}>
                                    {sourceType === 'upload' && (
                                        <Flex
                                            vertical
                                            className={classNames(
                                                'relative border border-dashed rounded-md px-3 py-6 mb-6',
                                            )}
                                        >
                                            <input
                                                onChange={handleUploadVideo}
                                                className="opacity-0 absolute inset-0 cursor-pointer"
                                                title="Chọn hình ảnh bìa khóa học"
                                                accept=".mp4"
                                                type="file"
                                            />
                                            <img
                                                width={48}
                                                height={48}
                                                className="mx-auto"
                                                src={uploadImageSvg}
                                                alt=""
                                            />
                                            <p className="mb-1 text-center">Upload a file or drag and drop</p>
                                            <p className="text-xs text-center">MP4 Video up to 100MB</p>
                                        </Flex>
                                    )}

                                    {/* <Flex
                            vertical
                            className={classNames('relative border border-dashed rounded-md px-3 py-6 mb-6')}
                        >
                            <input
                                onChange={handleChangeXlsxFile}
                                className="opacity-0 absolute inset-0 cursor-pointer"
                                title="Chọn file Quizz"
                                accept=".xlxs"
                                type="file"
                            />
                            <img width={48} height={48} className="mx-auto" src={documentImageSvg} alt="" />
                            <p className="mb-1 text-center">Tải lên file bài tập Quizz</p>
                            <p className="text-xs text-center">File up to 50MB</p>
                        </Flex> */}

                                    <Flex
                                        vertical
                                        className={classNames(
                                            'relative border border-dashed rounded-md px-3 py-6 mb-6',
                                        )}
                                    >
                                        <input
                                            disabled
                                            className="opacity-0 absolute inset-0 cursor-pointer"
                                            // title="Chọn file bài tập"
                                            title="Chưa làm xong phần này =)))"
                                            // accept=".jpg,.jpeg,.png,.gif"
                                            type="file"
                                        />
                                        <img width={48} height={48} className="mx-auto" src={documentImageSvg} alt="" />
                                        <p className="mb-1 text-center">Tải lên bài tập (nếu có)</p>
                                        <p className="text-xs text-center">File up to 50MB</p>
                                    </Flex>

                                    <Flex
                                        vertical
                                        className={classNames(
                                            'relative border border-dashed rounded-md p-3 mb-6 min-h-[200px]',
                                        )}
                                    >
                                        <p className="text-center">Danh sách các file bài tập</p>

                                        <Empty className="mt-3" description="Chưa có dữ liệu" />
                                    </Flex>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
            </Modal>
        </>
    );
};

const VideoYoutubePlayer = ({ url = '' }) => {
    console.log(url);
    return (
        <iframe
            width="100%"
            height="380"
            title="YouTube video player"
            frameBorder="0"
            src={url}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
        ></iframe>
    );
};

const VideoCloudinaryPlayer = ({ url = '' }) => {
    const videoRef = React.useRef(null);
    const playerRef = React.useRef(null);

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        // You can handle player events here, for example:
        player.on('waiting', () => {
            videojs.log('player is waiting');
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    const videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        html5: {
            hls: {
                // withCredentials: true,
                overrideNative: true,
            },
        },
        sources: [
            {
                src: url,
                type: 'application/x-mpegURL',
            },
        ],
    };

    React.useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
            const videoElement = document.createElement('video-js');

            videoElement.classList.add('vjs-big-play-centered');
            videoRef.current.appendChild(videoElement);

            const player = (playerRef.current = videojs(videoElement, videoJsOptions, () => {
                videojs.log('player is ready');
                handlePlayerReady && handlePlayerReady(player);
            }));

            // You could update an existing player in the `else` block here
            // on prop change, for example:
        } else {
            const player = playerRef.current;

            player.autoplay(videoJsOptions.autoplay);
            player.src(videoJsOptions.sources);
        }
    }, [videoJsOptions, videoRef]);

    // Dispose the Video.js player when the functional component unmounts
    React.useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div className="flex items-center justify-center w-full h-full" data-vjs-player>
            <div className="video-js bg-white w-full h-full" ref={videoRef} />
        </div>
    );
};

export default UpdateLesson;
