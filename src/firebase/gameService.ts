import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

interface GameConfig {
  title: string;
  colorPrimary: string;
  colorSecondary: string;
  questions: { question: string }[];
}

/**
 * Obtiene la configuración completa del juego incluyendo preguntas y estilos.
 * @param slug Identificador único del juego.
 * @returns Configuración del juego o null si no existe.
 */
export const getGameConfig = async (slug: string): Promise<GameConfig | null> => {
  try {
    const gameRef = doc(db, "games", slug);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
      return gameSnap.data() as GameConfig;
    } else {
      console.error("Juego no encontrado");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener la configuración del juego:", error);
    return null;
  }
};
