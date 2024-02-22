import { Breadcrumb, Button, Card, Table } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CommentManager = () => {
    const [data, setData] = useState([])
    const fetchData = () =>{
        fetch('https://jsonplaceholder.typicode.com/comments')
      .then(response => response.json())
      .then(json => setData(json.slice(0,10)))
    }
    useEffect(()=>{
        fetchData()
    },[])
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Course Name', dataIndex: 'course_name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Detail', dataIndex: 'detail', key: 'detail',render: (_, {id}) => (<Link to={`/manager-comments/${id}`}><Button type="primary">See detail</Button></Link> )},
    ];
    return (
            <div className='w-full'>
            <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: 'Quản lý bình luận' }]} />
            <Card title="Comment Management">
                <Table dataSource={data} columns={columns}/>
            </Card>   
            </div>    
    );
};

export default CommentManager;
