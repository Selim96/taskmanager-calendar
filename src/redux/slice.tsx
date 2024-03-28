import { createSlice, PayloadAction  } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import  {IState, IItem, IResponse, IMonth} from "../interfaces/interfaces";
import { HolidayAPI } from "../services/api";
import { createDaysOfMonth } from "../helpers";

const holidayAPI = new HolidayAPI();

const initialState: IState = {
    monthsArray:{},
    monthsIds: [],
    yearNum: 0,
    month: 1,
    isCurrentMonthInView: false,
    tasksItems: {},
    tasksIds: [],
    allHolidays: {},
    filterWords: 'all',
    lable: 'all',
    error: null,
    loading: false,
}

function getDayNum(holiday: string) {
    const date = new Date(holiday);
    const holidayDay = date.getDate();
    return holidayDay;
}

function creteYear(yearNum: number) {
    let fullYear: Record<number, IMonth> = {};
    const ids: number[] = [];
    for(let i=1; i <= 12; i++) {
        const yearString = yearNum.toString();
        const monthString = i.toString().padStart(2, '0');
        const recordNum = Number(yearString+monthString)
        fullYear = {...fullYear, [recordNum]: createDaysOfMonth(i, yearNum)}
        ids.push(recordNum);
    }
    return {fullYear, ids};
}

const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        changeYear: (state , action: PayloadAction<number>) => {
            const payload = action.payload;
            state.yearNum = payload;
            if(state.monthsArray) {
                if(Object.keys(state.monthsArray).some(item=> Math.round(Number(item) / 100) === payload)) {return}
                const {fullYear, ids} = creteYear(payload);
                state.monthsArray = {...state.monthsArray, ...fullYear};
                const index1 = state.monthsIds.findIndex((item)=>payload*100 - item < 0)
                const index2 = state.monthsIds.findIndex((item)=>item - payload*100 > 0)
                console.log(index2)
                if(index2 === -1) {
                    state.monthsIds.push(...ids);
                } else {
                    state.monthsIds.splice(Math.max(index1, index2), 0, ...ids);
                }
            } else {
                const {fullYear, ids} = creteYear(payload);
                state.monthsArray = {...fullYear};
                state.monthsIds = [...ids];
            }
        },
        changeMonth: (state , action: PayloadAction<{year: number, month:number}>) => {
            const {year, month} = action.payload;
            state.month = month;
            if(state.yearNum !== year) state.yearNum = year;

            if(month === 1 ) {
                console.log('payload 1')
                if(state.monthsIds.some(item=>Math.round(item/100)=== year - 1)) {return};
                const {fullYear, ids} = creteYear(state.yearNum-1);
                state.monthsArray = {...state.monthsArray, ...fullYear};
                const index = state.monthsIds.findIndex((item)=>item>(state.yearNum-1)*100);
                state.monthsIds.splice(index, 0, ...ids);
            }
            if(month === 12 ) {
                console.log('payload 12')
                if(state.monthsIds.some(item=>Math.round(item/100)=== year + 1)) {return};
                const {fullYear, ids} = creteYear(state.yearNum+1);
                state.monthsArray = {...state.monthsArray, ...fullYear};
                const index = state.monthsIds.indexOf(state.yearNum*100+12)+1;
                state.monthsIds.splice(index, 0, ...ids);

                // if(monthsState.some(item=>item.year===state.yearNum+1)) {return}
                // const index = monthsState.findIndex(item=>item.year === year && item.month === month)
                // monthsState.splice(index+1, 0, ...creteYear(state.yearNum+1));
            }
        },
        addNewTask: (state, action: PayloadAction<IItem>) => {
            const data = action.payload;
            state.tasksIds.push(data.id);
            state.tasksItems[data.id] = data;
        },
        deleteTask: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            delete state.tasksItems[id];
            state.tasksIds = state.tasksIds.filter(item=> item!==id);
        },
        replaceTask: (state, action: PayloadAction<{id: string, date: string}>) => {
            const payload = action.payload;
            const currentTask = state.tasksItems[payload.id];
            if(!currentTask) {return} 
            currentTask.date = payload.date;
        },
        changeTask: (state, action: PayloadAction<{id: string, color: string, text?: string}>) => {
            const payload = action.payload;
            const currentTask = state.tasksItems[payload.id];
            if(!currentTask) {return}
            if(!payload.text) {
                if(!currentTask?.labels.includes(payload.color)) {
                    currentTask.labels = [...currentTask?.labels, payload.color];
                 } else {
                     const index = currentTask?.labels.indexOf(payload.color);
                     currentTask?.labels.splice(index, 1)
                 }
            } else {
                currentTask.title = payload.text;
            }
        },
        filterByLabels: (state, action: PayloadAction<string>) => {
            state.lable = action.payload;
        },
        filterByWord: (state, action: PayloadAction<string>) => {
            state.filterWords = action.payload;
        },
        toggleInViewMonth: (state, action:PayloadAction<boolean> ) => {
            state.isCurrentMonthInView = action.payload;
        },
    },
    extraReducers:(builder) => {
        builder.addCase(holidayAPI.getPublicHolidays.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(holidayAPI.getPublicHolidays.fulfilled, (state: IState, action: PayloadAction<IResponse[]>) => {
            state.loading = false;
            action.payload.forEach((item)=>{
                const {date} = item;
                state.allHolidays = {...state.allHolidays, [date.toString()]: item}
            })
        });
        builder.addCase(holidayAPI.getPublicHolidays.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
            if (payload) {
                toast.error("Error to load holidays!");
            }
        });
        
    }
});

const reducer = calendarSlice.reducer;

export const {filterByWord, toggleInViewMonth, addNewTask, deleteTask, replaceTask, changeTask, changeYear, changeMonth, filterByLabels } = calendarSlice.actions;
export default reducer;