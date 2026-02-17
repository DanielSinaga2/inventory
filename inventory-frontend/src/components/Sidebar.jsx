import { Link } from "react-router-dom";

export default function Sidebar() {
    const role = localStorage.getItem("role");

    return (
        <div className="bg-light p-3" style={{ width: "250px", minHeight: "100vh" }}>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">
                        Dashboard
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to="/products" className="nav-link">
                        Products
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to="/sales" className="nav-link">
                        Sales
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to="/invoice-history" className="nav-link">
                        Invoice History
                    </Link>
                </li>

                {role === "admin" && (
                    <li className="nav-item">
                        <Link to="/users" className="nav-link">
                            Users
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
}
