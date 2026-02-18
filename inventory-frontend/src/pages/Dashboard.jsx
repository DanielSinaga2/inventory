export default function Dashboard() {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="card p-3 mt-3">
        <h5>Total Products: {products.length}</h5>
      </div>
    </div>
  );
}
