import React, { useState } from "react";
import s from './AddInput.module.scss';
import { nanoid } from "nanoid";
import { addNewTask } from "../../redux/slice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import allSelectors from "../../redux/selectors";
import { IItem } from "../../interfaces/interfaces";

type Input = {
    cardDate: string
}

const AddInput: React.FC<Input> =({cardDate})=> {
    const [itemTitle, setItemTitle] = useState('');

    const dispatch = useAppDispatch();

    function changeItemTitle(e: React.ChangeEvent<HTMLInputElement>) {
        setItemTitle(e.target.value);
    }

    function addItem(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const newItem: IItem = {
            id: nanoid(),
            date: cardDate,
            title: itemTitle,
            labels: []
        }
        setItemTitle('');
        dispatch(addNewTask(newItem));
    }

    return (
        <form className={s.input_wrapper} onSubmit={addItem}>
            <input type="text" value={itemTitle} onChange={changeItemTitle} placeholder="Add task" required={true}/>
            <button className={s.add_btn} type="submit" >+</button>
        </form>
    )
}

export default AddInput;