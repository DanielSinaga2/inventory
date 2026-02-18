import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Users() {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const saved = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(saved);
  };

  const saveUsers = (data) => {
    localStorage.setItem("users", JSON.stringify(data));
    setUsers(data);
  };

  const openModal = (u = null) => {
    if (u) {
      setUsername(u.username);
      setPassword(u.password);
      setEditingUser(u.username);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setEditingUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Semua field wajib diisi");
      return;
    }

    let updated = [...users];

    if (editingUser) {
      updated = users.map((u) =>
        u.username === editingUser
          ? { ...u, username, password }
          : u
      );
      alert("User berhasil diupdate");
    } else {
      const duplicate = users.find((u) => u.username === username);
      if (duplicate) {
        alert("Username sudah digunakan");
        return;
      }

      updated.push({
        username,
        password,
        role: "staff"
      });

      alert("Staff berhasil ditambahkan");
    }

    saveUsers(updated);
    closeModal();
  };

  const handleDelete = (usernameToDelete) => {
    if (usernameToDelete === user.username) {
      alert("Tidak bisa menghapus akun sendiri");
      return;
    }

    if (!window.confirm("Yakin hapus user?")) return;

    const filtered = users.filter(
      (u) => u.username !== usernameToDelete
    );

    saveUsers(filtered);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Manage Users</h2>
        <button
          className="btn btn-success"
          onClick={() => openModal()}
        >
          + Create Staff
        </button>
      </div>

      <div className="card p-3 mt-3">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th width="200">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={index}>
                <td>{u.username}</td>
                <td>
                  <span
                    className={
                      u.role === "admin"
                        ? "badge bg-primary"
                        : "badge bg-secondary"
                    }
                  >
                    {u.role}
                  </span>
                </td>
                <td>
                  {u.role !== "admin" && (
                    <>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => openModal(u)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleDelete(u.username)
                        }
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center">
                  Belum ada user
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal show fade d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingUser
                      ? "Edit Staff"
                      : "Create Staff"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>

                <div className="modal-body">
                  <input
                    className="form-control mb-2"
                    placeholder="Username"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                  />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-success">
                    {editingUser ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
