import  {IState} from "../interfaces/interfaces";

const getYearNum = (state: IState) => state.yearNum;
const getMonthNum = (state: IState) => state.month;
const getCurrentCard = (state: IState) => state.currentCard;
const getTasks = (state: IState) => state.tasksItems;
const getTasksIds = (state: IState) => state.tasksIds;
const getAllHolidays = (state: IState) => state.allHolidays;
const getFilter = (state: IState) => state.filterWords;
const getError = (state:IState) => state.error;
const getLoading = (state: IState) => state.loading;
const getCurrentMonthInView = (state: IState) => state.isCurrentMonthInView;

const allSelectors = {
    getYearNum,
    getMonthNum,
    getCurrentCard,
    getTasks,
    getTasksIds,
    getAllHolidays,
    getFilter,
    getError,
    getLoading,
    getCurrentMonthInView
}

export default allSelectors;