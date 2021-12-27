import { createContext, useContext, useReducer } from "react";
import { createTheme } from "@mui/material/styles";
import { orange } from "@mui/material/colors";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0097a7",
    },
    secondary: orange,
  },
});
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0097a7",
    },
    secondary: orange,
  },
});

const drawerWidth = 230;
const initialState = {
  toggleSidebar: true,
  closeSidebar: false,
  darkMode: false,
};
function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, toggleSidebar: action.value };
    case "CLOSE_SIDEBAR":
      return { ...state, closeSidebar: action.value };
    case "DARKMODE":
      return { ...state, darkMode: action.value };
    default:
      throw new Error();
  }
}

const RizkiFach = createContext();
const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <RizkiFach.Provider value={[state, dispatch]}>
      {children}
    </RizkiFach.Provider>
  );
};

const useRizkiContext = () => {
  const context = useContext(RizkiFach);
  return context;
};

const setToggleSidebar = (dispatch, value) =>
  dispatch({ type: "TOGGLE_SIDEBAR", value });
const setCloseSidebar = (dispatch, value) =>
  dispatch({ type: "CLOSE_SIDEBAR", value });
const setDarkMode = (dispatch, value) => dispatch({ type: "DARKMODE", value });

export {
  darkTheme,
  lightTheme,
  drawerWidth,
  RizkiFach,
  useRizkiContext,
  ContextProvider,
  setToggleSidebar,
  setCloseSidebar,
  setDarkMode,
};
