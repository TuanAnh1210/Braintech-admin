/* eslint-disable react/prop-types */
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts';
import { useGetCateQuery } from '@/providers/apis/cateApi';
import { useMemo } from 'react';

function getDuplicates(courseData, groupField = 'code', countName = 'courseCount') {
    console.log(1, courseData);
    const counts = {};

    courseData.forEach(({ cate_id }) => {
        const id = cate_id._id;

        if (!counts[id]) {
            counts[id] = { subject: cate_id[groupField], [countName]: 1 };
        } else counts[id][countName]++;
    });

    const result = Object.values(counts);

    return result;
}

export const CourseCategoryChart = ({ courseData }) => {
    const { data: categoryResponse } = useGetCateQuery();

    const categoryData = useMemo(() => {
        if (courseData) {
            const original = getDuplicates(courseData?.original);
            const filtered = getDuplicates(courseData?.filtered, 'code', 'filteredCount');

            const merge = original.map((o, i) => {
                return { ...o, ...filtered[i] };
            });

            return merge;
        }
    }, [courseData]);

    return (
        <ResponsiveContainer className="bg-white rounded pt-4" width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="Tổng khoá học" dataKey="courseCount" stroke="orange" fill="orange" fillOpacity={0.6} />
                <Radar name="Khoá học mới" dataKey="filteredCount" stroke="tomato" fill="tomato" fillOpacity={0.8} />

                <Tooltip
                    labelFormatter={(label) => {
                        return categoryResponse.find((c) => c.code === label).name;
                    }}
                    formatter={(value) => [value, 'Số lượng khoá học']}
                />
                <Legend />
            </RadarChart>
        </ResponsiveContainer>
    );
};
