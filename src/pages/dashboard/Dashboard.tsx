import React from "react";
import { Layout, Menu, Typography } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Profile from "./profile/Profile";
import { useAuth } from "../../providers/AuthContext";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible style={{ background: "#001529" }}>
        <div
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: "1.2rem",
            margin: "16px 0",
          }}
        >
          <strong>Dashboard</strong>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={({ key }) => navigate(key)} // Navegar a la ruta seleccionada
          defaultSelectedKeys={["/dashboard/inicio"]}
          items={[
            {
              key: "/dashboard/inicio",
              icon: <DashboardOutlined />,
              label: "Inicio",
            },
            {
              key: "/dashboard/perfil",
              icon: <UserOutlined />,
              label: "Perfil",
            },
            {
              key: "/dashboard/configuracion",
              icon: <SettingOutlined />,
              label: "Configuración",
            },
          ]}
        />
      </Sider>

      {/* Layout Principal */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f0f2f5",
            padding: "0 16px",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Bienvenido, {currentUser?.email || "Usuario"}
          </Title>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#f5222d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              width: "30px",
              height: "30px",
            }}
          >
            <LogoutOutlined rotate={270} />
          </button>
        </Header>

        {/* Contenido Principal */}
        <Content
          style={{ margin: "16px", padding: "24px", background: "#fff" }}
        >
          <Routes>
            <Route path="inicio" element={<p>Inicio</p>} />
            <Route path="perfil" element={<Profile />} />
            <Route path="configuracion" element={<p>Configuracion</p>} />
            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="inicio" />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
