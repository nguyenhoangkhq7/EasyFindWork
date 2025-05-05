import { combineReducers } from "redux";
import { userReducers } from "./userReducers";

export const allReducers=combineReducers({
    user: userReducers,
});