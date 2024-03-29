import React, { useEffect, useState } from "react";
import s from './Filter.module.scss'
import { useAppDispatch } from "../../redux/hooks";
import { filterByWord } from "../../redux/slice";

const Filter: React.FC = () => {
    const [text, setText] = useState('');

    const dispatch = useAppDispatch();

    const handlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    }

    useEffect(()=>{
        dispatch(filterByWord(text.trim()))
    },[text]);

    return (
        <div className={s.filter}>
            <form className={s.filter_form} onSubmit={(e)=>{e.preventDefault()}}>
                <input type="text" value={text} onChange={handlInput} placeholder="Search tasks"/>
            </form>
        </div>
    )
}

export default Filter;