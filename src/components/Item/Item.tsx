import React, { memo, useCallback } from "react";
import s from './Item.module.scss';
import { IDay, IItem } from "../../interfaces/interfaces";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { deleteTask, changeTask, setCurrentCard } from "../../redux/slice";
import allSelectors from "../../redux/selectors";

interface IInterface {
    itemId: string, 
}

const Item: React.FC<IInterface> =memo(({itemId})=>{

    const dispatch= useAppDispatch();
    const task = useAppSelector(allSelectors.getTasks)[itemId];
    const filterByLabels = useAppSelector(allSelectors.getFilter);

    const deleteItem =useCallback(()=>{
        dispatch(deleteTask(itemId));
    }, [dispatch]);

    function dragStartHandler(e: React.DragEvent<HTMLDivElement>): void {
        dispatch(setCurrentCard(task));
    }
    function dragEndHandler(e: React.DragEvent<HTMLDivElement>): void {
        e.currentTarget.style.boxShadow = 'none';
    }

    function dragOverHanderItem(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        e.currentTarget.style.boxShadow = '0px 6px 5px 0px rgba(0,0,0,0.56)';
    }
    function dragLeaveHandler(e:React.DragEvent<HTMLDivElement>) {
        e.currentTarget.style.boxShadow = 'none';
        // e.currentTarget.style.border = 'none';
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        e.currentTarget.style.boxShadow = 'none';
    }

    const onLabelClick:(color: string)=> void = (color) => {
        dispatch(changeTask({id:itemId, color}));
    }

    const greenClass = [s.label, s.label_green];
    const yellowClass = [s.label, s.label_yellow];
    const redClass = [s.label, s.label_red];
    if(task.labels.includes('green')) greenClass.push(s.green);
    if(task.labels.includes('yellow')) yellowClass.push(s.yellow);
    if(task.labels.includes('red')) redClass.push(s.red);

    let isShownItem = false;

    if(filterByLabels === 'all') isShownItem= true;
    if(task.labels.includes(filterByLabels)) isShownItem= true;

    console.log('item render!')

    return (
        <div id={`${task.id}`} className={s.item} style={isShownItem ? {display: 'block'} : {display: 'none'}}
            onDragOver={dragOverHanderItem}
            onDragLeave={dragLeaveHandler}
            onDragStart={(e)=>dragStartHandler(e)}
            onDragEnd={dragEndHandler}
            onDrop={(e)=>dropHandler(e)}
            draggable={true}
        >
            <div className={s.label_wrapp}>
                <div className={greenClass.join(' ')} onClick={(e)=> onLabelClick('green')}></div>
                <div className={yellowClass.join(' ')} onClick={(e)=> onLabelClick('yellow')}></div>
                <div className={redClass.join(' ')} onClick={(e)=> onLabelClick('red')}></div>
            </div>
            <p className={s.item_title}>{task.title}</p><span className={s.delete_icon} onClick={deleteItem}><DeleteOutlineIcon fontSize="small" className={s.icon}/></span>
        </div>
    )
})

export default Item;