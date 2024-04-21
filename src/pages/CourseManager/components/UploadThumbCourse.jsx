/* eslint-disable react/prop-types */
import { LoadingOutlined, CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { Image, Progress } from 'antd';
import React from 'react';

import { clipboard, convertBytesToReadableSize } from '@/lib/utils';
import { useUploadImageMutation } from '@/providers/apis/courseApi';

import uploadImageSvg from '@/assets/images/upload.svg';

const UploadThumbCourse = ({ course, thumbnail, setThumbnail }) => {
    const [file, setFile] = React.useState(null);

    const [uploadImage, { isLoading: isLoadingUpload }] = useUploadImageMutation({
        onError: (error) => {
            console.error('Đã xảy ra lỗi:', error);
        },
        onSuccess: (data) => {
            console.log('Upload ảnh thành công:', data);
            // Xử lý kết quả upload ảnh ở đây
        },
        onProgress: (event) => {
            const percentCompleted = Math.round((event.loaded / event.total) * 100);
            console.log('Tiến độ upload:', percentCompleted);
            // Cập nhật tiến độ upload ở đây
        },
    });

    const handleUploadThumb = async (file) => {
        setFile(file);

        const form = new FormData();
        form.append('image', file);

        const { data } = await uploadImage(form);
        console.log(data);
        setThumbnail(data?.data);
    }; // Xử lý upload hình ảnh lên clould

    const handleDrop = (event) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            const file = event.dataTransfer.files[0];
            handleUploadThumb(file);
        }
    }; // Hỗ trợ kéo thả ảnh

    const handleOnChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            handleUploadThumb(file);
        }
    }; // Bắt sự kiện chọn ảnh

    const handleCancelThumb = () => {
        setFile(null);
        setThumbnail(null);
    }; // Hủy thay đổi ảnh bìa

    return (
        <div className="py-5">
            <div
                className={classNames(
                    'flex flex-col items-center justify-center border border-dashed w-full rounded-sm relative py-6',
                    thumbnail && 'bg-green-50',
                    !thumbnail && 'cursor-pointer',
                )}
                onDrop={handleDrop}
            >
                {thumbnail && (
                    <div className="cursor-pointer" onClick={handleCancelThumb}>
                        <CloseCircleOutlined className="absolute text-gray-500 -right-2 -top-2 text-xl" />
                    </div>
                )}

                {isLoadingUpload ? (
                    <>
                        <LoadingOutlined className="text-2xl" />
                        <p className="my-3">{file?.name || 'opacity-0 absolute inse.png'}</p>
                        <Progress className="px-6" percent={50} status="active" />
                    </>
                ) : (
                    <div className={classNames(thumbnail && 'hidden')}>
                        <input
                            onChange={handleOnChange}
                            className="opacity-0 absolute inset-0 cursor-pointer"
                            title="Chọn hình ảnh bìa khóa học"
                            accept=".jpg,.jpeg,.png,.gif"
                            type="file"
                        />
                        <img className="mx-auto" src={uploadImageSvg} alt="" />
                        <p className="mb-1">Upload a file or drag and drop</p>
                        <p className="text-xs text-center">PNG, JPG, GIF up to 10MB</p>
                    </div>
                )}

                {thumbnail && (
                    <div className={classNames('w-full flex flex-col items-center justify-center')}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-5 h-5 bg-[#31c48d] flex items-center justify-center rounded-full">
                                <CheckOutlined className="text-white" />
                            </div>
                            <span className="font-bold text-green-600">Upload Success</span>
                        </div>
                        <div className="w-72 truncate" onClick={() => clipboard(thumbnail?.url)}>
                            <span className="font-medium">URL hình ảnh: </span>
                            <span
                                className="font-semibold hover:text-blue-500 active:text-blue-800 cursor-pointer"
                                title="Sao chép URL"
                            >
                                {thumbnail?.url}
                            </span>
                        </div>
                        <div className="w-72 truncate">
                            <span className="font-medium">Định dạng: </span>
                            <span className="font-semibold uppercase">{thumbnail?.format}</span>
                        </div>
                        <div className="w-72 truncate">
                            <span className="font-medium">Kích thước: </span>
                            <span className="font-semibold">
                                {thumbnail?.width}x{thumbnail?.height}
                            </span>
                        </div>
                        <div className="w-72 truncate">
                            <span className="font-medium">Kích thước hình ảnh: </span>
                            <span className="font-semibold">{convertBytesToReadableSize(thumbnail?.bytes)}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-center !h-[180px] rounded-sm border border-dashed overflow-hidden mt-8">
                <Image
                    width={course ? 'auto' : 130}
                    className="w-full"
                    src={thumbnail ? thumbnail?.url : course ? course.thumb : 'https://i.imgur.com/e1z9NPh.jpeg'}
                    alt=""
                />
            </div>
        </div>
    );
};

export default UploadThumbCourse;
