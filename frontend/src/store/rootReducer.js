import { combineReducers } from "@reduxjs/toolkit";
import conferenceReducer from "./conferenceSlice.js"
const rootReducer = combineReducers({
  conference:conferenceReducer,
});

export default rootReducer;
