import { createContext, useReducer } from "react";
import { reducer } from "./reducer";

export const Store = createContext();

const initialState = {
  auth: {
    user: JSON.parse(localStorage.getItem("user")),
  },
};
export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
