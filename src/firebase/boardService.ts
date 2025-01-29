/* eslint-disable @typescript-eslint/no-explicit-any */
import { Board } from "../interfaces/iboard.model";
import { db } from "./firebase"; 
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore";


//#region Generar slug
export const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") 
      .replace(/[^\w-]/g, ""); 
  };
  //#endregion

//#region Verificar slug unico
  const checkSlugExists = async (userId: string, slug: string): Promise<boolean> => {
    const triviasRef = collection(db, `users/${userId}/boards`);
    const q = query(triviasRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; 
  };
  //#endregion

//#region Crear Board
export const createBoard = async (board:Board) => {
    try {
        let slug = generateSlug(board.title);
        let attempt = 0;
    
        while (await checkSlugExists(board.userId, slug)) {
          attempt++;
          slug = `${generateSlug(board.title)}-${attempt}`;
        }
    
        const triviaRef = doc(collection(db, `users/${board.userId}/boards`));
        await setDoc(triviaRef, {
          slug,
          title: board.title,
          colorPrimary: board.colorPrimary,
          colorSecondary: board.colorSecondary,
          background: board.background,
          questions: board.questions,
        });
    
        return { id: triviaRef.id, slug };
      } catch (error) {
        console.error("Error creando trivia:", error);
        throw error;
      }
};
//#endregion

//#region Obtener todos los boards de un usuario
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
//#endregion

//#region Editar Board
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
//#endregion

//#region Eliminar Board
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
//#endregion
