import  {IState} from "../interfaces/interfaces";

const getYearNum = (state: IState) => state.yearNum;
const getMonthNum = (state: IState) => state.month;
const getTasks = (state: IState) => state.tasksItems;
const getTasksIds = (state: IState) => state.tasksIds;
const getAllHolidays = (state: IState) => state.allHolidays;
const getFilter = (state: IState) => state.filterWords;
const getLable = (state: IState) => state.lable;
const getError = (state:IState) => state.error;
const getLoading = (state: IState) => state.loading;
const getCurrentMonthInView = (state: IState) => state.isCurrentMonthInView;
const getMonthArray = (state: IState) => state.monthsArray;
const getMonthIds = (state: IState) => state.monthsIds;

const allSelectors = {
    getYearNum,
    getMonthNum,
    getTasks,
    getTasksIds,
    getAllHolidays,
    getFilter,
    getLable,
    getError,
    getLoading,
    getCurrentMonthInView,
    getMonthArray,
    getMonthIds
}

export default allSelectors;