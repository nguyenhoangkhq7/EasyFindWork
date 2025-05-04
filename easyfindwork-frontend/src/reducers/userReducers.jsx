const init = JSON.parse(localStorage.getItem("user")) || null;

export const userReducers = (state = init, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.user));
      return action.user;

    case "LOGOUT":
      localStorage.removeItem("user");
      return null;

    default:
      return state;
  }
};
