import { nanoid } from "nanoid";
import React, { memo } from "react";
import { IDay, IItem } from "../../interfaces/interfaces";
import s from './Day.module.scss';
import { useAppSelector } from "../../redux/hooks";
import allSelectors from "../../redux/selectors";
import AddInput from "../AddInput";
import Item from "../Item";

interface IProps {
    tasks?: IItem[],
    dragStartHandler: (e: React.DragEvent<HTMLDivElement>, task: IItem) => void,
    dragOverHanderItem: (e: React.DragEvent<HTMLDivElement>, itemId: string) => void,
    dropOnBoardHandler: (e: React.DragEvent<HTMLDivElement>, day: IDay) => void,
    dragOverHandler: (e: React.DragEvent<HTMLDivElement>)=> void,
    dragLeaveHandler: (e:React.DragEvent<HTMLDivElement>)=>void,
    dayData: IDay
}

const Day:React.FC<IProps> = memo(({dayData, tasks, dragStartHandler, dragOverHanderItem, dropOnBoardHandler, dragOverHandler, dragLeaveHandler})=> {
    const allHolidays = useAppSelector(allSelectors.getAllHolidays);

    const {id, number, date } = dayData;
    const holiday = !!allHolidays[date] ? allHolidays[date] : null;

    const dateFromData = new Date(date);
    const currentDate = new Date();

    if(id === 0) {
        return (<div key={nanoid()} className={`${s.board} ${s.empty_board} `}></div>)
    }

    return (
        <div 
            className={`${s.board} ${(currentDate.toDateString() === dateFromData.toDateString()) ? s.todayClass : ''}`} 
            style={holiday ? {backgroundColor: "hsl(11deg 74.85% 81.8%)"} : {}}
            onDragOver={dragOverHandler}
            onDrop={(e)=>dropOnBoardHandler(e, dayData)}
            onDragLeave={dragLeaveHandler}
        >
            <div className={s.board_title}>
                <p>{number}</p>
                {!!holiday && <span>{holiday?.localName}</span>}
            </div>
            <AddInput cardDate={date}/>
            {!!tasks?.length && 
            <div className={s.list_items}>
                {tasks.map(item=> {
                    return <Item dragStartHandler={dragStartHandler} dragOverHanderItem={dragOverHanderItem} key={item.id} itemId={item.id}/>
                })}
            </div>}
        </div>)
})

export default Day;