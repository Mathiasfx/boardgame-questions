// AuthContext.tsx (o el archivo donde tengas tu contexto)
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import {
  db,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  authStateChanged,
} from "../firebase";
import { User } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  //#region GUARDAR USER EN COKIES
  useEffect(() => {
    const savedUser = Cookies.get("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const unsubscribe = authStateChanged((user) => {
      if (user) {
        Cookies.set("user", JSON.stringify(user), { expires: 1 });
        setCurrentUser(user);
      } else {
        Cookies.remove("user");
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  //#endregion

  //#region INICIO DE SESIÓN
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password); // Usamos el método correcto
  };
  //#endregion

  //#region REGISTRO DE USUARIO
  const register = async (email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      name: "", // Campo vacío inicial
      createdAt: serverTimestamp(),
    });
  };
  //#endregion

  //#region CIERRE DE SESIÓN
  const logout = async () => {
    await signOut(auth); // Usamos el método correcto
    Cookies.remove("user");
  };
  //#endregion

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
