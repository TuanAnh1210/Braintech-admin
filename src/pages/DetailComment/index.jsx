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
        { title: 'Content', dataIndex: 'content', key: 'content' },
        { title: 'User', dataIndex: 'email', key: 'email' },
        { title: 'Name', dataIndex: 'user', key: 'user' },
        { title: 'Time', dataIndex: 'date', render(data) {
            return (
                <div>
                    <p>{data?.split("T")[0]}</p>
                </div>
            );
        }},
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (_, { _id }) => (
                <Button danger onClick={() => onHandleDelete(_id)}>
                    Delete
                </Button>
            ),
        },
    ];
    const onHandleDelete = (id) => {
        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
          }).then((result) => {
            if (result.isConfirmed) {
                    axios.delete(`http://localhost:8080/api/comments/${id}`)
                    .then(()=>{
                        navi(-1)
                        Swal.fire("Saved!", "", "success")
                    })
                    .catch(error=>console.log("ERROR_DELETE:",error))
            } else if (result.isDenied) {
              Swal.fire("Changes are not saved", "", "info");
            }
          })
    };
    return (
        <div className="w-full">
            <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: 'Quản lý bình luận' }]} />
            <Card title="Comment Management">
                <Table dataSource={Array(data)} columns={columns} />
            </Card>
        </div>
    );
};

export default DetailComment;
