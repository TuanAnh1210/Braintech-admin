import { Flex, Breadcrumb } from 'antd';

import ChaptersComponent from './features/ChaptersComponent';
import UpdateCourse from './features/UpdateCourse';

const CourseDetailPage = () => {
    return (
        <Flex className="w-full" gap={20} vertical>
            <Breadcrumb
                items={[
                    { title: 'Trang chủ' },
                    { title: 'Quản lý khóa học', href: '/manager-courses' },
                    { title: 'Chi tiết khóa học' },
                ]}
            />
            <UpdateCourse />
            <ChaptersComponent />
        </Flex>
    );
};

export default CourseDetailPage;
