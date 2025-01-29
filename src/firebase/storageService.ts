import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

//#region Subir imagen de fondo
export const uploadBackgroundImage = async (userId: string, slug: string, file: File) => {
  try {
    const filePath = `boardBackgrounds/${userId}/boards/${slug}/${file.name}`;
    const fileRef = ref(storage, filePath);
    
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    
    return downloadURL;  
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw error;
  }
  //#endregion
};
