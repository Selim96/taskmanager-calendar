export interface IItem {
    id: string,
    date: string,
    title: string,
    labels: string[]
}

export interface IDay {
    key: string;
    date: string;
    id: number;
    number: number;
    isCurrentMonth?: boolean
};

export interface IMonth {
    id: string;
    number: number;
    year:number;
    month: number;
    daysArray: IDay[];
}

export interface IResponse {
    date: string;
    localName: string;
}

export interface IState {
    monthsArray: Record<number, IMonth>,
    monthsIds: number[],
    yearNum: number,
    month: number,
    isCurrentMonthInView: boolean,
    tasksItems: Record<string, IItem>,
    tasksIds: string[],
    allHolidays: Record<string, IResponse>,
    filterWords: string,
    lable: string,
    error: any,
    loading: boolean,
};