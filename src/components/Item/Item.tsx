import React, { memo, useCallback, useState } from "react";
import s from './Item.module.scss';
import { IItem, IState } from "../../interfaces/interfaces";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { deleteTask, changeTask } from "../../redux/slice";
import allSelectors from "../../redux/selectors";

interface IInterface {
    itemId: string, 
    dragStartHandler: (e: React.DragEvent<HTMLDivElement>, task: IItem) => void,
    dragOverHanderItem: (e: React.DragEvent<HTMLDivElement>, itemId: string) => void
}

const Item: React.FC<IInterface> =memo(({itemId, dragStartHandler, dragOverHanderItem})=>{
    
    const dispatch= useAppDispatch();
    const task = useAppSelector((state: IState) => state.tasksItems[itemId]);
    const filterByLabels = useAppSelector(allSelectors.getLable);
    const filterByWords = useAppSelector(allSelectors.getFilter);
    const [title, setTitle] = useState<string>(task.title);
    const [isActiveInput, setIsActiveInput] = useState(false);

    const deleteItem =useCallback(()=>{
        dispatch(deleteTask(itemId));
    }, [dispatch, itemId]);

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setTitle(e.target.value);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            if(isActiveInput) {setIsActiveInput(false); setTitle(task.title)}
        }
    };

    const changeTitle = useCallback(()=>{
        if(isActiveInput) {
          dispatch(changeTask({id:itemId, color: '', text: title})); 
          setIsActiveInput(false);
        } else {
            setIsActiveInput(!isActiveInput);
        }
    },[isActiveInput, dispatch, title, itemId])

    const dragEndHandler=useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.boxShadow = 'none';
    }, [])

    const dragLeaveHandler=useCallback((e:React.DragEvent<HTMLDivElement>)=> {
        e.currentTarget.style.boxShadow = 'none';
    }, [])

    const dropHandler= useCallback((e: React.DragEvent<HTMLDivElement>)=> {
        e.preventDefault();
        e.currentTarget.style.boxShadow = 'none';
    },[])

    const onLabelClick = useCallback((color: string) => {
        dispatch(changeTask({id:itemId, color}));
    }, [dispatch, itemId])

    const greenClass = [s.label, s.label_green];
    const yellowClass = [s.label, s.label_yellow];
    const redClass = [s.label, s.label_red];
    if(task.labels.includes('green')) greenClass.push(s.green);
    if(task.labels.includes('yellow')) yellowClass.push(s.yellow);
    if(task.labels.includes('red')) redClass.push(s.red);

    let isShownItem = false;

    if(filterByLabels === 'all') isShownItem= true;
    if(task.labels.includes(filterByLabels)) isShownItem= true;
    if(filterByWords){
        if(task.title.includes(filterByWords)) {
            isShownItem= true;
        } else {
            isShownItem= false
        }
    }

    return (
        <div id={`${task.id}`} className={s.item} style={isShownItem ? {display: 'block'} : {display: 'none'}}
            onDragOver={(e)=>dragOverHanderItem(e, itemId)}
            onDragLeave={dragLeaveHandler}
            onDragStart={(e)=>dragStartHandler(e, task)}
            onDragEnd={dragEndHandler}
            onDrop={(e)=>dropHandler(e)}
            draggable={true}
            
        >
            <div className={s.label_wrapp}>
                <div className={greenClass.join(' ')} onClick={(e)=> onLabelClick('green')}></div>
                <div className={yellowClass.join(' ')} onClick={(e)=> onLabelClick('yellow')}></div>
                <div className={redClass.join(' ')} onClick={(e)=> onLabelClick('red')}></div>
            </div>
            <div className={s.item_content}>
                <p className={s.item_title} style={isActiveInput ? {display: 'none'} : {}}>{task.title}</p>
                <form style={isActiveInput ? {} : {display: 'none'}} onSubmit={(e)=>{e.preventDefault(); changeTitle()}} >
                    <input type="text" value={title} className={s.item_input} onChange={onChangeInput} onKeyDown={onKeyDown}/>
                </form>
                <div className={s.icons_thumb}>
                    <span className={s.icons} onClick={changeTitle}><ModeEditIcon fontSize="small" className={s.icon}/></span>
                    <span className={s.icons} onClick={deleteItem}><DeleteOutlineIcon fontSize="small" className={s.icon}/></span>
                </div>
            </div>
        </div>
    )
})

export default Item;