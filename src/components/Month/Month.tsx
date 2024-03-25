import React, { useEffect, useRef } from "react";
import { IMonth } from "../../interfaces/interfaces";
import Wrapper from "../Wrapper";
import s from './Month.module.scss';
import Day from "../Day";
import { InView } from "react-intersection-observer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { changeMonth, toggleInViewMonth } from "../../redux/slice";
import allSelectors from "../../redux/selectors";

interface IProp {
    monthData: IMonth,
    refTag: React.RefObject<HTMLDivElement> | null
}

const Month:React.FC<IProp> = ({monthData, refTag}) => {
    const {year, month, daysArray, number} = monthData;
    const inViewMonthStatus = useAppSelector(allSelectors.getCurrentMonthInView);
    const currentMonth = useAppSelector(allSelectors.getMonthNum);
    const currentYear = useAppSelector(allSelectors.getYearNum); 

    const dispatch = useAppDispatch();

    const scrollToRef = useRef<HTMLDivElement>(null);

    const scrollToElement = () => {
        if(currentYear.toString()+currentMonth.toString().padStart(2, '0') === number.toString())
            {scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
            console.log('scroll run')}
      };

    //   scrollToElement()

    const rowCount = Math.ceil(daysArray.length / 7);
    const currentNumber = Number(currentYear.toString()+currentMonth.toString().padStart(2, '0'));

    useEffect(()=>{
        if(currentNumber === number )
        scrollToElement()
    }, [currentMonth, currentYear])

    // useEffect(()=> {
    //     if(inViewMonthStatus)
    //     dispatch(changeMonth(month))
    // }, [inViewMonthStatus])

    return (
            <InView onChange={(inView, entry)=>{
                    console.log('InView', inView); 
                    if(inView && currentNumber === number) {
                        console.log('this month InView');
                        dispatch(toggleInViewMonth(inView))
                    } 
                    if(inViewMonthStatus && inView)
                    dispatch(changeMonth(month))
                    
                }} 
                threshold={0.9}
                className="inview_elem">
                    {({ ref, inView }) => 
                        (<Wrapper ref={ref}>
                            <div id={number.toString()} ref={scrollToRef} className={[s.card_list].join(' ')}  style={{gridTemplateRows: `repeat(${rowCount}, minmax(150px, 1fr))`}}>
                                {daysArray.map(day=><Day dayData={day} key={day.key}/>)}
                            </div> 
                        </Wrapper>)}
            </InView>
    )
    
}

export default Month;