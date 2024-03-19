import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import allSelectors from '../../redux/selectors';
import s from './Homepage.module.scss';
import { IDay } from "../../interfaces/interfaces";
import Day from "../../components/Day";
import { nanoid } from "nanoid";

const createDaysOfMonth = (monthNum: number, yearNum: number) => {
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
    daysOfMonth.push(...lastEmptyDays)
    return daysOfMonth;
}

const Homepage: React.FC = () => {
    const [days, setDays] = useState<IDay[]>([]);
    const weekDaysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'San'];

    const currentMonth = useAppSelector(allSelectors.getMonthNum);
    const currentYear = useAppSelector(allSelectors.getYearNum);
    
    const dispatch = useAppDispatch();


    const rowCount = Math.ceil(days.length / 7);

    const onScrollHandler = useCallback((e: any) => {
        
        if ((e.target.scrollHeight - (e.target.scrollTop + window.innerHeight) < 250)  ) {
            console.log('inner run!!')
        }
    }, []);

    
    // useEffect(() => {
    //     document.addEventListener('scroll', onScrollHandler);
    //     return () => {
    //         document.removeEventListener('scroll', onScrollHandler);
    //     };
    // }, [onScrollHandler]);

    useEffect(()=>{
        const daysArray = [...createDaysOfMonth(currentMonth - 1, currentYear), ...createDaysOfMonth(currentMonth, currentYear), ...createDaysOfMonth(currentMonth + 1, currentYear)];
        setDays(daysArray)
    }, []);

    useEffect(()=>{

    }, [])

    console.log('homepage render!')

    return (
            <main className={s.mainBox}>
                <div className={s.weekdays_box}>
                    {weekDaysNames.map(dayName=>
                    <div key={nanoid()} className={s.weekdays_name}>
                        {dayName}
                    </div>)}
                </div>
                <div className={s.wrapper} onScroll={onScrollHandler}>
                    <div className={s.card_list}  style={{gridTemplateRows: `repeat(${rowCount}, minmax(150px, 1fr))`}}>
                        {days && days.map(day=><Day dayData={day} key={day.key}/>)}
                    </div> 
                </div>
            </main>
    )
}

export default Homepage;





// const [boards, setBoards] = useState<IBoard[]>([
    //     {id:1, title: "TODO", items: [{id:1, title: 'go to shop'}, {id:2,title:'write artical'}, {id: 3, title:'read book'}]},
    //     {id:2, title: "InProgress", items: [{id:4, title: 'learn JS'}, {id:5,title:'learn Node'}, {id: 6, title:'check car'}]},
    //     {id:3, title: "Done", items: [{id:7, title: 'sleep'}, {id:8,title:'eat'}, {id:9, title:'cook'}]}
    // ]);