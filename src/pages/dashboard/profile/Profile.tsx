import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../../providers/AuthContext";
import { uploadProfileImage } from "../../../utils/uploadProfileImage";
import { db } from "../../../firebase/firebase";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../../firebase/firebase";
import {
  notification,
  Upload,
  Button,
  Avatar,
  Card,
  Typography,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload/interface";

const { Title } = Typography;

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

  const handleFileChange = (info: UploadChangeParam) => {
    const selectedFile = info.fileList[0]?.originFileObj as File;

    if (!selectedFile) {
      notification.error({ message: "No se seleccionó ninguna imagen" });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(selectedFile.type)) {
      notification.error({
        message: "Formato no permitido",
        description: "Solo se permiten imágenes JPG o PNG.",
      });
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      notification.error({
        message: "Imagen muy grande",
        description: "El tamaño máximo permitido es 2MB.",
      });
      return;
    }

    setFile(selectedFile);
    setProfileImage(URL.createObjectURL(selectedFile));
  };

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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "400px",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          background: "#fff",
        }}
      >
        <Title level={3} style={{ textAlign: "center", color: "#333" }}>
          Foto de Perfil
        </Title>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Avatar
            size={120}
            src={profileImage || undefined}
            icon={!profileImage ? <UserOutlined /> : undefined}
          />
        </div>

        <Upload
          beforeUpload={() => false}
          onChange={handleFileChange}
          maxCount={1}
        >
          <Button
            icon={<UploadOutlined />}
            style={{
              width: "100%",
              marginBottom: "10px",
              backgroundColor: "#1677ff",
              color: "#fff",
            }}
          >
            Seleccionar Imagen
          </Button>
        </Upload>

        <Button
          type="primary"
          onClick={handleUpload}
          loading={loading}
          disabled={!file}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          Guardar Imagen
        </Button>

        {profileImage && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteImage}
            loading={loading}
            style={{ width: "100%" }}
          >
            Eliminar Imagen
          </Button>
        )}

        {loading && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <Spin />
          </div>
        )}
      </Card>
    </div>
  );
};

export default Profile;
