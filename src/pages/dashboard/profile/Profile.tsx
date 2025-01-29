import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../../providers/AuthContext";
import { uploadProfileImage } from "../../../utils/uploadProfileImage";
import { db } from "../../../firebase";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../../firebase";
import { notification, Upload, Button, Avatar, Card } from "antd";
import {
  DeleteOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload/interface";
import Title from "antd/es/typography/Title";

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      const fetchProfileImage = async () => {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().profileImage) {
          setProfileImage(userSnap.data().profileImage);
        }
      };
      fetchProfileImage();
    }
  }, [currentUser]);

  //#region Seleccionar imagen
  const handleFileChange = (info: UploadChangeParam) => {
    // Obtener el archivo correctamente desde fileList
    const selectedFile = info.fileList[0]?.originFileObj as File;

    if (!selectedFile) {
      notification.error({ message: "No se seleccionó ninguna imagen" });
      return;
    }

    // Validación de formato de imagen
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(selectedFile.type)) {
      notification.error({
        message: "Formato no permitido",
        description: "Solo se permiten imágenes JPG o PNG.",
      });
      return;
    }

    // Validación del tamaño de imagen (máx 2MB)
    if (selectedFile.size > 2 * 1024 * 1024) {
      notification.error({
        message: "Imagen muy grande",
        description: "El tamaño máximo permitido es 2MB.",
      });
      return;
    }

    // Seteamos el archivo y la imagen para vista previa
    setFile(selectedFile);
    setProfileImage(URL.createObjectURL(selectedFile));
  };

  //#endregion

  //#region Subir Imagen
  const handleUpload = async () => {
    if (!file) {
      notification.error({ message: "No has seleccionado ninguna imagen" });
      return;
    }

    setLoading(true);
    try {
      const profileImageUrl = await uploadProfileImage(currentUser!.uid, file);
      const userRef = doc(db, "users", currentUser!.uid);
      await updateDoc(userRef, { profileImage: profileImageUrl });

      notification.success({ message: "Imagen de perfil actualizada" });
      setProfileImage(profileImageUrl);
      setFile(null);
    } catch (error) {
      notification.error({
        message: "Error al subir imagen",
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };
  //#endregion

  //#region Eliminar Imagen
  const handleDeleteImage = async () => {
    if (!profileImage) {
      notification.error({ message: "No hay imagen para eliminar" });
      return;
    }

    setLoading(true);
    try {
      const imageRef = ref(storage, `profileImages/${currentUser!.uid}`);

      await deleteObject(imageRef);

      const userRef = doc(db, "users", currentUser!.uid);
      await updateDoc(userRef, { profileImage: "" });

      setProfileImage(null);
      notification.success({ message: "Imagen eliminada correctamente" });
    } catch (error) {
      notification.error({
        message: "Error al eliminar imagen",
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };
  //#endregion

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <Card
        style={{
          width: "500px",
          padding: "20px",
          textAlign: "center",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        {/* Título */}
        <Title level={3} style={{ marginBottom: "20px" }}>
          Imagen de Perfil
        </Title>

        {/* Imagen de Perfil */}
        <Avatar
          size={120}
          src={profileImage || undefined}
          icon={!profileImage ? <UserOutlined /> : undefined}
          style={{ marginBottom: "15px" }}
        />

        {/* Subida de Imagen */}
        <Upload
          beforeUpload={() => false}
          onChange={handleFileChange}
          maxCount={1}
        >
          <Button
            icon={<UploadOutlined />}
            style={{ width: "100%", marginBottom: "10px", marginLeft: "10px" }}
          >
            Seleccionar Imagen
          </Button>
        </Upload>

        {/* Botón de Guardar Imagen */}
        <Button
          type="primary"
          onClick={handleUpload}
          loading={loading}
          disabled={!file}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          Guardar Imagen
        </Button>

        {/* Botón de Eliminar Imagen */}
        {profileImage && (
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteImage}
            loading={loading}
            style={{ width: "100%" }}
          >
            Eliminar Imagen
          </Button>
        )}
      </Card>
    </div>
  );
};

export default Profile;
