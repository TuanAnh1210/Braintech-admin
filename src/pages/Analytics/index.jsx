import React from 'react';
import { Layout, Table, Card, Row, Col } from 'antd';

const { Content } = Layout;

const Analytics = () => {
    const courseData = [
        {
            id: 1,
            name: 'HTML, CSS Pro',
            price: 120,
            subcribers: 200,
            image: 'https://picsum.photos/64/64',
        },
        {
            id: 2,
            name: 'React Native',
            price: 200,
            subcribers: 100,
            image: 'https://picsum.photos/64/64',
        },
        {
            id: 3,
            name: 'Vue 3 Js',
            price: 210,
            subcribers: 70,
            image: 'https://picsum.photos/64/64',
        },
    ];

    const columnCourse = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        { title: 'Subcribers', dataIndex: 'subcribers', key: 'subcribers' },
    ];

    const totalRevenue = courseData.reduce((total, course) => total + course.subcribers * course.price, 0);
    const totalCourses = courseData.length;
    const totalStudents = courseData.reduce((total, course) => total + course.subcribers, 0);

    return (
        <Layout>
            <Content>
                <Row gutter={[16, 16]} className="mb-6">
                    <Col span={8}>
                        <div style={{ background: '#fff', padding: 24, textAlign: 'center' }}>
                            <h3 className="text-2xl text-teal-600">Total Revenue</h3>
                            <p className="text-base font-bold">$ {totalRevenue}</p>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ background: '#fff', padding: 24, textAlign: 'center' }}>
                            <h3 className="text-2xl text-orange-600">Total Courses</h3>
                            <p className="text-base font-bold">{totalCourses}</p>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ background: '#fff', padding: 24, textAlign: 'center' }}>
                            <h3 className="text-2xl text-sky-600">Total Students</h3>
                            <p className="text-base font-bold">{totalStudents}</p>
                        </div>
                    </Col>
                </Row>
                <Card title="Course Statistics">
                    <Table dataSource={courseData} columns={columnCourse} />
                </Card>
            </Content>
        </Layout>
    );
};

export default Analytics;
