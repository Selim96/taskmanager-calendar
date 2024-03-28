import React, { memo, useEffect, useRef } from 'react';
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
for(let y = currentYear - 20; y <= currentYear+30; y++) {
    arrOfYears.push(y);
}

const holidayAPI = new HolidayAPI();

const Header: React.FC<IProp> = memo(({canvasRef}) => {
    
    const storeMonth = useAppSelector(allSelectors.getMonthNum);
    const storeYear = useAppSelector(allSelectors.getYearNum);
    const filterValue = useAppSelector(allSelectors.getLable);
    const allHolidays = useAppSelector(allSelectors.getAllHolidays);
    const dispatch = useAppDispatch();

    const onChangeMonthNum = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        dispatch(toggleInViewMonth(false));
        dispatch(changeMonth({year: storeYear, month:value}));
    }
    const onChangeYearNum = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        dispatch(toggleInViewMonth(false));
        dispatch(changeYear(value));
    }
    const onChangeLabel = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        dispatch(filterByLabels(value));
    }

    const increaseMonth = () => {
        if(storeMonth === 12) {
            dispatch(changeMonth({year: storeYear + 1, month:1}));
            return;
        };
        dispatch(changeMonth({year: storeYear , month:storeMonth+1}));
    }
    const decreaseMonth = () => {
        if(storeMonth === 1) {
            dispatch(changeMonth({year: storeYear - 1, month:12}));
            return
        };
        dispatch(changeMonth({year: storeYear, month:storeMonth - 1}));
    }

    useEffect(()=> {
        dispatch(changeYear(currentYear));
        dispatch(changeMonth({year: currentYear, month:currentMonthIndex}));
        dispatch(filterByLabels('all'));
    }, []);

    const refConst = useRef(true)

    useEffect(()=>{
        if (refConst.current) {
            dispatch(holidayAPI.getPublicHolidays(currentYear));
            refConst.current = false;
        } else if(allHolidays && !Object.keys(allHolidays).some(item=>item.includes(storeYear.toString()))) {
            dispatch(holidayAPI.getPublicHolidays(storeYear));
        }
    }, [storeYear]);

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
                    <select value={filterValue} onChange={onChangeLabel} className={`${s.selector} ${s[filterValue]}`} >
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