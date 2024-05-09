import React, { useState } from 'react';
import { TreeSelect, notification } from 'antd';
import { useGetUsersQuery } from '@/providers/apis/userApi';
import axios from 'axios';
const { SHOW_PARENT } = TreeSelect;

const ItemTeacher = ({ data, idUser }) => {
    const [value, setValue] = useState(['0-0-0']);

    const { data: user } = useGetUsersQuery()

    const treeData = data?.map(item => {
        return {
            title: item.name,
            value: item._id,
            key: item._id
        }
    })


    const onChange = (newValue) => {
        try {
            setValue(newValue);
            console.log(value);
            const userMap = user?.data?.find(item => item._id === idUser)
            const updateUser = {
                ...userMap,
                course_id: value
            }

            // axios.put(`http://localhost:8080/api/user/update/${idUser}`, updateUser).then(() => {
            //     notification.success({
            //         message: 'Thông báo',
            //         description: "Vai trò của tài khoản đã thay đổi!",
            //         duration: 1.75,
            //     });

            // })
        } catch (error) {
            console.log(error);
        }

    };
    const tProps = {
        treeData,
        value,
        onChange,
        treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        placeholder: 'Quanr lý khóa học',
        style: {
            width: '100%',
        },
    };
    return <TreeSelect {...tProps} />;
};
export default ItemTeacher;