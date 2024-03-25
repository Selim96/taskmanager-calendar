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

    console.log('homepage render!')

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
                        return<Month monthData={month} key={month.id}/>    
                    })} 
                </div>
            </main>
    )
}

export default Homepage;
