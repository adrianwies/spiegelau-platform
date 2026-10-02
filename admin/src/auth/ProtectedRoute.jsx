import {
  Navigate,
  Outlet,
} from "react-router-dom";


import { useAuth } from "./AuthContext";


function ProtectedRoute() {
  const {
    user,
    loading,
  } = useAuth();


  if (loading) {
    return (
      <div className="auth-loading">
        Verificando sesión...
      </div>
    );
  }


  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return <Outlet />;
}


export default ProtectedRoute;