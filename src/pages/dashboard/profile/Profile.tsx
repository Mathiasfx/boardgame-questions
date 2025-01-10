/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../../providers/AuthContext";
import { uploadProfileImage } from "../../../utils/uploadProfileImage"; // Implementación de subida de imagen
import { db } from "../../../firebase";
import { Input, notification, Form, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { UploadFile, UploadChangeParam } from "antd/es/upload/interface"; // Usamos el tipo UploadFile

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<UploadFile<any> | null>(null); // Actualizamos el tipo a UploadFile<any>
  const navigate = useNavigate();

  // Cambiamos para acceder a info.file en lugar de info.file.originFileObj
  const handleFileChange = (info: UploadChangeParam) => {
    const selectedFile = info.file; // Aquí obtenemos el archivo directamente
    if (selectedFile && selectedFile.originFileObj) {
      console.log("Archivo seleccionado:", selectedFile.originFileObj);
      setFile(selectedFile); // Guardamos el archivo en el estado
    } else {
      console.log("No se ha seleccionado un archivo válido.");
    }
  };

  const onFinish = async (values: { name: string }) => {
    if (!currentUser) return;

    setLoading(true);

    try {
      // Sube la imagen si el usuario seleccionó una
      let profileImageUrl = "";
      if (!file) {
        notification.error({ message: "No se seleccionó ninguna imagen" });
        return;
      }

      // Verificamos si originFileObj existe antes de pasar a la función de subida
      if (file && file.originFileObj) {
        profileImageUrl = await uploadProfileImage(
          currentUser.uid,
          file.originFileObj as File // Aseguramos que sea de tipo File
        );
      } else {
        notification.error({ message: "Error en el archivo seleccionado" });
        return;
      }

      // Actualiza el nombre y la URL de la imagen en Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        name: values.name,
        ...(profileImageUrl && { profileImage: profileImageUrl }),
      });
      console.log(profileImageUrl);

      notification.success({ message: "Perfil actualizado exitosamente" });
      navigate("/dashboard");
    } catch (error) {
      notification.error({
        message: "Error al actualizar perfil",
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Nombre"
        name="name"
        rules={[{ required: true, message: "Por favor ingresa tu nombre" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Imagen de perfil">
        <Upload
          beforeUpload={() => false} // Evita el auto-upload, controlamos el upload manualmente
          onChange={handleFileChange} // Usamos el tipo adecuado
          maxCount={1} // Permite solo un archivo
        >
          <Button icon={<UploadOutlined />}>Seleccionar imagen</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Profile;
