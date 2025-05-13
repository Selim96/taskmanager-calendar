import React from 'react';
import s from './TodayBtn.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { changeMonth, toggleInViewMonth } from '../../redux/slice';

interface IProp {
    monthNum: number;
    yearNum: number
}

const TodayBtn: React.FC<IProp> = ({ monthNum, yearNum }) => {

    const dispatch = useAppDispatch();

    const onChangeMonthNum = () => {
            dispatch(toggleInViewMonth(false));
            dispatch(changeMonth({year: yearNum, month:monthNum}));
        }

    return (
        <button onClick={onChangeMonthNum} className={s.today_btn}>
            Today
        </button>
    );
};

export default TodayBtn;