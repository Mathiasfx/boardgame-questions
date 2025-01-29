import { useState } from "react";
import { useAuth } from "../../providers/AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, notification, Checkbox } from "antd";
import styles from "./RegisterPage.module.css";
import registerIllus from "../../assets/illustrations/registerillustration.svg";

const { Title } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: {
    email: string;
    password: string;
    name: string;
  }) => {
    setLoading(true);
    try {
      await register(values.email, values.password, values.name);
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
        <Title level={1}>Cuanto Sabes</Title>
        <Title level={3}>Registrar</Title>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Nombre"
            name="name"
            rules={[{ required: true, message: "Por favor ingresa tu nombre" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Correo"
            name="email"
            rules={[
              { required: true, message: "Por favor ingresa tu correo" },
              { type: "email", message: "Ingresa un correo válido" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: "Por favor ingresa tu contraseña" },
              {
                min: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirmar Contraseña"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Por favor confirma tu contraseña" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Las contraseñas no coinciden")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[
              {
                required: true,
                message: "Debes aceptar los términos y condiciones",
              },
            ]}
          >
            <Checkbox>
              Acepto los <a href="/terms">Términos y Condiciones</a>
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Crear cuenta
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
