import React from 'react';
import { Breadcrumb, Button, Card, Image, Table } from 'antd';
import { useParams } from 'react-router-dom';

const DetailComment = () => {
    const {id} = useParams()
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Content', dataIndex: 'content', key: 'content' },
        { title: 'User\'s name', dataIndex: 'user_name', key: 'user_name' },
        { title: 'Avatar', dataIndex: 'avatar', key: 'avatar' },
        { title: 'Time', dataIndex: 'time', key: 'time' },
        { title: '', dataIndex: 'action', key: 'action' },
    ];
    const data = [
        {
            id: 1,
            content:"Quá đã =]]",
            user_name: 'Unknown Person',
            avatar: <Image width={'20%'} src="https://picsum.photos/200"/>,
            time:"20/1/2024",
            action: <Button danger>Delete</Button>
        },
        {
            id: 2,
            content:"Quá hay <3",
            user_name: 'Unknown Person 2',
            avatar: <Image width={'20%'} src="https://picsum.photos/200"/>,
            time:"20/1/2024",
            action: <Button danger>Delete</Button>
        }
    ];
    const newData = data.filter((item)=>item.id == id)
    return (
            <div className='w-full'>
            <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: 'Quản lý bình luận' }]} />
            <Card title="Comment Management">
                <Table dataSource={newData} columns={columns}/>
            </Card>   
            </div>    
    );
};

export default DetailComment;
