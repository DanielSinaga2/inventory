import { useState, useEffect, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

export default function Users() {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      alert("Unauthorized");
    }
  };

  const openModal = (u = null) => {
    if (u) {
      setEditingUser(u);
      setUsername(u.username);
      setPassword(u.password);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Semua field wajib diisi");
      return;
    }

    try {
      if (editingUser) {
        await API.put(`/users/${editingUser.id}`, {
          username,
          password,
        });
        alert("User berhasil diupdate");
      } else {
        await API.post("/users", {
          username,
          password,
        });
        alert("Staff berhasil ditambahkan");
      }

      fetchUsers();
      closeModal();
    } catch (err) {
      alert("Terjadi kesalahan");
    }
  };

  const handleDelete = async (id) => {
    if (user.id === id) {
      alert("Tidak bisa hapus akun sendiri");
      return;
    }

    if (!window.confirm("Yakin hapus user?")) return;

    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Manage Users</h2>
        <button className="btn btn-success" onClick={() => openModal()}>
          + Create Staff
        </button>
      </div>

      <div className="card p-3 mt-3">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th width="200">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
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
                        onClick={() => handleDelete(u.id)}
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
                <td colSpan="4" className="text-center">
                  Belum ada user
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal show fade d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingUser ? "Edit Staff" : "Create Staff"}
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
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
