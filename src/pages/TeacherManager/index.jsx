/* eslint-disable react-hooks/exhaustive-deps */
import {
    Breadcrumb,
    Button,
    Image,
    Input,
    Space,
    Table,
    Popconfirm,
    message,
    Checkbox,
    Divider,
    Select,
    Modal,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Highlighter from 'react-highlight-words';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ItemTeacher from './items';
import { Link } from 'react-router-dom';
import { useGetAllCoursesQuery } from '@/providers/apis/courseTeacherApi';

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];
function TeacherManager() {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 6,
        },
    });
    const { data: courses = [], isLoading } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });

    const searchInput = useRef(null);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const checkAll = plainOptions.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;
    const onChange = (list) => {
        setCheckedList(list);
    };
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? plainOptions : []);
    };

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
        fetch(`http://localhost:8080/api/user/all/teachers`)
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idModal, setIdModal] = useState('');
    const showModal = (id) => {
        setIdModal(id);
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onHandleDelete = async (id) => {
        Swal.fire({
            title: 'Giảng viên này sẽ bị xóa!!',
            text: 'Bạn có chắc muốn xóa giảng viên này chứ ?',
            showDenyButton: true,
            confirmButtonText: 'Xóa',
            showConfirmButton: true,
            denyButtonText: `Hủy`,
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`http://localhost:8080/api/user/delete/${id}`)
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
            sorter: true,
            ...getColumnSearchProps('full_name'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Thao tác',
            dataIndex: '_id',
            render: (id) => {
                return (
                    <div className="">
                        <Link to={`/manager-teachers/${id}`}>
                            <Button type="primary">Chi tiết</Button>
                        </Link>
                        <Button danger onClick={() => onHandleDelete(id)} className="ml-[10px]">
                            Xóa
                        </Button>
                        {/* <div>
                            <>
                                <Button type="primary" onClick={() => showModal(id)}>
                                    Open Modal
                                </Button>
                                <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                                    <ItemTeacher data={courses} idUser={idModal} />
                                </Modal>
                            </>

                        </div> */}
                    </div>
                );
            },
        },
    ];
    const handleChange = (value) => {
        console.log(1, value);
    };
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
                        title: 'Quản lý giảng viên',
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
                        return (
                            <div className="flex items-center justify-between">
                                <p style={{ fontWeight: 600, fontSize: '20px' }}>Danh sách giảng viên</p>
                            </div>
                        );
                    }}
                    onChange={handleTableChange}
                />
            </div>
        </div>
    );
}

export default TeacherManager;
