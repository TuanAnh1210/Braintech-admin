import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Card, Image, Table } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const DetailComment = () => {
    const [data, setData] = useState([]);
    const { id } = useParams();
    const navi = useNavigate();
    const fetchData = () => {
        fetch(`http://localhost:8080/api/comments/${id}`)
            .then((res) => res.json())
            .then(({ data }) => {

                setData(data);
            });
    };
    useEffect(() => {
        fetchData();
    }, []);
    const columns = [
        { title: 'Khóa học', dataIndex: 'lessonName', key: 'lessonName' },
        { title: 'Nội dung', dataIndex: 'text', key: 'text' },
        { title: 'Tên người dùng', dataIndex: 'user', key: 'user' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (_, { _id }) => (
                <Button danger onClick={() => onHandleDelete(_id)}>
                    Xóa
                </Button>
            ),
        },
    ];
    const onHandleDelete = (id) => {
        Swal.fire({
            title: "Bạn có chắc muốn xóa bình luận này?",
            showCancelButton: true,
            confirmButtonText: "Save",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8080/api/comments/${id}`)
                    .then(() => {
                        navi(-1)
                        Swal.fire("Saved!", "", "success")
                    })
                    .catch(error => console.log("ERROR_DELETE:", error))
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        })
    };
    return (
        <div className="w-full">
            <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: 'Quản lý bình luận' }]} />
            <Card title="Quản lý bình luận">
                <Table dataSource={Array(data)} columns={columns} />
            </Card>
        </div>
    );
};

export default DetailComment;
