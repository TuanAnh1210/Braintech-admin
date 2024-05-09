import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Card, Image, Table, notification } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useGetCoursesTeacherQuery, useDeleteCourseTeacherMutation, useGetAllCoursesQuery } from '@/providers/apis/courseTeacherApi';


const DetailTeacher = () => {
    const { id } = useParams();
    const { data: courses } = useGetCoursesTeacherQuery(id)
    const { data: coursesAll = [], isLoading } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
    const [handler] = useDeleteCourseTeacherMutation(id)
    const navi = useNavigate();
    const onHandleDelete = async (id) => {
        Swal.fire({
            title: 'Khóa học này sẽ bị xóa!!',
            text: 'Bạn có chắc muốn xóa khóa học này chứ ?',
            showDenyButton: true,
            confirmButtonText: 'Xóa',
            showConfirmButton: true,
            denyButtonText: `Hủy`,
        }).then((result) => {
            if (result.isConfirmed) {
                handler(id).then(() => {
                    navi(-1)
                    Swal.fire("Saved!", "", "success")
                })
            } else if (result.isDenied) {
                Swal.fire('Hủy thành công', '', 'info');
            }
        });
    };
    const onHandleChange = async (idCourse) => {
        try {
            Swal.fire({
                title: 'Quản lý khóa học này!!',
                text: 'Bạn có chắc chắn không ?',
                showDenyButton: true,
                confirmButtonText: 'Quản lý',
                showConfirmButton: true,
                denyButtonText: `Hủy`,
            }).then((result) => {
                if (result.isConfirmed) {
                    const courseUpdate = coursesAll?.find(item => item._id === idCourse)
                    console.log(courseUpdate);
                    const update = {
                        ...courseUpdate,
                        teacherId: [...courseUpdate?.teacherId, id]
                    }

                    axios.put(`http://localhost:8080/api/courses_teacher/update/${courseUpdate._id}`, update).then(() => {
                        Swal.fire("Saved!", "", "success")

                    })
                } else if (result.isDenied) {
                    Swal.fire('Hủy thành công', '', 'info');
                }
            });

        } catch (error) {
            console.log(error);
        }
    }
    const column1 = [
        {
            title: 'Hình ảnh',
            dataIndex: 'thumb',
            render: (thumb) => {
                return (
                    <div className="w-24">
                        <Image className="w-24 rounded-md" src={thumb} />
                    </div>
                );
            },
        },
        { title: 'Tên khóa học', dataIndex: 'name', key: 'name' },
        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'updatedAt' },
        {
            title: 'Hành dộng',
            dataIndex: 'action',
            key: 'action',
            render: (_, { _id }) => (
                <Button danger onClick={() => onHandleDelete(_id)}>
                    Xóa
                </Button>
            ),
        },
    ];
    const column2 = [
        {
            title: 'Hình ảnh',
            dataIndex: 'thumb',
            render: (thumb) => {
                return (
                    <div className="w-24">
                        <Image className="w-24 rounded-md" src={thumb} />
                    </div>
                );
            },
        },
        { title: 'Tên khóa học', dataIndex: 'name', key: 'name' },
        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'updatedAt' },
        {
            title: 'Hành dộng',
            dataIndex: 'action',
            key: 'action',
            render: (_, { _id }) => (
                <Button danger onClick={() => onHandleChange(_id)} type="primary">
                    Quản lý
                </Button>
            ),
        },
    ];

    return (
        <div className="w-full">
            <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: 'Quản lý giảng viên' }, { title: 'Chi tiết' }]} />
            <Card title="Các khóa học đang quản lý" style={{ fontWeight: 600, fontSize: '20px' }}>
                <Table dataSource={courses} columns={column1} />

            </Card>
            <Card title="Khóa học có thể tham gia quản lý" className='mt-[20px] text-[20px]' >
                <Table dataSource={coursesAll} columns={column2} />

            </Card>
        </div>
    );
};

export default DetailTeacher;
