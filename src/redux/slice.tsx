import { createSlice, PayloadAction  } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import  {IState, IItem, IResponse} from "../interfaces/interfaces";
import { HolidayAPI } from "../services/api";
import { createDaysOfMonth } from "../helpers";


const holidayAPI = new HolidayAPI();

const initialState: IState = {
    monthsArray:[],
    yearNum: 0,
    month: 1,
    isCurrentMonthInView: false,
    currentCard: null,
    tasksItems: {},
    tasksIds: [],
    allHolidays: null,
    filterWords: '',
    error: null,
    loading: false,
}

function getDayNum(holiday: string) {
    const date = new Date(holiday);
    const holidayDay = date.getDate();
    return holidayDay;
}

function creteYear(yearNum: number) {
    const array = []
    for(let i=1; i <= 12; i++) {
        array.push(createDaysOfMonth(i, yearNum))
    }
    return array;
}

const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        changeYear: (state , action: PayloadAction<number>) => {
            const payload = action.payload;
            state.yearNum = payload;
            if(state.monthsArray) {
                if(state.monthsArray.some(item=>item.year===payload)) {return}
                const index = state.monthsArray.findIndex((item)=>item.number>payload*100)
                state.monthsArray.splice(index, 0, ...creteYear(payload));
            } else {
                state.monthsArray = creteYear(payload)
            }
        },
        changeMonth: (state , action: PayloadAction<number>) => {
            const payload = action.payload;
            const months= state.monthsArray;
            state.month = payload

            if(payload === 1 ) {
                changeYear(state.yearNum - 1)
            }
            if(payload === 12 ) {
                changeYear(state.yearNum + 1)
            }
           
            // if(!months.some(item=>item.month === payload && item.year === state.yearNum)) {
            //     if(!months.some((item)=>item.month === (payload - 1) && item.year === state.yearNum)) {
            //         const index = months.reduce((prev, item, index, array) => {
            //             if(item.year === state.yearNum) {
            //                 if(item.month < payload-1) {prev = index}
            //             } else if(item.year < state.yearNum) {prev = index}
            //             return prev
            //         }, 0);
            //         months.splice(index, 0, createDaysOfMonth(payload-1, state.yearNum))
            //     }
            //     if(!months.some(item=>item.month === (payload+1) && item.year === state.yearNum)) {
            //         months.push(createDaysOfMonth(payload+1, state.yearNum))
            //     }
            //     months.push(createDaysOfMonth(payload, state.yearNum));
            // } else {
            //     if(!months.some(item=>item.month === (payload - 1) && item.year === state.yearNum)) {
            //         months.push(createDaysOfMonth(payload-1, state.yearNum))
            //     }
            //     if(!months.some(item=>item.month === (payload+1) && item.year === state.yearNum)) {
            //         months.push(createDaysOfMonth(payload+1, state.yearNum))
            //     }
            // }
        },
        setCurrentCard: (state , action: PayloadAction<IItem | null>) => {
            state.currentCard = action.payload;
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
        changeTask: (state, action: PayloadAction<{id: string, color: string}>) => {
            const payload = action.payload;
            const currentTask = state.tasksItems[payload.id];
            if(!currentTask) {return}
            if(!currentTask?.labels.includes(action.payload.color)) {
               currentTask?.labels.push(action.payload.color); 
            } else {
                const index = currentTask?.labels.indexOf(action.payload.color);
                currentTask?.labels.splice(index, 1)
            }
            
        },
        filterByLabels: (state, action: PayloadAction<string>) => {
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
            state.allHolidays = action.payload;
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

export const {toggleInViewMonth, addNewTask, deleteTask, setCurrentCard, replaceTask, changeTask, changeYear, changeMonth, filterByLabels } = calendarSlice.actions;
export default reducer;