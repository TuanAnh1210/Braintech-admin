import React, { useEffect, useState } from 'react';
import { Breadcrumb, Card, Table } from 'antd';
import {  useParams } from 'react-router-dom';

const DetailBill = () => {
    const [data, setData] = useState([])
    const fetchData = () => {
        fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(json => setData(json.slice(0,10)))
    }
    useEffect(()=>{
        fetchData()
    },[])
    const {id} = useParams()
    const columns = [
        { title: 'STT', dataIndex: 'id', key: 'id' },
        { title: 'User', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key:'email'},
        { title: 'Time', dataIndex: 'time', key: 'time', render: () => (<p>20/1/2024</p>)},
        { title: 'Content', dataIndex: 'content', key: 'content', render: () => (<p>Thanh toán khoá học lập trình C cơ bản</p>)},
        { title: 'ID', dataIndex: 'id', key: 'id'},
        
    ];
    const newData = data.filter((item)=>item.id == id)

    return (
            <div className='w-full'>
            <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: 'Danh sách hoá đơn ' }, {title: 'Chi tiết hoá đơn'}]} />
            <Card title="Hoá đơn: Lập trình C cơ bản, nâng cao">
                <Table dataSource={newData} columns={columns}/>
            </Card>   
            </div>    
    );
};

export default DetailBill;
