import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadProfileImage = async (userId: string, file: File): Promise<string> => {
  try {
    const storage = getStorage();
    const fileRef = ref(storage, `profileImages/${userId}/${file.name}`);

    console.log("Archivo seleccionado:", file);


    // Sube el archivo a Firebase Storage
    await uploadBytes(fileRef, file);

    // Obtiene la URL pública de descarga
    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Error al subir la imagen");
  }
};
