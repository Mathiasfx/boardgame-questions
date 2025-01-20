import { useState } from "react";
import { useAuth } from "../../providers/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, notification } from "antd";
import styles from "./LoginPage.module.css"; // Importa los estilos
import loginIllustration from "../../assets/illustrations/loginillustration.svg";

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      notification.success({ message: "Inicio de sesión exitoso" });
      navigate("/dashboard");
    } catch (error) {
      notification.error({
        message: "Error al iniciar sesión",
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src={loginIllustration}
          alt="Imagen de inicio de sesión"
          className={styles.image}
        />
      </div>

      <div className={styles.formContainer}>
        <Title level={1}>Boardgames</Title>
        <Title level={3}>Iniciar Sesión</Title>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Correo"
            name="email"
            rules={[{ required: true, message: "Por favor ingresa tu correo" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: "Por favor ingresa tu contraseña" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Iniciar Sesión
            </Button>
          </Form.Item>
          <p>
            ¿No tienes cuenta? <Link to="/register">Registrate</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
