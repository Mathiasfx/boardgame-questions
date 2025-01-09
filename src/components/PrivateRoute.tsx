import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
