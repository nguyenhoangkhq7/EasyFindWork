const init= null;
export const userReducers = (state=init, action)=>{
    switch (action.type) {
        case "LOGIN":
           return action.user;
        case "LOGOUT":
            return null;
        default:
            return state;
    }
}