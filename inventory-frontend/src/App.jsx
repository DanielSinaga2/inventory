import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Users from "./pages/Users";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {user && (
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />

            {user.role === "admin" && (
              <Route path="/users" element={<Users />} />
            )}
          </Route>
        )}

        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
