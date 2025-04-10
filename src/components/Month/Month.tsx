import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { IDay, IItem, IMonth } from "../../interfaces/interfaces";
import Wrapper from "../Wrapper";
import s from './Month.module.scss';
import Day from "../Day";
import { InView } from "react-intersection-observer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { changeMonth, changeTaskIds, replaceTask, toggleInViewMonth } from "../../redux/slice";
import allSelectors from "../../redux/selectors";

interface IProp {
    monthId: number,
}

const Month:React.FC<IProp> = memo(({monthId}) => {
    const [currentTask, setCurrentTask] = useState<IItem | null>(null);
    const [onDropItem, setOnDropItem] = useState<string | null>(null)
    const monthData: IMonth = useAppSelector(allSelectors.getMonthArray)[monthId];
    const inViewMonthStatus = useAppSelector(allSelectors.getCurrentMonthInView);
    const currentMonth = useAppSelector(allSelectors.getMonthNum);
    const currentYear = useAppSelector(allSelectors.getYearNum);
    const allTasks = useAppSelector(allSelectors.getTasks);
    const taskIds = useAppSelector(allSelectors.getTasksIds);

    const tasksValues = Object.values(allTasks);

    const {year, month, daysArray, number} = monthData;

    const dispatch = useAppDispatch();

    const scrollToRef = useRef<HTMLDivElement>(null);

    const scrollToElement = () => {
        if(currentYear.toString()+currentMonth.toString().padStart(2, '0') === number.toString())
            {scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });}
      };

    const dragStartHandler = useCallback((e: React.DragEvent<HTMLDivElement>, task: IItem): void => {
        setCurrentTask(task);
    }, [])
    const dragOverHandler = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.style.boxShadow = '0px 0px 5px 0px rgba(81, 182, 223, 0.734)';
    }, [])
    const dragLeaveHandler=useCallback((e:React.DragEvent<HTMLDivElement>)=> {
        e.currentTarget.style.boxShadow = 'none';
    }, [])

    const dropOnBoardHandler = useCallback((e:React.DragEvent<HTMLDivElement>, day: IDay) => {
        if(currentTask) {
            const date = day.date;
            if(currentTask.date !== date) {
                dispatch(replaceTask({id: currentTask.id, date}));
            } else {
                const newArray = taskIds.filter(item=>item!==currentTask.id)
                const index = newArray.findIndex(item=>item===onDropItem);
                newArray.splice(index, 0, currentTask.id);
                dispatch(changeTaskIds(newArray))
            }
            setCurrentTask(null)
        }
        e.currentTarget.style.scale = '1';
        e.currentTarget.style.boxShadow = 'none';
    }, [dispatch, currentTask, taskIds, onDropItem])

    const dragOverHanderItem= useCallback((e: React.DragEvent<HTMLDivElement>, itemId: string)=> {
        e.preventDefault();
        e.currentTarget.style.boxShadow = '0px 6px 5px 0px rgba(0,0,0,0.56)';
        setOnDropItem(itemId)
    },[])

    const rowCount = Math.ceil(daysArray.length / 7);
    const currentNumber = Number(currentYear.toString()+currentMonth.toString().padStart(2, '0'));


    useEffect(()=>{
        if(currentNumber === number )
        scrollToElement()
    }, [currentMonth, currentYear])

    return (
        <InView onChange={(inView, entry)=>{ 
                console.log("inview")
                    if(inView && currentNumber === number) dispatch(toggleInViewMonth(inView))
                    if(inViewMonthStatus && inView) dispatch(changeMonth({year: year, month: month}))
                }} 
            threshold={0.6}
            className="inview_elem">
                    {({ ref, inView }) => 
                    (<Wrapper ref={ref}>
                            <div id={number.toString()} ref={scrollToRef} className={[s.card_list].join(' ')}  style={{gridTemplateRows: `repeat(${rowCount}, minmax(150px, 150px))`, height: `${rowCount *150 + (rowCount-1)*4 +8}px`}}>
                                {daysArray.map(day=>{
                                    if(tasksValues.some(item=>item.date === day.date)) {
                                        const tasks = taskIds.reduce((total: IItem[],item)=>{
                                            if(allTasks[item].date === day.date) {total.push(allTasks[item])}
                                            return total;
                                        }, []);
                                        return <Day tasks={tasks} 
                                        dragStartHandler={dragStartHandler} 
                                        dragOverHanderItem={dragOverHanderItem}
                                        dropOnBoardHandler={dropOnBoardHandler} 
                                        dragOverHandler={dragOverHandler}
                                        dragLeaveHandler={dragLeaveHandler}
                                        dayData={day} key={day.key}/>
                                    }
                                    return <Day 
                                    dragStartHandler={dragStartHandler} 
                                    dragOverHanderItem={dragOverHanderItem}
                                    dropOnBoardHandler={dropOnBoardHandler} 
                                    dragOverHandler={dragOverHandler}
                                    dragLeaveHandler={dragLeaveHandler}
                                    dayData={day} key={day.key}/>
                                })}
                            </div> 
                    </Wrapper>)}
        </InView>
    )
    
})

export default Month;