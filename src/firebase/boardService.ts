/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "./firebase"; // Asegúrate de importar correctamente tu configuración
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore";


const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Reemplazar espacios por guiones
      .replace(/[^\w-]/g, ""); // Eliminar caracteres especiales
  };

  const checkSlugExists = async (userId: string, slug: string): Promise<boolean> => {
    const triviasRef = collection(db, `users/${userId}/boards`);
    const q = query(triviasRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Devuelve true si ya existe
  };

// 📌 Función para crear una trivia
export const createBoard = async (userId: string, title: string, questions: { question: string }[]) => {
    try {
        let slug = generateSlug(title);
        let attempt = 0;
    
        // Verificar slug unico
        while (await checkSlugExists(userId, slug)) {
          attempt++;
          slug = `${generateSlug(title)}-${attempt}`;
        }
    
  
        const boardRef = doc(collection(db, `users/${userId}/boards`));
        await setDoc(boardRef, {
          slug,
          title,
          questions,
        });
    
        return { id: boardRef.id, slug };
      } catch (error) {
        console.error("Error creando trivia:", error);
        throw error;
      }
};

// 📌 Función para obtener todas las trivias de un usuario
export const getUserBoards = async (userId: string) => {
  try {
    const boardsRef = collection(db, `users/${userId}/boards`);
    const querySnapshot = await getDocs(boardsRef);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error obteniendo trivias:", error);
    throw error;
  }
};

// 📌 Función para editar una trivia
export const updateBoard = async (userId: string, boardId: string, updatedData: any) => {
  try {
    const boardRef = doc(db, `users/${userId}/boards/${boardId}`);
    await updateDoc(boardRef, updatedData);
    console.log("Actualizada correctamente");
  } catch (error) {
    console.error("Error actualizando trivia:", error);
    throw error;
  }
};

// 📌 Función para eliminar una trivia
export const deleteBoard = async (userId: string, boardID: string) => {
  try {
    const boardRef = doc(db, `users/${userId}/boards/${boardID}`);
    await deleteDoc(boardRef);
    console.log("Eliminada correctamente");
  } catch (error) {
    console.error("Error eliminando trivia:", error);
    throw error;
  }
};
