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

export interface IResponse {
    date: string;
    localName: string;
}

export interface IState {
    yearNum: number,
    month: number,
    currentCard: IItem | null,
    tasksItems: Record<string, IItem>,
    tasksIds: string[],
    allHolidays: Array<IResponse> | null,
    filterWords: string,
    error: any,
    loading: boolean,
};