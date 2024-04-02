/* eslint-disable react-hooks/exhaustive-deps */
import { Breadcrumb, Button, Image, Input, Space, Table } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Highlighter from 'react-highlight-words';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function UserManager() {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
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
        fetch(`http://localhost:8080/api/user`)
            .then((res) => res.json())
            .then(({ data }) => {
                setData(data);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200,
                        // 200 is mock data, you should read it from server
                        // total: data.totalCount,
                    },
                });
            });
    };

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
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

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };
    const onHandleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            try {
                const response = await axios.delete(`http://localhost:8080/api/user/delete/${id}`);
                if (response.status == 200) {
                    alert('Successfull');
                    fetchData();
                }
            } catch (error) {
                console.log('ERROR_DELETE:', error);
            }
        }
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
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: true,
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Thao tác',
            dataIndex: '_id',
            render: (id) => {
                return (
                    <div className="flex gap-3">
                        {/* <Button type="primary">Cập nhật</Button> */}
                        <Button danger onClick={() => onHandleDelete(id)}>
                            Khóa
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
                        title: 'Quản lý tài khoản',
                    },
                ]}
            />

            <div className="overflow-x-auto min-w-[20px]">
                <Table
                    style={{ overflowX: 'auto' }}
                    className="bg-white p-3 rounded"
                    columns={columns}
                    rowSelection={{
                        ...rowSelection,
                    }}
                    dataSource={data}
                    pagination={tableParams.pagination}
                    loading={loading}
                    title={() => {
                        return <p style={{ fontWeight: 600, fontSize: '20px' }}>Danh sách tài khoản</p>;
                    }}
                    onChange={handleTableChange}
                />
            </div>
        </div>
    );
}

export default UserManager;
