import { useState, useEffect } from "react";
import API from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      alert("Unauthorized, silakan login ulang");
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock);
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
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !stock) {
      alert("Semua field wajib diisi");
      return;
    }

    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct.id}`, {
          name,
          price: parseFloat(price),
          stock: parseInt(stock),
        });
        alert("Product berhasil diupdate");
      } else {
        await API.post("/products", {
          name,
          price: parseFloat(price),
          stock: parseInt(stock),
        });
        alert("Product berhasil ditambahkan");
      }

      fetchProducts();
      closeModal();
    } catch (err) {
      alert("Terjadi kesalahan");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus product?")) return;

    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Products</h2>
        <button className="btn btn-success" onClick={() => openModal()}>
          + Create Product
        </button>
      </div>

      <div className="card p-3 mt-3">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th width="200">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  Belum ada product
                </td>
              </tr>
            )}

            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => openModal(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
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
                    {editingProduct ? "Edit Product" : "Create Product"}
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
                    {editingProduct ? "Update" : "Create"}
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
