import { configureStore } from "@reduxjs/toolkit";
import reducer from "./slice";
import { IItem } from "../interfaces/interfaces";


const saveToLocalStorage = (data: Record<string, IItem> | undefined) => {
  try {
    localStorage.setItem('calendar_data', JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
};

const loadFromLocalStorage = () => {
  try {
    const dataStr = localStorage.getItem('calendar_data');
    return dataStr ? JSON.parse(dataStr) : {};
  } catch (e) {
    console.error(e);
    return null;
  }
};

const persistedStore = loadFromLocalStorage();
const ids = Object.keys(persistedStore)

export const store = configureStore({
  reducer,
  preloadedState: {
    tasksItems: persistedStore,
    tasksIds: ids
  },
});

store.subscribe(() => {
  saveToLocalStorage(store.getState().tasksItems)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;