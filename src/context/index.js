import { createContext, useContext, useReducer } from "react";
import { createTheme } from "@mui/material/styles";
import { orange } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const getDesignTokens = (mode) => ({
  palette: {
    mode: mode,
    primary: {
      main: "#0097a7",
    },
    secondary: orange,
  },
});

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

const setToggleSidebar = (dispatch, value) =>
  dispatch({ type: "TOGGLE_SIDEBAR", value });
const setCloseSidebar = (dispatch, value) =>
  dispatch({ type: "CLOSE_SIDEBAR", value });
const setDarkMode = (dispatch, value) => dispatch({ type: "DARKMODE", value });

const useRizkiContext = () => {
  const context = useContext(RizkiFach);
  return context;
};

const RizkiFach = createContext();

const ContextProvider = ({ children }) => {
  const router = useRouter();
  const isMobile =
    window.matchMedia && window.matchMedia("(max-width: 480px)").matches;
  const initialState = {
    toggleSidebar: isMobile ? false : true,
    closeSidebar: false,
    darkMode: false,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    toast.dismiss();
    if (isMobile) dispatch({ type: "TOGGLE_SIDEBAR", value: false });
  }, [router]);
  return (
    <RizkiFach.Provider value={[state, dispatch]}>
      {children}
    </RizkiFach.Provider>
  );
};

export {
  darkTheme,
  lightTheme,
  drawerWidth,
  RizkiFach,
  getDesignTokens,
  useRizkiContext,
  ContextProvider,
  setToggleSidebar,
  setCloseSidebar,
  setDarkMode,
};
