import { nanoid } from "nanoid";
import { IDay } from "../interfaces/interfaces";


export const createDaysOfMonth = (monthNum: number, yearNum: number) => {
    const daysOfMonth: IDay[] = [];
    const lastDay = new Date(yearNum, monthNum, 0).getDate();

    const firstDate = new Date(`${monthNum}.${1}.${yearNum}`);
    const lastDate = new Date(`${monthNum}.${lastDay}.${yearNum}`);
    const firstDayOfWeek = firstDate.getDay() === 0 ? 7 : firstDate.getDay(); // 1-7
    const lastDayOfWeek = lastDate.getDay() === 0 ? 7 : lastDate.getDay(); // 1-7

    const firstEmptyDays = Array.from({ length: firstDayOfWeek - 1 }, () => ({key: nanoid(), date: '', number: 0, id:0, holidays: ''}));
    const lastEmptyDays = Array.from({ length: 7 - lastDayOfWeek }, () => ({key: nanoid(), date: '', number: 0, id:0, holidays: ''}));

    daysOfMonth.unshift(...firstEmptyDays);
    for(let day = 1; day <= lastDay; day++) {
        const date = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayObject = {
            key: nanoid(),
            date: date,
            id: day,
            number: day,
            items: [],
            holidays: '',
            isCurrentMonth: true
        };
        daysOfMonth.push(dayObject );
    }
    daysOfMonth.push(...lastEmptyDays);

    const yearString = yearNum.toString();
    const monthString = monthNum.toString().padStart(2, '0');

    return {
        id: nanoid(),
        number: Number(yearString+monthString),
        year:yearNum,
        month: monthNum,
        daysArray: daysOfMonth
    };
}