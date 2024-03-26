import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import allSelectors from '../../redux/selectors';
import Month from "../../components/Month";
import { nanoid } from "nanoid";
import s from './Homepage.module.scss';

const Homepage: React.FC = () => {
    const weekDaysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'San'];

    const monthsIds = useAppSelector(allSelectors.getMonthIds);
    const currentMonth = useAppSelector(allSelectors.getMonthNum);
    const currentYear = useAppSelector(allSelectors.getYearNum);

    const dispatch = useAppDispatch();

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
                    {monthsIds.length && monthsIds.map(month=>{
                        return<Month monthId={month} key={month}/>    
                    })} 
                </div>
            </main>
    )
}

export default Homepage;
