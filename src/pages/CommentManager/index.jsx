import { Breadcrumb, Button, Card, Table } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CommentManager = () => {
    const [data, setData] = useState([])
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 6,
        },
    });
    const fetchData = () => {
        fetch('http://localhost:8080/api/comments')
            .then((res) => res.json())
            .then(({ data }) => {
                setData(data);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200,
                    },
                });
            });
    }
    useEffect(() => {
        fetchData()
    }, [])
    const handleTableChange = (pagination) => {
        setTableParams({
            pagination
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    const columns = [
        { title: 'Tên bài học', dataIndex: 'lessonName', key: 'lessonName' },
        { title: 'Tổng số bình luận', dataIndex: 'totalComments', key: 'totalComments' },
        { title: 'Chi tiết bình luận', dataIndex: 'detail', key: 'detail', render: (_, { _id }) => (<Link to={`/manager-comments/${_id}`}><Button type="primary">Chi tiết</Button></Link>) },
    ];

    return (
        <div className='w-full'>
            <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: 'Quản lý bình luận' }]} />
            <Card title="Quản lý bình luận">
                <Table dataSource={data} columns={columns} onChange={handleTableChange} />
            </Card>
        </div>
    );
};

export default CommentManager;
