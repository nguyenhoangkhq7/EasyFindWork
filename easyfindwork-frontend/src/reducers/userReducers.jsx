const init = null;
export const userReducers = (state = init, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("userId", action.user.id);
      return {
        ...action.user,
        cvs: Array.isArray(action.user.cvs) ? action.user.cvs : [],
      };

    case "LOGOUT":
      localStorage.removeItem("userId");
      return null;

    case "SET_USER":
      return {
        ...action.user,
        cvs: Array.isArray(action.user.cvs) ? action.user.cvs : [],
      };

    case "UPDATE_USER":
      return {
        ...state,
        ...action.payload,
        cvs: Array.isArray(action.payload.cvs)
          ? action.payload.cvs
          : state.cvs || [],
      };

    case "UPDATE_IMG":
      return {
        ...state,
        avatar: action.url,
      };

    default:
      return state;
  }
};
