import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";
import SalesPage from "./pages/SalesPage";
import InvoiceHistoryPage from "./pages/InvoiceHistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={
            <ProtectedRoute><ProductPage /></ProtectedRoute>
          }/>
          <Route path="/sales" element={
            <ProtectedRoute><SalesPage /></ProtectedRoute>
          }/>
          <Route path="/history" element={
            <ProtectedRoute><InvoiceHistoryPage /></ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
