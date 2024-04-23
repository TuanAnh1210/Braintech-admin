import React, { useEffect, useState } from 'react';
import { Breadcrumb, Card, Table } from 'antd';
import { useParams } from 'react-router-dom';
import { dataBill } from '../BillManager';

const DetailBill = () => {
    const [data, setData] = useState([]);
    const [currentCourse, setCurrentCourse] = useState('');
    const { id } = useParams();

    const fetchData = () => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((json) => setData(json.slice(0, 10)));
    };
    useEffect(() => {
        fetchData();
        setCurrentCourse(dataBill.find((bill) => bill.id == id));
    }, []);

    const columns = [
        { title: 'STT', dataIndex: 'id', key: 'id' },
        { title: 'User', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Time', dataIndex: 'time', key: 'time', render: () => <p>20/1/2024</p> },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: () => <p>Thanh toán khoá học lập trình C cơ bản</p>,
        },
        { title: 'code bill', dataIndex: 'codebill', key: 'codebill' },
    ];
    const newData = data.filter((item) => item.id == currentCourse.id);
    return (
        <div className="w-full">
            <Breadcrumb
                className="mb-5"
                items={[
                    {
                        title: 'Trang chủ',
                    },
                    {
                        title: 'Bill Manager',
                    },
                ]}
            />
            <div className=" relative p-[5px] mt-[100px] ">
                <div className="static">
                    <div className="bg-gray-600 flex justify-between absolute top-0 left-0  w-[95%] sm:h-32 md:h-32 h-[105px] ml-[30px] p-[15px] rounded ">
                        <div className="">
                            <h4 className="text-white xl:text-[25px] lg:text-[25px] sm:text-[18px] md:text-[18px] mt-[10px] mb-[5px]">
                                Hoá đơn: {currentCourse.name}
                            </h4>
                            <p className="text-white pb-[20px] mr-[20px] sm:text-[15px] md:text-[15px] text-[18px]">
                                Hoá đơn chi tiết
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white mt-[30px]  sm:pt-[100px] md:pt-[150px] pt-[80px] rounded w-full">
                    <div className="px-[30px] ">
                        <Table columns={columns} dataSource={newData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailBill;
