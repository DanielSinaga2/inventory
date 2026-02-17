import { useEffect, useState } from "react";
import API from "../services/api";

const SalesPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    API.get("/api/products").then(res => setProducts(res.data));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, { ...product, qty: 1 }]);
  };

  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const total = cart.reduce((sum, item) =>
    sum + item.Price * item.qty, 0) - discount;

  const checkout = async () => {
    const items = cart.map(c => ({
      productID: c.ID,
      qty: c.qty
    }));

    await API.post("/api/invoices", {
      items,
      discount,
      paymentMethod
    });

    alert("Checkout success");
    setCart([]);
  };

  return (
    <div className="container mt-4">
      <h3>Sales</h3>

      <select className="form-select mb-2"
        onChange={(e)=>setPaymentMethod(e.target.value)}>
        <option value="cash">Cash</option>
        <option value="transfer">Transfer</option>
      </select>

      <input className="form-control mb-2"
        placeholder="Discount"
        onChange={(e)=>setDiscount(Number(e.target.value))}/>

      <h5>Products</h5>
      {products.map(p => (
        <button key={p.ID}
          className="btn btn-outline-primary m-1"
          onClick={()=>addToCart(p)}>
          {p.Name}
        </button>
      ))}

      <h5 className="mt-3">Cart</h5>
      {cart.map((item,index)=>(
        <div key={index}>
          {item.Name} - {item.qty}
          <button className="btn btn-sm btn-danger ms-2"
            onClick={()=>removeItem(index)}>
            X
          </button>
        </div>
      ))}

      <h4>Total: {total}</h4>

      <button className="btn btn-success" onClick={checkout}>
        Checkout
      </button>
    </div>
  );
};

export default SalesPage;
