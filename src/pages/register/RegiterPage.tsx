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
        <Title level={1}>Boardgames</Title>
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
