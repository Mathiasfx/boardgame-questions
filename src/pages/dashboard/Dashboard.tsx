import { Button, Card, Col, Menu, Row, Typography } from "antd";
import { useAuth } from "../../providers/AuthContext";
import { Layout, Drawer } from "antd";
import {
  DashboardOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Header, Sider, Content } = Layout;
//import { useNavigate } from "react-router-dom";
//import { doc, getDoc, getFirestore } from "firebase/firestore";
//import { useEffect } from "react";

const { Title } = Typography;

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false); // Para el sider responsivo
  const [drawerVisible, setDrawerVisible] = useState(false); // Para el menú en dispositivos pequeños
  //const navigate = useNavigate();
  //const db = getFirestore();

  // useEffect(() => {
  //   const checkUserProfile = async () => {
  //     if (currentUser) {
  //       const userRef = doc(db, "users", currentUser.uid);
  //       const userSnap = await getDoc(userRef);
  //       if (userSnap.exists()) {
  //         const userData = userSnap.data();
  //         if (!userData.name) {
  //           navigate("/profile");
  //         }
  //       }
  //     }
  //   };
  //   checkUserProfile();
  // }, [currentUser, db, navigate]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar (para pantallas grandes) */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="0" // Ocultar completamente en pantallas pequeñas
        style={{ background: "#001529" }}
      >
        <div
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: "1.2rem",
            margin: "16px 0",
          }}
        >
          <strong>Boardgame</strong>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            { key: "1", icon: <DashboardOutlined />, label: "Inicio" },
            { key: "2", icon: <UserOutlined />, label: "Perfil" },
            { key: "3", icon: <SettingOutlined />, label: "Configuración" },
          ]}
        />
      </Sider>

      {/* Drawer (para pantallas pequeñas) */}
      <Drawer
        title="Menú"
        placement="left"
        closable
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            { key: "1", icon: <DashboardOutlined />, label: "Inicio" },
            { key: "2", icon: <UserOutlined />, label: "Perfil" },
            { key: "3", icon: <SettingOutlined />, label: "Configuración" },
          ]}
        />
      </Drawer>

      <Layout>
        {/* Header */}
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#F5F5F5",
            padding: "0 16px",
          }}
        >
          {/* Botón para abrir el menú en pantallas pequeñas */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
            style={{ display: "inline-block", marginRight: "16px" }}
          />
          <Title level={2} style={{ margin: 0, flex: 1, textAlign: "center" }}>
            Dashboard
          </Title>
          <Button
            type="default"
            onClick={handleLogout}
            style={{ backgroundColor: "#f56954", color: "white" }}
          >
            <LogoutOutlined />
          </Button>
        </Header>

        {/* Content */}
        <Content
          style={{ margin: "16px", padding: "24px", background: "#fff" }}
        >
          <Title level={3}>
            Bienvenido, {currentUser ? currentUser.email : ""}
          </Title>
          <Row gutter={[16, 16]}>
            {/* Sección 1 */}
            <Col xs={24} sm={12} lg={8}>
              <Card title="Resumen General" bordered>
                <p>Contenido sobre tus datos generales.</p>
              </Card>
            </Col>

            {/* Sección 2 */}
            <Col xs={24} sm={12} lg={8}>
              <Card title="Tareas Pendientes" bordered>
                <p>Lista de tus tareas pendientes.</p>
              </Card>
            </Col>

            {/* Sección 3 */}
            <Col xs={24} sm={24} lg={8}>
              <Card title="Configuraciones Rápidas" bordered>
                <p>Accesos directos a configuraciones comunes.</p>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
