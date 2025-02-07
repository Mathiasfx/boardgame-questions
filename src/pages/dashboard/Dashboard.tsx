import React, { useState } from "react";

import { Button, Flex, Layout, Menu, Typography } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
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
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="8" fill="#004794" />

              <rect
                x="8"
                y="8"
                width="24"
                height="24"
                rx="3"
                stroke="white"
                stroke-width="2"
              />
              <line
                x1="20"
                y1="8"
                x2="20"
                y2="32"
                stroke="white"
                stroke-width="2"
              />
              <line
                x1="8"
                y1="20"
                x2="32"
                y2="20"
                stroke="white"
                stroke-width="2"
              />

              <circle cx="30" cy="30" r="4" fill="white" />
            </svg>
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
            <Route path="inicio" element={null} />
            <Route path="perfil" element={<Profile />} />
            <Route path="games" element={<MyGames />} />
            <Route path="configuracion" element={null} />
            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="inicio" />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
