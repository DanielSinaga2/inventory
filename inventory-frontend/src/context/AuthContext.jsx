import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, password) => {
    try {
      const res = await API.post("/api/login", {
        username,
        password,
      });

      const token = res.data.token;
      const loggedUser = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      setUser(loggedUser);

      // role routing
      if (loggedUser.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/products");
      }

      return true;
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);
      alert("Login failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
