import { useContext } from "react";
import { Store } from "./store";
const useAuth = () => {
  const { state } = useContext(Store);
  const {
    auth: { user },
  } = state;
  if (!user) {
    return false;
  }
  return true;
};
export default useAuth;
