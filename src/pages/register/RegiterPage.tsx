import { useState } from "react";
import { useAuth } from "../../providers/AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, notification } from "antd";
import styles from "./RegisterPage.module.css";
import registerIllus from "../../assets/illustrations/registerillustration.svg";

const { Title } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await register(values.email, values.password);
      notification.success({ message: "Registro exitoso" });
      navigate("/dashboard");
    } catch (error) {
      notification.error({
        message: "Error al registrar",
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
          src={registerIllus}
          alt="Imagen de registro"
          className={styles.image}
        />
      </div>

      <div className={styles.formContainer}>
        <Title level={1}>Boardgames</Title>
        <Title level={3}>Registrar</Title>
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
              Registrar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
