import { message } from 'antd';
import dayjs from 'dayjs';

export const formatMoneyInt = (money = 0, type = '.') => {
    return String(money).replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${type}`);
};

export const convertBytesToReadableSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]}`;
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

export const clipboard = (text) => {
    message.success('Sao chép thành công');
    return navigator.clipboard.writeText(text);
};

export const filterNumericInput = (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
};

const now = dayjs().locale('vn');

export const TIMEFRAMES = {
    all: {},
    thisMonth: { fromDate: now.startOf('month').valueOf(), toDate: now.endOf('month').valueOf() },
    lastMonth: {
        fromDate: now.subtract(1, 'month').startOf('month').valueOf(),
        toDate: now.subtract(1, 'month').endOf('month').valueOf(),
    },
    thisYear: { fromDate: now.startOf('year').valueOf() },
    lastYear: {
        fromDate: now.subtract(1, 'year').startOf('year').valueOf(),
        toDate: now.subtract(1, 'year').endOf('year').valueOf(),
    },
};
