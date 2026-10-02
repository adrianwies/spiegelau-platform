import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./auth/ProtectedRoute";

import AdminLayout from "./components/layout/AdminLayout";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import CollectionsPage from "./pages/CollectionsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/products" replace />} />

          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/products" element={<ProductsPage />} />

          <Route path="/products/:id" element={<ProductDetailPage />} />

          <Route path="/categories" element={<CategoriesPage />} />

          <Route path="/collections" element={<CollectionsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/products" replace />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default App;
