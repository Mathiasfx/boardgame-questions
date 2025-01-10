import { Button, Typography } from "antd";
import { useAuth } from "../providers/AuthContext";

const { Title } = Typography;

const Dashboard = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };
  const userLink = `${window.location.origin}/game/${currentUser?.uid}`;

  return (
    <div>
      <Title level={3}>Dashboard</Title>
      <p>
        Comparte este enlace para que otros jueguen tu trivia personalizada:
      </p>
      <a href={userLink}>{userLink}</a>
      <p>Bienvenido, {currentUser?.email}</p>
      <Button type="primary" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </div>
  );
};

export default Dashboard;
