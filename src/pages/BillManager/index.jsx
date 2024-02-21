import { Breadcrumb, Image, Table, Button, Space, Input } from 'antd';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Highlighter from 'react-highlight-words';
import { useEffect, useRef, useState } from 'react';


const BillManager = () => {
    const [isloading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [tableParams, setTableParams] = useState({
        pagination:{
            current: 1,
            pageSize: 10,
        },
    });

    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) =>{
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) =>{
        clearFilters();
        setSearchText('');
    };

    const getColumnsSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
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
                        icon={''}
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
                            confirm({ closeDropdown: false});
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button type="link" size="small" onClick={() => close()}>
                        Close
                    </Button>
                </Space>    
            </div>            
        ),
        filterIcon: (filtered) => (
            <FontAwesomeIcon
                icon={faSearch}
                style={{ color: filtered ? '#1890ff' : undefined }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
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
        fetch('https://jsonplaceholder.typicode.com/users').then((res) =>
            res.json().then((data) => {
                setData(data);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200,
                    },
                });
            }),
        );
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled Bill',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

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

    const columns = [
        {
            title: 'Mã hoá đơn',
            dataIndex: 'id',
            width: '20%',
            ...getColumnsSearchProps('id'),
        },
        {
            title: 'Tên khoá học',
            dataIndex: 'name',
            key: 'name',
            ...getColumnsSearchProps('name'),
            width: '20%',
            sorter: (a, b) => a.title.length - b.title.length,
        },
        {
            title: 'Số lượng',
            dataIndex: 'id',
            width: '20%',
            onFilter: (value, record) => record.title.includes(value),
            sorter: (a, b) => a.title.length - b.title.length,
        },

        {
            title: 'Hình Ảnh',
            dataIndex: 'img',
            width: '20%',
            render: () => <Image src="https://picsum.photos/150/150" />,
        },
        {
            title: 'Chi tiết',
            dataIndex: 'desc',
            width: '20%',
            render: () => (
                <>
                    <Space>
                        <Button type="primary">Xem</Button>
                    </Space>
                </>
            ),
        },

    ];
    return (
        <>
            <div className="w-full">
                <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: 'Quản lý hoá đơn' }, { title: 'Danh sách hoá đơn' }]} />

                <Table
                    className="bg-white p-3 rounded"
                    pagination={tableParams.pagination}
                    rowSelection={{ ...rowSelection }}
                    dataSource={data}
                    columns={columns}
                    rowKey={(record) => record.id}
                    loading={isloading}
                    title={() => {
                        return <p style={{ fontWeight: 600, fontSize: '20px' }}>Danh sách hoá đơn</p>;
                    }}
                    onChange={handleTableChange}
                />
            </div>
        </>
    );
};

export default BillManager;
