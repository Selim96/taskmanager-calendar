import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import allSelectors from '../../redux/selectors';
import s from './Homepage.module.scss';
import { IDay, IMonth } from "../../interfaces/interfaces";
import Month from "../../components/Month";
import { nanoid } from "nanoid";
import { InView } from "react-intersection-observer";
import { createDaysOfMonth } from "../../helpers";



const Homepage: React.FC = () => {
    const weekDaysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'San'];

    const months = useAppSelector(allSelectors.getMonthArray);
    const currentMonth = useAppSelector(allSelectors.getMonthNum);
    const currentYear = useAppSelector(allSelectors.getYearNum);

    const dispatch = useAppDispatch();

    // const onScrollHandler = useCallback((e: any) => {
    //     if ((e.target.scrollHeight - (e.target.scrollTop + window.innerHeight) < 250)  ) {
    //         console.log('inner run!!')
    //     }
    // }, []);

    const scrollToRef = useRef<HTMLDivElement>(null);

    // useEffect(()=>{
    //     const monthsArray: IMonth[] = [];
    //     if(!months.some(item=>item.month === currentMonth && item.year === currentYear)) {
    //         if(!months.some(item=>item.month === (currentMonth - 1) && item.year === currentYear)) {
    //             monthsArray.push(createDaysOfMonth(currentMonth-1, currentYear))
    //         }
    //         if(!months.some(item=>item.month === (currentMonth+1) && item.year === currentYear)) {
    //             monthsArray.push(createDaysOfMonth(currentMonth+1, currentYear))
    //         }
    //         monthsArray.push(createDaysOfMonth(currentMonth, currentYear));
    //     } else {
    //         if(!months.some(item=>item.month === (currentMonth - 1) && item.year === currentYear)) {
    //             monthsArray.push(createDaysOfMonth(currentMonth-1, currentYear))
    //         }
    //         if(!months.some(item=>item.month === (currentMonth+1) && item.year === currentYear)) {
    //             monthsArray.push(createDaysOfMonth(currentMonth+1, currentYear))
    //         }
    //     }
    //     setMonths([...months, ...monthsArray]);
    //     console.log('useeffect 1')
    // }, [currentMonth, currentYear]);

    console.log('homepage render!')

    // const sortedMonths = [...months].sort((itemA, itemB)=>{
    //     if(itemA.year - itemB.year === 0 ) {
    
    //         return itemA.month - itemB.month
    //     }
    //     return itemA.year - itemB.year
    // })

    return (
            <main className={s.mainBox}>
                <div className={s.weekdays_box}>
                    {weekDaysNames.map(dayName=>
                    <div key={nanoid()} className={s.weekdays_name}>
                        {dayName}
                    </div>)}
                </div>
                <div className={s.wrapper} >
                    {months.length && months.map(month=>{
                        return<Month refTag={null} monthData={month} key={month.id}/>    
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