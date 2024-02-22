import React from 'react';
import { Breadcrumb, Button, Card, Table } from 'antd';
import { Link } from 'react-router-dom';

const CommentManager = () => {
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Course Name', dataIndex: 'course_name', key: 'course_name' },
        { title: 'Total', dataIndex: 'total', key: 'total' },
        { title: 'Detail', dataIndex: 'detail', key: 'detail' },
    ];
    const data = [
        {
            id: 1,
            course_name: 'Mô hình Client - Server là gì?',
            total: 1,
            detail: <Link to={`/manager-comments/1`}><Button type="primary">See detail</Button></Link>
        },
        {
            id: 2,
            course_name: 'Tìm hiểu về HTML, CSS',
            total: 1,
            detail: <Link to={`/manager-comments/2`}><Button type="primary">See detail</Button></Link>
        }
    ];
    return (
            <div className='w-full'>
            <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: 'Quản lý bình luận' }]} />
            <Card title="Comment Management">
                <Table dataSource={data} columns={columns}/>
            </Card>   
            </div>    
    );
};

export default CommentManager;
