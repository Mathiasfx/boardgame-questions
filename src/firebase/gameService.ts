import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

/**
 * Obtiene la configuración del juego basado en el `slug`, buscando en `users/{userId}/boards/{boardId}`.
 * @param slug Slug único del juego.
 * @returns Configuración del juego o null si no existe.
 */
export const getGameConfig = async (slug: string) => {
  try {


    // Obtener todos los usuarios para buscar dentro de "users/{userId}/boards"
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id; // ID del usuario

      // Buscar dentro de "users/{userId}/boards"
      const boardsRef = collection(db, `users/${userId}/boards`);
      const q = query(boardsRef, where("slug", "==", slug));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const gameData = querySnapshot.docs[0].data();

        return gameData;
      }
    }

  
    return null;
  } catch (error) {
    console.error(" Error al obtener la configuración del juego:", error);
    return null;
  }
};
