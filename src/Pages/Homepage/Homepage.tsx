import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import allSelectors from '../../redux/selectors';
import s from './Homepage.module.scss';
import { IDay, IMonth } from "../../interfaces/interfaces";
import Month from "../../components/Month";
import { nanoid } from "nanoid";
import { InView } from "react-intersection-observer";

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
    daysOfMonth.push(...lastEmptyDays);

    return {
        id: nanoid(),
        year:yearNum,
        month: monthNum,
        daysArray: daysOfMonth
    };
}

const Homepage: React.FC = () => {
    const [inView, setInView] = useState(false);
    const [months, setMonths] = useState<IMonth[]>([]);
    const weekDaysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'San'];

    const currentMonth = useAppSelector(allSelectors.getMonthNum);
    const currentYear = useAppSelector(allSelectors.getYearNum);

    const dispatch = useAppDispatch();

    const onScrollHandler = useCallback((e: any) => {
        
        if ((e.target.scrollHeight - (e.target.scrollTop + window.innerHeight) < 250)  ) {
            console.log('inner run!!')
        }
    }, []);

    const scrollToRef = useRef<HTMLDivElement>(null);

    const scrollToElement = () => {
        scrollToRef.current?.scrollIntoView({ behavior: 'smooth' });
        console.log('scroll run')
      };

    useEffect(()=>{
        const monthsArray: IMonth[] = [];
        if(!months.some(item=>item.month === currentMonth && item.year === currentYear)) {
            if(!months.some(item=>item.month === (currentMonth - 1) && item.year === currentYear)) {
                monthsArray.push(createDaysOfMonth(currentMonth-1, currentYear))
            }
            if(!months.some(item=>item.month === (currentMonth+1) && item.year === currentYear)) {
                monthsArray.push(createDaysOfMonth(currentMonth+1, currentYear))
            }
            monthsArray.push(createDaysOfMonth(currentMonth, currentYear));
        } else {
            if(!months.some(item=>item.month === (currentMonth - 1) && item.year === currentYear)) {
                monthsArray.push(createDaysOfMonth(currentMonth-1, currentYear))
            }
            if(!months.some(item=>item.month === (currentMonth+1) && item.year === currentYear)) {
                monthsArray.push(createDaysOfMonth(currentMonth+1, currentYear))
            }
        }
        setMonths([...months, ...monthsArray]);
        console.log('useeffect 1')
    }, [currentMonth, currentYear]);

    useEffect(()=>{
        scrollToElement()
        console.log('useeffect 2')
    }, [months, currentMonth, currentYear])

    console.log('homepage render!')

    const sortedMonths = [...months].sort((itemA, itemB)=>{
        if(itemA.year - itemB.year === 0 ) {
    
            return itemA.month - itemB.month
        }
        return itemA.year - itemB.year
    })

    return (
            <main className={s.mainBox}>
                <div className={s.weekdays_box}>
                    {weekDaysNames.map(dayName=>
                    <div key={nanoid()} className={s.weekdays_name}>
                        {dayName}
                    </div>)}
                </div>
                <div className={s.wrapper} onScroll={onScrollHandler}>
                    {months.length && sortedMonths.map(month=>{
                            if(month.month === currentMonth) {
                                return <Month refTag={scrollToRef} monthData={month} key={month.id}/>
                            } else {
                                return<Month refTag={null} monthData={month} key={month.id}/> 
                            }
                    })} 
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