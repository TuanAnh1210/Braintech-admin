import React, { useEffect, useRef, useState } from 'react';
import { Breadcrumb, Button, Card, Image, Input, Space, Table, notification } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useGetAllCoursesQuery, useGetCoursesTeachersQuery } from '@/providers/apis/courseTeacherApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Highlighter from 'react-highlight-words';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


const DetailTeacher = () => {
    const { id } = useParams();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [loading, setLoading] = useState(false);
    const { data: courses } = useGetCoursesTeachersQuery(id)
    const [data1, setData] = useState([]);
    const { data: coursesAll = [], isLoading, refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
    const navi = useNavigate();

    const fetchData = () => {
        setLoading(true);
        fetch(`http://localhost:8080/api/courses_teacher/teacher/${id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.courses);
                setData(data.courses);
                setLoading(false);

            });
    };

    useEffect(() => {
        fetchData();
    }, []);
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    spellCheck={false}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={''} // <SearchOutlined />
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button type="link" size="small" onClick={() => close()}>
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <FontAwesomeIcon
                icon={faSearch}
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) setTimeout(() => searchInput.current?.select(), 100);
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const onHandleDelete = async (ids) => {
        Swal.fire({
            title: 'Quyền quản lý khóa học!!',
            text: 'Bạn có chắc muốn bỏ quản lý khóa học này chứ ?',
            showDenyButton: true,
            confirmButtonText: 'Xóa',
            showConfirmButton: true,
            denyButtonText: `Hủy`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const a = coursesAll?.find(item => item._id === ids)
                const update = { ...a, teacherId: a.teacherId.filter(role => role !== id) }
                console.log(update);
                await axios.put(`http://localhost:8080/api/courses_teacher/update/${a._id}`, update).then(() => {
                    fetchData()
                    refetch()

                    Swal.fire("Saved!", "", "success")
                })
            } else if (result.isDenied) {
                Swal.fire('Hủy thành công', '', 'info');
            }
        });
    };
    const result = coursesAll.filter(item => {
        return item.teacherId.every(role => role !== id);
    });
    console.log(1, result);

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

                    const update = {
                        ...courseUpdate,
                        teacherId: [...courseUpdate?.teacherId, id]
                    }

                    axios.put(`http://localhost:8080/api/courses_teacher/update/${courseUpdate._id}`, update).then(() => {
                        refetch()
                        fetchData();
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
        { title: 'Tên khóa học', dataIndex: 'name', key: 'name', ...getColumnSearchProps('name'), },
        {
            title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', ...getColumnSearchProps('createdAt'), render: (updatedAt) => {
                const formattedDate = format(updatedAt, 'dd/MM/yyyy');
                const formattedTime = format(updatedAt, 'HH:mm:ss');
                return <div>{`${formattedDate}  - ${formattedTime}`}</div>;
            },
        },
        {
            title: 'Hành dộng',
            dataIndex: 'action',
            key: 'action',
            render: (_, { _id }) => (
                <Button danger onClick={() => onHandleDelete(_id)}>
                    Hủy quyền
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
        { title: 'Tên khóa học', dataIndex: 'name', key: 'name', ...getColumnSearchProps('name') },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            ...getColumnSearchProps('createdAt'),
            render: (updatedAt) => {
                const formattedDate = format(updatedAt, 'dd/MM/yyyy');
                const formattedTime = format(updatedAt, 'HH:mm:ss');
                return <div>{`${formattedDate}  - ${formattedTime}`}</div>;
            },
        },
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
                <Table dataSource={data1} columns={column1} />

            </Card>

            <Card title="Khóa học có thể tham gia quản lý" className='mt-[20px] text-[20px]' >
                <Table dataSource={result} columns={column2} />

            </Card>

        </div>
    );
};

export default DetailTeacher;
