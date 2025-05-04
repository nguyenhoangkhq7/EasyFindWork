const init= null;
export const userReducers = (state=init, action)=>{
    switch (action.type) {
        case "LOGIN":
           return action.user;
        case "LOGOUT":
            return null;
        case "UPDATE":
            return action.user;
        case "UPDATE_IMG":
            return {...state, avatar: action.url};
        default:
            return state;
    }
}