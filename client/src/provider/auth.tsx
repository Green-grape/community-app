import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { User } from "../common/types";

//이후 강의에서 createdAt, updatedAt을 사용하지 않으면 interface & server 코드 변경
interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}

interface AuthAction {
  type: string;
  payload: User | undefined;
}

const StateContext = createContext<State>({
  user: undefined,
  authenticated: false,
  loading: true,
});

const DispatchContext = createContext<any>(null);

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);

const reducer = (state: State, { type, payload }: AuthAction) => {
  switch (type) {
    case "LOGIN":
      return { ...state, authenticated: true, loading: false, user: payload };
    case "LOGOUT":
      return { ...state, authenticated: false, user: undefined };
    case "STOP_LOADING":
      return { ...state, loading: false };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: undefined,
    authenticated: false,
    loading: true,
  });
  const dispatch = (type: string, payload?: User) => {
    defaultDispatch({ type, payload });
  };
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get("auth/check");
        if (res.data) dispatch("LOGIN", res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch("STOP_LOADING");
      }
    }
    loadUser();
  }, []);
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};
