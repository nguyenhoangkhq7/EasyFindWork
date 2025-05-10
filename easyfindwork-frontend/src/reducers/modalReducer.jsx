const init = { openLoginModal: false };

export const modalReducer = (state = init, action) => {
  switch (action.type) {
    case "OPEN_LOGIN_MODAL":
      return {
        ...state,
        openLoginModal: true,
      };

    case "CLOSE_LOGIN_MODAL":
      return {
        ...state,
        openLoginModal: false,
      };

    default:
      return state;
  }
};
