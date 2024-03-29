import { Breadcrumb, Image, Table, Button, Space } from 'antd';
import React from 'react';

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
            width: '20%',
            sorter: (a, b) => a.title.length - b.title.length,

            render: (title) => (
                <>
                    <h5>{title}</h5>
                </>
            ),
        },
        {
            title: 'Chủ đề',
            dataIndex: 'title',
            width: '20%',
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
            width: '20%',
            render: () => <Image src="https://picsum.photos/150/150" />,
        },
        {
            title: 'Chi tiết',
            dataIndex: 'desc',
            width: '20%',
            render: () => (
                <>
                    <Space>
                        <Button type="primary">Kiểm tra</Button>
                    </Space>
                </>
            ),
        },
        {
            title: 'Thao tác',
            dataIndex: 'cell',
            width: '20%',
            render: () => (
                <Space>
                    <Button type="primary">Cập nhật </Button>
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
