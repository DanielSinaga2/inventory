import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users"));

    if (!users) {
      const defaultAdmin = [
        { username: "admin", password: "admin123", role: "admin" }
      ];
      localStorage.setItem("users", JSON.stringify(defaultAdmin));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(username, password);

    if (success) {
      navigate("/dashboard");
    } else {
      alert("Login gagal");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          className="form-control mb-2"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}
