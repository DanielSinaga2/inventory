import { useState } from "react";
import API from "../services/api";

const CreateStaff = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const createStaff = async () => {
    if (!form.username || !form.password) {
      alert("All fields required");
      return;
    }

    await API.post("/api/create-staff", form);
    alert("Staff created!");
    setForm({ username: "", password: "" });
  };

  return (
    <div className="container mt-4">
      <h3>Create Staff Account</h3>

      <div className="card p-3">
        <input
          className="form-control mb-2"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
        <button className="btn btn-primary" onClick={createStaff}>
          Create Staff
        </button>
      </div>
    </div>
  );
};

export default CreateStaff;
