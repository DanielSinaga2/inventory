import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="d-flex">
      <div className="bg-dark text-white p-3" style={{ width: "250px", minHeight: "100vh" }}>
        <h4>Inventory</h4>
        <p>Role: {user.role}</p>

        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/products">Products</Link>
          </li>

          {user.role === "admin" && (
            <li className="nav-item">
              <Link className="nav-link text-white" to="/users">Manage Users</Link>
            </li>
          )}
        </ul>

        <button onClick={handleLogout} className="btn btn-danger mt-3">
          Logout
        </button>
      </div>

      <div className="p-4 w-100">
        <Outlet />
      </div>
    </div>
  );
}
