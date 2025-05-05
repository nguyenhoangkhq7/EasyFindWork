const init = JSON.parse(localStorage.getItem("user")) || null;

export const userReducers = (state = init, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.user));
      return action.user;

    case "LOGOUT":
      localStorage.removeItem("user");
      return null;

    case "UPDATE":
      const updatedUser = action.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;

    case "UPDATE_IMG":
      const newState = { ...state, avatar: action.url };
      localStorage.setItem("user", JSON.stringify(newState));
      return newState;

    default:
      return state;
  }
};
