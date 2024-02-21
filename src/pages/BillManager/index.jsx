import { Breadcrumb, Image, Table, Button, Space } from 'antd';
import React from 'react';

const BillManager = () => {
    const [isloading, setLoading] = React.useState(false);
    const [data, setData] = React.useState([]);
    const fetchData = () => {
        setLoading(true);
        fetch('https://jsonplaceholder.typicode.com/users').then((res) =>
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
            title: 'Mã hoá đơn',
            dataIndex: 'id',

        },
        {
            title: 'Tên khoá học',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            sorter: (a, b) => a.title.length - b.title.length,
        },
        {
            title: 'Số lượng',
            dataIndex: 'id',
            width: '20%',
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
                        <Button type="primary">Xem</Button>
                    </Space>
                </>
            ),
        },

    ];
    return (
        <>
            <div className="w-full">
                <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: 'Quản lý hoá đơn' }, { title: 'Danh sách hoá đơn' }]} />

                <Table
                    className="bg-white p-3 rounded"
                    rowSelection={{ ...rowSelection }}
                    dataSource={data}
                    columns={columns}
                    rowKey={(record) => record.id}
                    loading={isloading}
                    title={() => {
                        return <p style={{ fontWeight: 600, fontSize: '20px' }}>Danh sách hoá đơn</p>;
                    }}
                />
            </div>
        </>
    );
};

export default BillManager;
