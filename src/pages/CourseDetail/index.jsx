import { Button, Card, Input, Modal, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';

const props = {
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

const CourseDetail = () => {
    const [data, setData] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const { id } = useParams();
    const fetchData = () => {
        fetch(`https://jsonplaceholder.typicode.com/todos/${id}`).then((res) =>
            res.json().then((data) => {
                setData(data);
            }),
        );
    };
    useEffect(() => {
        fetchData();
    }, []);

    if (!data) {
        return (
            <>
                <p>Loading...</p>
            </>
        );
    }
    const [inputData, setInputData] = useState([
        {
            id: 1,
            name: 'Tên Khóa học',
            isChange: false,
            ct: '',
        },
        {
            id: 2,
            name: 'Chủ đề',
            isChange: false,
            ct: '',
        },
        {
            id: 3,
            name: 'Hình ảnh',
            isChange: false,
            ct: 'https://picsum.photos/200/300',
        },
    ]);

    useEffect(() => {
        if (data) {
            setInputData([
                {
                    id: 1,
                    name: 'Tên Khóa học',
                    isChange: false,
                    ct: data.title || '',
                },
                {
                    id: 2,
                    name: 'Chủ đề',
                    isChange: false,
                    ct: data.title || '',
                },
                {
                    id: 3,
                    name: 'Hình ảnh',
                    isChange: false,
                    ct: 'https://picsum.photos/100/100',
                },
            ]);
        }
    }, [data]);
    const handleChange = (id) => {
        setInputData(inputData.map((p) => (p.id === id ? { ...p, isChange: !p.isChange } : p)));
    };

    const handleConfirm = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    return (
        <>
            <Card className="w-full" title="Chi tiết khóa học" size="default">
                <Space
                    title="Chi tiết khóa học"
                    direction="vertical"
                    size="middle"
                    style={{ display: 'flex' }}
                    className="w-full"
                >
                    {inputData.map((p) => {
                        if (p.name !== 'Hình ảnh') {
                            return (
                                <Card title={p.name} size="small" className="" key={p.id}>
                                    {p.isChange ? (
                                        <>
                                            <Input value={p.ct} />
                                            <Button
                                                loading={isLoading}
                                                className="mt-3"
                                                onClick={() => handleChange(p.id)}
                                            >
                                                Xác nhận
                                            </Button>
                                        </>
                                    ) : (
                                        <p onClick={() => handleChange(p.id)}>{p.ct}</p>
                                    )}
                                </Card>
                            );
                        } else {
                            return (
                                <Card title={p.name} size="small" className="" key={p.id}>
                                    {p.isChange ? (
                                        <>
                                            <Input value={p.ct} hidden />
                                            <Upload {...props}>
                                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                            </Upload>
                                            <Button
                                                loading={isLoading}
                                                className="mt-3"
                                                onClick={() => handleChange(p.id)}
                                            >
                                                Xác nhận
                                            </Button>
                                        </>
                                    ) : (
                                        <img onClick={() => handleChange(p.id)} src={p.ct} />
                                    )}
                                </Card>
                            );
                        }
                    })}
                    <div className="flex justify-end gap-5">
                        <Button loading={isLoading} onClick={handleConfirm}>
                            Cập nhật
                        </Button>
                        <Button className="bg-red-800 text-white font-semibold" onClick={showModal}>
                            Xóa
                        </Button>
                        <Modal title="Xóa dữ liệu" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <p className="font-bold text-red-500">Dữ liệu sẽ bị xóa</p>
                        </Modal>
                    </div>
                </Space>
            </Card>
        </>
    );
};

export default CourseDetail;
