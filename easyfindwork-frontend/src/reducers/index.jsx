import { combineReducers } from "redux";
import { userReducers } from "./userReducers";
import { jobOpportunityReducers } from "./jobOpportunityReducers";
import { modalReducer } from "./modalReducer";

export const allReducers = combineReducers({
  user: userReducers,
  jobIndusOpp: jobOpportunityReducers,
  modal: modalReducer,
});
