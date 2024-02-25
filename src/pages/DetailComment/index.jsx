import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Card, Image, Table } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const DetailComment = () => {
    const [data, setData] = useState([]);
    const navi = useNavigate();
    const fetchData = () => {
        fetch('https://jsonplaceholder.typicode.com/comments')
            .then((response) => response.json())
            .then((json) => setData(json.slice(0, 10)));
    };
    useEffect(() => {
        fetchData();
    }, []);
    const { id } = useParams();
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Content', dataIndex: 'content', key: 'body' },
        { title: 'User', dataIndex: 'email', key: 'email' },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: () => <Image width={'20%'} src="https://picsum.photos/200" />,
        },
        { title: 'Time', dataIndex: 'time', key: 'time', render: () => <p>20/1/2024</p> },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (_, { id }) => (
                <Button danger onClick={() => confirm('Sure?') && onHandleDelete(id)}>
                    Delete
                </Button>
            ),
        },
    ];
    const newData = data.filter((item) => item.id == id);
    const onHandleDelete = (id) => {
        fetch(`https://jsonplaceholder.typicode.com/comments/${id}`, {
            method: 'DELETE',
        }).then(() => {
            navi(-1), alert('Remove successfully!');
        });
    };
    return (
        <div className="w-full">
            <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: 'Quản lý bình luận' }]} />
            <Card title="Comment Management">
                <Table dataSource={newData} columns={columns} />
            </Card>
        </div>
    );
};

export default DetailComment;
