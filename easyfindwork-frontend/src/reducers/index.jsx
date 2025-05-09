import { combineReducers } from "redux";
import { userReducers } from "./userReducers";
import { jobOpportunityReducers } from "./jobOpportunityReducers";

export const allReducers=combineReducers({
    user: userReducers,
    jobIndusOpp: jobOpportunityReducers
});