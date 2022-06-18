import { createContext, useContext, useReducer, useRef } from "react";
import { red } from "@mui/material/colors";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const getDesignTokens = (mode, primary, secondary) => ({
  palette: {
    mode: mode,
    primary: {
      main: primary,
    },
    secondary: {
      main: secondary,
    },
  },
});

const drawerWidth = 230;
function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, toggleSidebar: action.value };
    case "CLOSE_SIDEBAR":
      return { ...state, closeSidebar: action.value };
    case "TOGGLE_SETTING":
      return { ...state, toggleSetting: action.value };
    case "DARKMODE":
      return { ...state, darkMode: action.value };
    case "CHANGE_PRIMARY_COLOR":
      return { ...state, primary: action.value };
    case "CHANGE_SECONDARY_COLOR":
      return { ...state, secondary: action.value };
    default:
      throw new Error();
  }
}

const setToggleSidebar = (dispatch, value) =>
  dispatch({ type: "TOGGLE_SIDEBAR", value });
const setCloseSidebar = (dispatch, value) =>
  dispatch({ type: "CLOSE_SIDEBAR", value });
const setToggleSetting = (dispatch, value) =>
  dispatch({ type: "TOGGLE_SETTING", value });
const setPrimaryColor = (dispatch, value) =>
  dispatch({ type: "CHANGE_PRIMARY_COLOR", value });
const setSecondaryColor = (dispatch, value) =>
  dispatch({ type: "CHANGE_SECONDARY_COLOR", value });
const setDarkMode = (dispatch, value) => dispatch({ type: "DARKMODE", value });

const RizkiFach = createContext();

const useRizkiContext = () => {
  const context = useContext(RizkiFach);
  return context;
};

const ContextProvider = ({ children }) => {
  const router = useRouter();
  const initialState = {
    toggleSidebar: true,
    closeSidebar: false,
    toggleSetting: false,
    darkMode: false,
    primary: "#0097a7",
    secondary: red[800],
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      const settingDisplay = localStorage.getItem("settingDisplay");
      if (settingDisplay) {
        const setting = JSON.parse(settingDisplay);
        dispatch({ type: "DARKMODE", value: setting.darkMode });
        dispatch({ type: "CHANGE_PRIMARY_COLOR", value: setting.primary });
        dispatch({ type: "CHANGE_SECONDARY_COLOR", value: setting.secondary });
      }
      return;
    }
    localStorage.setItem("settingDisplay", JSON.stringify(state));
  }, [state.darkMode, state.primary, state.secondary]);

  useEffect(() => {
    const isMobile =
      window.matchMedia && window.matchMedia("(max-width: 480px)").matches;
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
  drawerWidth,
  RizkiFach,
  getDesignTokens,
  useRizkiContext,
  ContextProvider,
  setToggleSidebar,
  setCloseSidebar,
  setDarkMode,
  setToggleSetting,
  setPrimaryColor,
  setSecondaryColor,
};
