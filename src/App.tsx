import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "antd";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegiterPage";
import Dashboard from "./pages/dashboard/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./providers/AuthContext";
import "./index.css";
import Game from "./pages/game/Game";
import TriviaGame from "./pages/game/TriviaGame";

function App() {
  const { currentUser } = useAuth();
  return (
    <Router>
      <Layout style={{ minHeight: "100vh", width: "100%" }}>
        <Routes>
          {/* Rutas de juego */}
          <Route path="/game/:slug" element={<Game />} />
          <Route path="/trivia/:slug" element={<TriviaGame />} />

          {/* Si el usuario ya está autenticado, redirigir de login/register a Dashboard */}
          <Route
            path="/login"
            element={
              currentUser ? <Navigate to="/dashboard/inicio" /> : <LoginPage />
            }
          />
          <Route
            path="/register"
            element={
              currentUser ? (
                <Navigate to="/dashboard/inicio" />
              ) : (
                <RegisterPage />
              )
            }
          />

          {/* Rutas Protegidas dentro del Dashboard */}
          <Route path="/dashboard/*" element={<PrivateRoute />}>
            <Route path="*" element={<Dashboard />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/dashboard/inicio" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
