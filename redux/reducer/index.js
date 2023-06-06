import DataReducer from './DataReducer';
import ApiReducer from './ApiReducer';
import SheetReducer from './SheetReducer';
import DetailReducer from './DetailReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    DataReducer, ApiReducer, SheetReducer,
    DetailReducer
})

export default rootReducer