export default function Navbar() {
  const role = localStorage.getItem("role");

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">Inventory System</span>
      <span className="text-white">Role: {role}</span>
    </nav>
  );
}
