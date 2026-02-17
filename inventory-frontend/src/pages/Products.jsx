import { useEffect, useState } from "react";
import API from "../services/api";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  const fetchProducts = async () => {
    const res = await API.get("/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {
    await API.post("/api/products", form);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await API.delete(`/api/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="container mt-4">
      <h3>Products</h3>

      <div className="mb-3">
        <input className="form-control mb-2" placeholder="Name"
          onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <input className="form-control mb-2" placeholder="Price"
          onChange={(e)=>setForm({...form,price:e.target.value})}/>
        <input className="form-control mb-2" placeholder="Stock"
          onChange={(e)=>setForm({...form,stock:e.target.value})}/>
        <button className="btn btn-success" onClick={addProduct}>
          Add Product
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.ID}>
              <td>{p.Name}</td>
              <td>{p.Price}</td>
              <td>{p.Stock}</td>
              <td>
                <button className="btn btn-danger btn-sm"
                  onClick={()=>deleteProduct(p.ID)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductPage;
