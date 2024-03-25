import React, { memo, useEffect, useState } from 'react';
import s from './Header.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {filterByLabels, changeMonth, changeYear, toggleInViewMonth} from "../../redux/slice";
import { HolidayAPI } from '../../services/api';
import Download from '../Download';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import allSelectors from '../../redux/selectors';


interface IProp {
    canvasRef: React.RefObject<HTMLDivElement>
}

const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];
const labels = ['all', 'green', 'yellow', 'red'];

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonthIndex = currentDate.getMonth() +1;

const arrOfYears: number[] = [];
for(let y = currentYear; y <= currentYear+20; y++) {
    arrOfYears.push(y);
}

const holidayAPI = new HolidayAPI();

const Header: React.FC<IProp> = memo(({canvasRef}) => {
    const [yearNum, setYearNum] = useState<number>(currentYear);
    const [monthNum, setMonthNum] = useState<number>(currentMonthIndex); // 1-12
    const [label, setLabel] = useState('all');

    const dispatch = useAppDispatch();
    const storeMonth = useAppSelector(allSelectors.getMonthNum);
    const storeYear = useAppSelector(allSelectors.getYearNum);
    const filterValue = useAppSelector(allSelectors.getFilter);

    const onChangeMonthNum = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setMonthNum(value);
    }
    const onChangeYearNum = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setYearNum(value);
    }

    const onChangeLabel = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setLabel(value);
    }

    const increaseMonth = () => {
        if(monthNum === 12) {
            setMonthNum(1);
            setYearNum(yearNum + 1);
            return;
        };
        setMonthNum(monthNum +1);
    }
    const decreaseMonth = () => {
        if(monthNum === 1) {
            setMonthNum(12);
            setYearNum(yearNum - 1);
            return
        };
        setMonthNum(monthNum -1);
    }

    useEffect(()=>{
        dispatch(holidayAPI.getPublicHolidays(yearNum));
    }, []);

    useEffect(()=> {
            dispatch(changeYear(yearNum));
            // dispatch(changeMonth(monthNum));
    }, [yearNum]);

    useEffect(()=> {
        dispatch(toggleInViewMonth(false));
        dispatch(changeMonth(monthNum));
    }, [monthNum, yearNum]);

    useEffect(()=>{
        dispatch(filterByLabels(label));
    }, [label]);

    return <header className={s.header}>
        <div className={s.navigation}>
            <div className={s.change_buttons}>
                
                <div className={s.button} onClick={decreaseMonth}><KeyboardArrowLeftIcon/></div>
                <div className={s.button} onClick={increaseMonth}><KeyboardArrowRightIcon /></div>
            </div>
            <div className={s.select_month}>
                    <select value={storeMonth} onChange={onChangeMonthNum} className={s.selector}>
                        {months.map((month, index) => <option key={index} value={index +1}>{month}</option>)}
                    </select>
                    <select value={storeYear} onChange={onChangeYearNum} className={s.selector}>
                        {arrOfYears.map((year, index) => <option key={index} value={year}>{year}</option>)}
                    </select>
            </div>
            <div className={s.select_label}>
                <p>Label</p>
                    <select value={filterValue} onChange={onChangeLabel} className={`${s.selector} ${s[label]}`} >
                        {labels.map((lb, index) => 
                            <option key={index} value={lb} className={s[lb]}>{lb}</option>)}
                    </select>
            </div>
        </div>
        
        <div className={s.month_name}>
            {`${months[storeMonth-1]} ${storeYear}`}
        </div>
        
        <div className={s.interfaces}>
            
            <Download/> 
        </div>
    </header>
});

export default Header;