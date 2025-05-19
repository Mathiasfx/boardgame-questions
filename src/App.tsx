import React, { useEffect, useState } from "react";
import { Modal, Button, Input, List, Card, Spin } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SettingOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import "./App.css";
import background from "./assets/background.jpg";

interface Question {
  question: string;
  answer?: string;
}

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [randomQuestion, setRandomQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newAnswer, setNewAnswer] = useState<string>("");
  const [isConfigModalVisible, setIsConfigModalVisible] =
    useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [isInitialModalVisible, setIsInitialModalVisible] =
    useState<boolean>(false); // Modal inicial
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  // Modal para seleccionar cantidad de jugadores
  const [isPlayerModalVisible, setIsPlayerModalVisible] = useState(true);
  const [numPlayers, setNumPlayers] = useState<number>(2);

  // Colores para las fichas de los jugadores
  const PLAYER_COLORS = ["#e74c3c", "#3498db", "#f1c40f", "#27ae60"];

  interface Player {
    id: number;
    color: string;
    x: number;
    y: number;
  }

  const TOKEN_RADIUS = 28; // px

  // Define las variables como un objeto 4bacd6
  const customIndicator = (
    <LoadingOutlined spin style={{ fontSize: "48px", color: "#f5d93e" }} />
  );
  const buttonStyles = {
    "--button-bg-color": "#008445",
    "--button-color": "white",
    "--button-border-color": "#008445",
    "--button-box-shadow": "0px 4px 10px rgba(0, 0, 0, 0.2)",
  };

  const [players, setPlayers] = useState<Player[]>([]);
  const [draggedPlayerId, setDraggedPlayerId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // cargar preguntas desde el servidor
  useEffect(() => {
    const loadQuestions = async () => {
      const response = await fetch("/questions.json");
      const data: Question[] = await response.json();
      const savedQuestions = JSON.parse(
        localStorage.getItem("questions") || "null"
      ) as Question[];

      if (savedQuestions) {
        setQuestions(savedQuestions);
      } else {
        setQuestions(data);
        localStorage.setItem("questions", JSON.stringify(data));
      }
    };

    loadQuestions();
  }, []);

  // Inicializar jugadores cuando se selecciona la cantidad
  useEffect(() => {
    if (!isPlayerModalVisible) {
      // Posiciones iniciales (esquinas)
      const boardW = window.innerWidth;
      const boardH = window.innerHeight;
      const positions = [
        { x: 60, y: 60 },
        { x: boardW - 60, y: 60 },
        { x: 60, y: boardH - 120 },
        { x: boardW - 60, y: boardH - 120 },
      ];
      setPlayers(
        Array.from({ length: numPlayers }).map((_, i) => ({
          id: i,
          color: PLAYER_COLORS[i],
          x: positions[i].x,
          y: positions[i].y,
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerModalVisible, numPlayers]);

  //#region Trivia y Preguntas
  // obtener una pregunta aleatoria sin repetir
  const getRandomQuestion = () => {
    setShowAnswer(false);
    setShowCard(false);
    setLoading(true);

    if (questions.length === 0) {
      setRandomQuestion(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];

    //Eliminar del Array de preguntas
    const remainingQuestions = questions.filter(
      (_, index) => index !== randomIndex
    );

    setQuestions(remainingQuestions);
    setRandomQuestion(selectedQuestion);

    setTimeout(() => {
      setLoading(false);
      setShowCard(true);
    }, 1000);
  };

  // guardar preguntas en el navegador
  const saveQuestions = () => {
    localStorage.setItem("questions", JSON.stringify(questions));
  };

  // actualizar pregunta
  const updateQuestion = () => {
    if (
      newQuestion.trim() !== "" &&
      newAnswer.trim() !== "" &&
      editIndex !== null
    ) {
      const updatedQuestions = [...questions];
      updatedQuestions[editIndex] = {
        question: newQuestion,
        answer: newAnswer,
      };
      setQuestions(updatedQuestions);
      setNewQuestion("");
      setNewAnswer("");
      setEditIndex(null);
      setIsEditModalVisible(false);
      saveQuestions();
    }
  };

  // eliminar pregunta
  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    saveQuestions();
  };

  // agregar nueva pregunta
  const addNewQuestion = () => {
    if (newQuestion.trim() !== "" && newAnswer.trim() !== "") {
      const updatedQuestions = [
        ...questions,
        { question: newQuestion, answer: newAnswer },
      ];
      setQuestions(updatedQuestions);
      setNewQuestion("");
      setNewAnswer("");
      saveQuestions();
    }
  };

  // resetear preguntas
  const resetQuestions = async () => {
    localStorage.removeItem("questions");
    const response = await fetch("/questions.json");
    const data: Question[] = await response.json();
    setQuestions(data);
    localStorage.setItem("questions", JSON.stringify(data));
  };

  // Opción para usar preguntas precargadas
  const usePreloadedQuestions = () => {
    resetQuestions();
    setIsInitialModalVisible(false); // Cierra el modal inicial
  };

  // Opción para empezar desde preguntas vacías
  const createNewQuestions = () => {
    setQuestions([]); // Limpia las preguntas
    localStorage.setItem("questions", JSON.stringify([])); // Actualiza el localStorage
    setIsInitialModalVisible(false); // Cierra el modal inicial
    setIsConfigModalVisible(true);
  };
  //#endregion

  // Drag & drop handlers
  const handleMouseDown = (e: React.MouseEvent, playerId: number) => {
    setDraggedPlayerId(playerId);
    const player = players.find((p) => p.id === playerId);
    if (player) {
      setDragOffset({
        x: e.clientX - player.x,
        y: e.clientY - player.y,
      });
    }
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggedPlayerId !== null) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === draggedPlayerId
            ? {
                ...p,
                x: Math.max(
                  TOKEN_RADIUS,
                  Math.min(
                    window.innerWidth - TOKEN_RADIUS,
                    e.clientX - dragOffset.x
                  )
                ),
                y: Math.max(
                  TOKEN_RADIUS,
                  Math.min(
                    window.innerHeight - TOKEN_RADIUS,
                    e.clientY - dragOffset.y
                  )
                ),
              }
            : p
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggedPlayerId(null);
    document.body.style.userSelect = "auto";
  };

  useEffect(() => {
    if (draggedPlayerId !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggedPlayerId]);

  return (
    <div
      className="container"
      style={
        {
          padding: "20px",
          backgroundImage: `url(${background})`,
        } as React.CSSProperties
      }
    >
      {/* Modal inicial para seleccionar la opción */}
      <Modal
        className="modalpregunta"
        title="Selecciona una opción"
        open={isInitialModalVisible}
        footer={null}
        closable={false} // No permite cerrar el modal sin seleccionar una opción
      >
        <Button
          type="primary"
          onClick={usePreloadedQuestions}
          style={{ width: "100%", marginBottom: "10px", minHeight: "50px" }}
        >
          Preguntas RCP
        </Button>
        <Button
          type="default"
          onClick={createNewQuestions}
          style={{ width: "100%", minHeight: "50px" }}
        >
          Crear Mis Propias Preguntas
        </Button>
      </Modal>
      {randomQuestion === null && loading && <h2>No hay más preguntas</h2>}

      {/* Card para mostrar la pregunta */}
      {loading && randomQuestion !== null && (
        <div
          className="flex justify-center items-center"
          style={{ margin: "25px", padding: "25px" }}
        >
          <Spin indicator={customIndicator} />
        </div>
      )}
      {randomQuestion && !loading && showCard && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card
            className={`fade-in cartapregunta`}
            bordered={false}
            style={{
              position: "relative",
              minWidth: 320,
              maxWidth: 420,
              width: "90vw",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
            bodyStyle={{ paddingTop: 48 }}
          >
            <Button
              type="text"
              onClick={() => setShowCard(false)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 101,
                fontSize: 20,
              }}
            >
              ✕
            </Button>
            <h2 style={{ fontSize: "1.9rem", fontWeight: "bold" }}>
              {randomQuestion.question}
            </h2>
            {!showAnswer && (
              <Button
                style={{
                  marginTop: "10px",
                  backgroundColor: "#2b2926",
                  color: "white",
                  borderColor: "#2b2926",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
                onClick={() => setShowAnswer(true)}
              >
                Ver Respuesta
              </Button>
            )}
            {showAnswer && (
              <p
                style={{
                  marginTop: "10px",
                  color: "#2434a5",
                  fontSize: "1.6rem",
                  fontWeight: "semibold",
                }}
              >
                {randomQuestion.answer}
              </p>
            )}
          </Card>
        </div>
      )}

      {/* Botón para obtener una pregunta */}
      <Button
        type="default"
        className="custom-button"
        onClick={getRandomQuestion}
        style={{ minHeight: "50px", ...buttonStyles }}
      >
        Obtener Pregunta
      </Button>

      {/* Botón para abrir el modal de configuración */}
      <Button
        type="default"
        icon={<SettingOutlined />}
        onClick={() => setIsConfigModalVisible(true)}
        style={{ position: "absolute", top: "20px", right: "20px" }}
      ></Button>

      {/* Modal para configuración de preguntas */}
      <Modal
        title="Configurar Preguntas"
        open={isConfigModalVisible}
        onCancel={() => setIsConfigModalVisible(false)}
        footer={null}
      >
        <h3>Agregar Nueva Pregunta</h3>
        <Input
          placeholder="Escribe una nueva pregunta"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Escribe la respuesta"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          style={{ marginBottom: "10px" }}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={addNewQuestion}
          style={{ marginTop: "10px", minHeight: "50px" }}
        >
          Agregar Pregunta
        </Button>

        <h3 style={{ marginTop: "20px" }}>Listado de Preguntas</h3>
        <List
          dataSource={questions}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditIndex(index);
                    setNewQuestion(item.question);
                    setNewAnswer(item.answer || "");
                    setIsEditModalVisible(true);
                  }}
                >
                  Editar
                </Button>,
                <Button
                  style={{ minHeight: "50px" }}
                  type="link"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => deleteQuestion(index)}
                >
                  Eliminar
                </Button>,
              ]}
            >
              {item.question}
            </List.Item>
          )}
        />
        <Button
          type="default"
          danger
          style={{ marginTop: "20px", minHeight: "50px" }}
          onClick={resetQuestions}
        >
          Restaurar Preguntas Predeterminadas
        </Button>
      </Modal>

      {/* Modal para editar preguntas */}
      <Modal
        title="Editar Pregunta"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={updateQuestion}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Input
          placeholder="Edita la pregunta"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <Input
          placeholder="Edita la respuesta"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
      </Modal>

      {/* Modal para elegir cantidad de jugadores */}
      <Modal
        title="Selecciona la cantidad de jugadores"
        open={isPlayerModalVisible}
        footer={null}
        closable={false}
        centered
      >
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          {[2, 3, 4].map((n) => (
            <Button
              key={n}
              type={numPlayers === n ? "primary" : "default"}
              onClick={() => setNumPlayers(n)}
              style={{
                width: 60,
                height: 60,
                fontSize: 24,
                borderRadius: "50%",
              }}
            >
              {n}
            </Button>
          ))}
        </div>
        <Button
          type="primary"
          style={{ marginTop: 24, width: "100%" }}
          onClick={() => setIsPlayerModalVisible(false)}
        >
          Comenzar
        </Button>
      </Modal>

      {/* Renderizar fichas de jugadores */}
      {players.map((player) => (
        <div
          key={player.id}
          onMouseDown={(e) => handleMouseDown(e, player.id)}
          style={{
            position: "absolute",
            left: player.x - TOKEN_RADIUS,
            top: player.y - TOKEN_RADIUS,
            width: TOKEN_RADIUS * 2,
            height: TOKEN_RADIUS * 2,
            borderRadius: "50%",
            background: player.color,
            border: "3px solid #fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            cursor: "grab",
            zIndex: 10,
            display: isPlayerModalVisible ? "none" : "block",
            transition:
              draggedPlayerId === player.id ? "none" : "box-shadow 0.2s",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 22,
              lineHeight: `${TOKEN_RADIUS * 2}px`,
              textAlign: "center",
              width: "100%",
              display: "block",
              userSelect: "none",
            }}
          >
            {player.id + 1}
          </span>
        </div>
      ))}
    </div>
  );
};

export default App;
