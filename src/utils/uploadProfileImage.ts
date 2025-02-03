import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

export const uploadProfileImage = async (userId: string, file: File): Promise<string> => {
  try {
    const storage = getStorage();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No se ha autenticado el usuario");
    }

 
    const fileRef = ref(storage, `profileImages/${userId}`);



    // Configuración de la subida con el token manualmente
    const metadata = {
      contentType: file.type,

    };


    // Sube el archivo a Firebase Storage
    await uploadBytes(fileRef, file, metadata);

    // Obtiene la URL pública de descarga
    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Error al subir la imagen");
  }
};
