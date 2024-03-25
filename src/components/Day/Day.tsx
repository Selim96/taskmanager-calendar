import { nanoid } from "nanoid";
import React, { memo } from "react";
import { IDay } from "../../interfaces/interfaces";
import s from './Day.module.scss';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import allSelectors from "../../redux/selectors";
import { replaceTask, setCurrentCard } from "../../redux/slice";
import AddInput from "../AddInput";
import Item from "../Item";

interface IProps {
    dayData: IDay
}

const Day:React.FC<IProps> = memo(({dayData})=> {
    const allHolidays = useAppSelector(allSelectors.getAllHolidays);
    const allTasks = useAppSelector(allSelectors.getTasks);
    const allTasksIds=useAppSelector(allSelectors.getTasksIds);
    const currentCard = useAppSelector(allSelectors.getCurrentCard);

    const dispatch = useAppDispatch()

    function dragOverHandler(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        e.currentTarget.style.boxShadow = '0px 0px 5px 0px rgba(81, 182, 223, 0.734)';
    }
    function dragLeaveHandler(e:React.DragEvent<HTMLDivElement>) {
        e.currentTarget.style.boxShadow = 'none';
    }
    function dropOnBoardHandler(e:React.DragEvent<HTMLDivElement>, day: IDay) {
        if(currentCard) {
            const date = day.date;
            dispatch(replaceTask({id: currentCard.id, date}));
            dispatch(setCurrentCard(null));
        }
        e.currentTarget.style.scale = '1';
        e.currentTarget.style.boxShadow = 'none';
    }

    const {key, id, number, date } = dayData;
    const holiday = allHolidays ? allHolidays.find(item=> item.date === date) : null;

    const dateFromData = new Date(date);
    const currentDate = new Date();

    console.log('day render!')

    if(id === 0) {
        return (
            <div key={nanoid()} className={`${s.board} ${s.empty_board} `}></div>
        )
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
                {holiday && <span>{holiday?.localName}</span>}
            </div>
            <AddInput cardDate={date}/>
            {!!allTasksIds.length && <div className={s.list_items}>
                {allTasksIds.map(itemId=> {
                    if(allTasks[itemId].date === date) {
                        return <Item key={itemId} itemId={itemId}/>
                    }
                })}
            </div>}
        </div>)
})

export default Day;