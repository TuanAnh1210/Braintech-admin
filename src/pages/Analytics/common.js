import dayjs from 'dayjs';

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

const DATACOLOR = ['teal', 'tomato', 'coral', 'goldenrod', 'chartreuse', 'moccasin', 'steelblue'];

export const genColor = () => {
    return DATACOLOR[Math.floor(Math.random() * DATACOLOR.length - 1)];
};
