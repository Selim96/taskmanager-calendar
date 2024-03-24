import React from "react";
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
    const {year, month, daysArray} = monthData;

    const dispatch = useAppDispatch();

    const inViewMonthStatus = useAppSelector(allSelectors.getCurrentMonthInView);

    const thisMonthDate = new Date(`${year}/${month}/01`);
    const thisMonth = thisMonthDate.getMonth() + 1;
    
    // console.log(thisMonthDate.getMonth() + 1)

    const rowCount = Math.ceil(daysArray.length / 7);

    if(refTag) {
        return (
            <InView onChange={(inView, entry)=>{
                console.log('InView current', inView);
                if(inView) {dispatch(toggleInViewMonth())}
            }} 
            threshold={0.5}
            className="inview_elem">
                {({ ref, inView }) => 
                    (<Wrapper ref={ref}>
                        <div ref={refTag} className={[s.card_list].join(" ")}  style=  {{gridTemplateRows: `repeat(${rowCount}, minmax(150px, 1fr))`}}>
                            {daysArray.map(day=><Day dayData={day} key={day.key}/>)}
                        </div> 
                    </Wrapper>)}
            </InView>
            
    )} else {
        return (
            <InView onChange={(inView, entry)=>{
                    console.log('InView', inView);
                    if(inViewMonthStatus) {
                        dispatch(toggleInViewMonth())
                        dispatch(changeMonth(month))
                        
                    }
                }} 
                threshold={0.7}
                className="inview_elem">
                    {({ ref, inView }) => 
                        (<Wrapper ref={ref}>
                            <div  className={[s.card_list, s.notCurrent_month].join(' ')}  style={{gridTemplateRows: `repeat(${rowCount}, minmax(150px, 1fr))`}}>
                            {daysArray.map(day=><Day dayData={day} key={day.key}/>)}
                            </div> 
                        </Wrapper>)}
                </InView>
            
        )
    }
}

export default Month;