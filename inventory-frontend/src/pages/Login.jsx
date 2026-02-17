import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate("/products");
  };

  return (
    <div className="container mt-5">
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <input className="form-control mb-2" placeholder="Email"
          value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" className="form-control mb-2"
          placeholder="Password"
          value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
