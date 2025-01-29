import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";
import { useEffect, useState } from "react";

const PrivateRoute = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser !== undefined) {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return <div>Cargando...</div>; // Puedes personalizar el loading
  }

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
