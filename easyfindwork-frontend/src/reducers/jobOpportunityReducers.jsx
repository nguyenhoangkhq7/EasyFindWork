export const jobOpportunityReducers= (state= null, action)=>{
    switch (action.type) {
        case "SET_SELECTED_INDUSTRY":
            return action.payload;
        
        default:
            return state;
    }
}