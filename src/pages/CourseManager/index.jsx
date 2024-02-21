import { Breadcrumb, Image, Table, Button, Space, Empty } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const CourseManager = () => {
    const [isloading, setLoading] = React.useState(false);
    const [data, setData] = React.useState([]);
    const fetchData = () => {
        setLoading(true);
        fetch('https://jsonplaceholder.typicode.com/todos').then((res) =>
            res.json().then((data) => {
                setData(data);
                setLoading(false);
            }),
        );
    };
    React.useEffect(() => {
        fetchData();
    }, []);
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
    };
    const columns = [
        {
            title: 'Tên khóa học',
            dataIndex: 'title',
            width: '25%',
            sorter: (a, b) => a.title.length - b.title.length,

            render: (title) => (
                <>
                    <h5>{title}</h5>
                </>
            ),
        },
        {
            title: 'Chủ đề',
            dataIndex: 'title2',
            width: '25%',
            filters: [
                {
                    text: 'BackEnd',
                    value: 'Backend',
                },
                {
                    text: 'Frontend',
                    value: 'Frontend',
                },
                {
                    text: 'Devops',
                    value: 'Devops',
                },
            ],
            render: (title) => (
                <>
                    <h5>Chủ đề {title}</h5>
                </>
            ),
            onFilter: (value, record) => record.title.includes(value),
            sorter: (a, b) => a.title.length - b.title.length,
        },

        {
            title: 'Hình Ảnh',
            dataIndex: 'img',
            width: '25%',
            render: () => <Image src="https://picsum.photos/150/150" />,
        },

        {
            title: 'Thao tác',
            dataIndex: 'id',
            width: '25%',
            render: (id) => (
                <Space>
                    <Link to={`/manager-courses/${id}`}>
                        <Button type="primary">Chi tiết</Button>
                    </Link>
                    <Button danger>Khóa</Button>
                </Space>
            ),
        },
    ];
    return (
        <>
            <div className="w-full">
                <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: 'Quản lý khóa học' }]} />

                <Table
                    className="bg-white p-3 rounded"
                    rowSelection={{ ...rowSelection }}
                    dataSource={data}
                    locale={{ emptyText: <Empty description="Chưa có khóa học" /> }}
                    columns={columns}
                    rowKey={(record) => record.id}
                    loading={isloading}
                    title={() => {
                        return <p style={{ fontWeight: 600, fontSize: '20px' }}>Danh sách khóa học</p>;
                    }}
                />
            </div>
        </>
    );
};

export default CourseManager;
