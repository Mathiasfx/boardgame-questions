import { Button, Typography } from "antd";
import { useAuth } from "../providers/AuthContext";

const { Title } = Typography;

const Dashboard = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      <Title level={3}>Dashboard</Title>
      <p>Bienvenido, {currentUser?.email}</p>
      <Button type="primary" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </div>
  );
};

export default Dashboard;
