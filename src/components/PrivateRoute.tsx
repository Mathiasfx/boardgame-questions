import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";
import { useState, useEffect } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    // Verifica si el currentUser está definido
    if (currentUser === null) {
      setLoading(false); // Si el usuario está desconectado, también terminamos la carga
    }
    if (currentUser) {
      setLoading(false); // Si el usuario está conectado, también terminamos la carga
    }
  }, [currentUser]);

  if (loading) {
    return <div>Cargando...</div>; // Puedes personalizar lo que quieras mostrar mientras verificas la sesión
  }

  return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
