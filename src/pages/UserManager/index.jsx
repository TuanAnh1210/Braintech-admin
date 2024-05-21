/* eslint-disable react-hooks/exhaustive-deps */
import { Breadcrumb, Button, Image, Input, Space, Table, Modal, Select, notification } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Highlighter from 'react-highlight-words';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useUpdateRoleQuery, useGetUsersQuery, useGetUserQuery, useGetTeachersQuery } from '@/providers/apis/userApi';

const UserManager = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState('');
    const [data, setData] = useState();
    const { data: users } = useGetTeachersQuery()
    console.log(users);
    const [valueData, setValueData] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 6,
        },
    });
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

    const fetchData = () => {
        setLoading(true);
        fetch(import.meta.env.VITE_REACT_APP_API_PATH + 'api/user/all/students')
            .then((res) => res.json())
            .then(({ data }) => {
                setData(data);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200,
                    },
                });
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };
    const onHandleDelete = async (id) => {
        console.log(id);
        Swal.fire({
            title: 'Học viên này sẽ bị xóa!!',
            text: 'Bạn có chắc muốn xóa học viên này chứ ?',
            showDenyButton: true,
            confirmButtonText: 'Xóa',
            showConfirmButton: true,
            denyButtonText: `Hủy`,
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(import.meta.env.VITE_REACT_APP_API_PATH + 'api/user/delete/' + id)
                    .then(() => {
                        fetchData();
                        Swal.fire('Xóa thành công!', '', 'success');
                    })
                    .catch((error) => console.log('ERROR_DELETE:', error));
            } else if (result.isDenied) {
                Swal.fire('Hủy thành công', '', 'info');
            }
        });
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        console.log(valueData);
        try {
            if (valueData === "true") {

                const userUpdate = {
                    ...user,
                    isAdmin: true,
                    isTeacher: true,
                };

                await axios.put(`http://localhost:8080/api/user/update/${user?._id}`, userUpdate).then(() => {
                    notification.success({
                        message: 'Thông báo',
                        description: 'Vai trò của tài khoản đã thay đổi!',
                        duration: 1.75,
                    });

                    fetchData()
                })

                setIsModalOpen(false);
            } return;
        } catch (error) {
            console.log(error);
        }
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onA = (id) => {
        const user = data?.find(i => i._id === id)
        setUser(user)
    }
    const handleChange = (value) => {
        setValueData(value)

    };
    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'avatar',
            render: (picture) => {
                return <Image width={40} className="rounded-full" src={picture} alt="" />;
            },
        },
        {
            title: 'Họ Tên',
            dataIndex: 'full_name',
            key: 'full_name',
            sorter: true,
            ...getColumnSearchProps('full_name'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: true,
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Thao tác',
            dataIndex: '_id',
            render: (id) => {
                return (
                    <div className="flex gap-3">
                        <>
                            <Button type="primary" onClick={showModal}>
                                Chỉnh sửa
                            </Button>
                            <Modal title="Vai trò" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} maskClosabler={true}>
                                <Space wrap>
                                    <Select
                                        defaultValue="Học viên"
                                        style={{
                                            width: 150,
                                        }}
                                        onClick={onA(id)}
                                        onChange={handleChange}
                                        options={[
                                            {
                                                value: 'true',
                                                label: 'Giảng viên',
                                            },
                                        ]}
                                    />
                                </Space>
                            </Modal>
                        </>
                        <Button danger onClick={() => onHandleDelete(id)}>
                            Xóa
                        </Button>
                    </div>
                );
            },
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
                        title: 'Tài khoản',
                    },
                    {
                        title: 'Quản lý học viên',
                    },
                ]}
            />

            <div className="overflow-x-auto min-w-[20px]">
                <Table
                    style={{ overflowX: 'auto' }}
                    className="bg-white p-3 rounded"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    title={() => {
                        return <p style={{ fontWeight: 600, fontSize: '20px' }}>Danh sách học viên</p>;
                    }}
                    onChange={handleTableChange}
                />
            </div>
        </div>
    );
};

export default UserManager;
