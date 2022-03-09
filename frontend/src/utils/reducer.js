export const reducer = (state, action) => {
  switch (action.type) {
    case "USER_LOGIN": {
      const user = action.payload;
      localStorage.setItem("user", JSON.stringify(user));
      return { ...state, auth: { user } };
    }
    case "USER_LOGOUT": {
      localStorage.removeItem("user");
      return { ...state, auth: { user: null } };
    }
    default:
      return state;
  }
};
