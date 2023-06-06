import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducer";
import ReduxThunk from "redux-thunk";

let composeEnhancers = compose;

if (__DEV__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(ReduxThunk)));
  
export default store
