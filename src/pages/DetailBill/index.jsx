/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Breadcrumb, Card, Row, Col, Descriptions, Button } from 'antd';
import { useParams } from 'react-router-dom';
import { useGetBillByIdQuery } from '@/providers/apis/billApi';
import { formatMoneyInt } from '@/lib/utils';

const DetailBill = () => {
    const { id } = useParams();
    const { data: billDetail } = useGetBillByIdQuery(id);
    const [courseData, setCourseData] = useState({});
    const [userData, setUserData] = useState({});
    const [categoryData, setCategoryData] = useState({});

    const [billData, setBillData] = useState([]);

    useEffect(() => {
        if (billDetail?.data) {
            const { course_info, user_info, category_info, ...rest } = billDetail.data;
            setCourseData(course_info);
            setUserData(user_info);
            setCategoryData(category_info);
            setBillData(rest);
        }
    }, [billDetail]);

    const userItems = [
        {
            key: 1,
            label: 'Họ Tên',
            children: userData?.full_name,
        },
        {
            key: 2,
            label: 'Số Điện Thoại',
            children: userData?.phone,
        },
        {
            key: 3,
            label: 'Email',
            children: userData?.email,
        },
    ];

    const courseItems = [
        {
            key: 1,
            label: 'Tên khóa học',
            children: courseData?.name,
        },

        {
            key: 2,
            label: 'Giá thành',
            children: formatMoneyInt(courseData?.price) + 'đ',
        },
        {
            key: 3,
            label: 'Loại',
            children: categoryData?.name,
        },
        {
            key: 4,
            label: 'Mô tả',
            children: courseData?.description,
        },
    ];

    const billItems = [
        {
            key: 1,
            label: 'Mã giao dịch',
            children: billData?.transaction_id,
        },
        {
            key: 2,
            label: 'Tổng số tiền',
            children: formatMoneyInt(billData?.amount) + 'đ',
        },

        {
            key: 3,
            label: 'Liên kết',
            children: <Button href={billData?.payment_url}>Kiểm tra</Button>,
        },
        {
            key: 4,
            label: 'Trạng Thái giao dịch',
            children: billData?.status_message,
        },
        {
            key: 5,
            label: 'Nội dung giao dịch',
            children: billData?.transaction_content,
        },
    ];

    return (
        <div className="w-full">
            <Breadcrumb
                className="mb-5"
                items={[
                    {
                        title: 'Trang chủ',
                    },
                    {
                        href: '/manager-bills',
                        title: 'Hóa đơn',
                    },
                    {
                        title: 'Thông tin hóa đơn',
                    },
                ]}
            />
            <div className="relative p-[5px] mt-[100px]">
                <Row className="h-[550px]" gutter={[16, 16]}>
                    <Col span={14}>
                        <Card>
                            <CourseInfo items={courseItems} />
                        </Card>
                        <BillInfo items={billItems} />
                    </Col>
                    <Col span={10}>
                        <Card>
                            <UserInfo items={userItems} />
                        </Card>
                        <Button type="primary" href="/manager-bills" className=" font-bold mt-12" size="large">
                            Quay về
                        </Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

const UserInfo = ({ items }) => <Descriptions layout="vertical" title="Thông tin người mua" items={items} />;

const CourseInfo = ({ items }) => <Descriptions layout="vertical" title="Thông tin giao dịch" items={items} />;

const BillInfo = ({ items }) => <Descriptions size="small" className="bg-white" bordered items={items} />;
export default DetailBill;
