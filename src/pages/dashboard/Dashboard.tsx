import React, { useState } from "react";

import { Button, Flex, Layout, Menu, Typography } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FlagFilled,
  HomeOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Profile from "./profile/Profile";
import { useAuth } from "../../providers/AuthContext";
import MyGames from "./myGames/myGames";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        theme="light"
        trigger={null}
        collapsed={collapsed}
        className="sider"
      >
        <Flex align="center" justify="center">
          <div className="logo-sider">
            <FlagFilled />
          </div>
        </Flex>
        <Menu
          className="menu-bar"
          theme="light"
          mode="inline"
          onClick={({ key }) => navigate(key)} // Navegar a la ruta seleccionada
          defaultSelectedKeys={["/dashboard/inicio"]}
          items={[
            {
              key: "/dashboard/inicio",
              icon: <HomeOutlined />,
              label: "Inicio",
            },

            {
              key: "/dashboard/perfil",
              icon: <UserOutlined />,
              label: "Perfil",
            },
            {
              key: "/dashboard/games",
              icon: <UnorderedListOutlined />,
              label: "Mis Juegos",
            },
            {
              key: "/dashboard/configuracion",
              icon: <SettingOutlined />,
              label: "Configuración",
            },
          ]}
        />
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="trigger-btn"
        />
      </Sider>

      {/* Layout Principal */}
      <Layout>
        {/* Header */}
        <Header className="header">
          <Flex align="center" justify="space-between">
            <Typography.Title level={3} type="secondary">
              Bienvenido {currentUser?.displayName}
            </Typography.Title>
            <Flex align="center" gap="10px">
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
            </Flex>
          </Flex>
        </Header>

        {/* Contenido Principal */}
        <Content className="content">
          <Routes>
            <Route path="inicio" element={<p>Inicio</p>} />
            <Route path="perfil" element={<Profile />} />
            <Route path="games" element={<MyGames />} />
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
