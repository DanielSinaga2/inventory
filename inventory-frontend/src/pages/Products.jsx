import { useState, useEffect } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(saved);
  }, []);

  const saveProducts = (data) => {
    localStorage.setItem("products", JSON.stringify(data));
    setProducts(data);
  };

  const openModal = (index = null) => {
    if (index !== null) {
      const product = products[index];
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock);
      setEditingIndex(index);
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
    setName("");
    setPrice("");
    setStock("");
    setEditingIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price || !stock) {
      alert("Semua field wajib diisi");
      return;
    }

    let updated = [...products];

    if (editingIndex !== null) {
      updated[editingIndex] = { name, price, stock };
      alert("Product berhasil diupdate");
    } else {
      updated.push({ name, price, stock });
      alert("Product berhasil ditambahkan");
    }

    saveProducts(updated);
    closeModal();
  };

  const handleDelete = (index) => {
    if (!window.confirm("Yakin hapus product?")) return;

    const updated = products.filter((_, i) => i !== index);
    saveProducts(updated);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Products</h2>
        <button
          className="btn btn-success"
          onClick={() => openModal()}
        >
          + Create Product
        </button>
      </div>

      <div className="card p-3 mt-3">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th width="200">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  Belum ada product
                </td>
              </tr>
            )}

            {products.map((p, index) => (
              <tr key={index}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => openModal(index)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
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
                    {editingIndex !== null
                      ? "Edit Product"
                      : "Create Product"}
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
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
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
                    {editingIndex !== null ? "Update" : "Create"}
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
