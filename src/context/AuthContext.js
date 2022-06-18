import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";

const AuthContext = createContext({
  user: null,
  logout: () => {},
});

export async function getServerSideProps(context) {
  return {
    props: { aku: "dia" },
  };
}

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/auth/isLogin`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  const logout = async () => {
    const out = await axios.get("/api/auth/logout");
    Router.push("/login");
  };

  const context = { user, logout };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
