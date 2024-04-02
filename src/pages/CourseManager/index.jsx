/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Breadcrumb, Image, Table, Button, Space, Empty, Input } from 'antd';
import Highlighter from 'react-highlight-words';
import classNames from 'classnames';
import React from 'react';

import { useGetCoursesQuery } from '@/providers/apis/courseApi';
import { useGetCateQuery } from '@/providers/apis/cateApi';

import ModalDeleteCourse from './ModalDeleteCourse';
import ModalUpdateCourse from './ModalUpdateCourse';
import ModalCreateCourse from './ModalCreateCourse';
import DrawerChapters from './DrawerChapters';

import { formatMoneyInt } from '@/lib/utils';

const CourseManager = () => {
    const [course, setCourse] = React.useState(null);
    const [searchText, setSearchText] = React.useState('');
    const [searchedColumn, setSearchedColumn] = React.useState('');
    const searchInput = React.useRef(null);

    const { data: courses = [], isLoading } = useGetCoursesQuery();
    const { data: categories = [] } = useGetCateQuery();

    const categoriesFormat = categories.map((c) => ({ _id: c._id, text: c.name, value: c.code }));

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

    const rowSelection = {
        // onChange: (selectedRowKeys, selectedRows) => {
        //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        // },
    };

    const columns = [
        {
            title: 'Tên khóa học',
            dataIndex: 'name',
            width: '25%',
            render: (name) => <h5 className="font-medium">{name}</h5>,
            ...getColumnSearchProps('name'),
        },
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
        {
            title: 'Chủ đề',
            dataIndex: 'cate_id',
            filters: categoriesFormat,
            render: (cate_id) => {
                return <h5>{cate_id.name}</h5>;
            },
            onFilter: (value, record) => record.cate_id.code === value,
        },
        {
            title: 'Bài học',
            dataIndex: 'chapters',
            render: (chapters) => {
                return <div>{chapters.length}</div>;
            },
        },
        {
            title: 'Giá cũ',
            dataIndex: 'old_price',
            sorter: (a, b) => a.old_price - b.old_price,
            render: (old_price) => {
                return (
                    <div className={classNames(old_price === 0 ? 'text-green-600' : 'text-red-600')}>
                        {old_price === 0 ? 'Miễn phí' : <del>{formatMoneyInt(old_price) + 'đ'}</del>}
                    </div>
                );
            },
        },
        {
            title: 'Giá mới',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            render: (price) => {
                return (
                    <div className={classNames(price === 0 ? 'text-green-600' : 'text-red-600')}>
                        {price === 0 ? 'Miễn phí' : formatMoneyInt(price) + 'đ'}
                    </div>
                );
            },
        },
        {
            title: 'Thao tác',
            dataIndex: '_id',
            render: (_id, record) => (
                <Space>
                    <DrawerChapters _id={_id} />
                    <Button onClick={() => setCourse(record)} type="primary">
                        Sửa
                    </Button>
                    <ModalDeleteCourse course={record} />
                </Space>
            ),
        },
    ];

    return (
        <div className="w-full">
            <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: 'Quản lý khóa học' }]} />
            <Table
                loading={isLoading}
                columns={columns}
                dataSource={courses}
                className="bg-white p-3 rounded"
                rowSelection={{ ...rowSelection }}
                rowKey={(record) => record._id}
                locale={{ emptyText: <Empty description="Chưa có khóa học" /> }}
                title={() => {
                    return (
                        <div className="flex items-center justify-between">
                            <p style={{ fontWeight: 600, fontSize: '20px' }}>Danh sách khóa học</p>
                            <ModalCreateCourse categories={categories} />
                        </div>
                    );
                }}
            />
            <ModalUpdateCourse course={course} categories={categories} setCourse={setCourse} />
        </div>
    );
};

export default CourseManager;
