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
import DiceThreeJS from "./components/DiceThreeJS";

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
  const [showAnswer, setShowAnswer] = useState<boolean>(false); // Para mostrar respuesta de pregunta
  const [isPlayerModalVisible, setIsPlayerModalVisible] = useState(true); // Modal para seleccionar cantidad de jugadores - inicia abierto
  const [numPlayers, setNumPlayers] = useState<number>(2);

  // Estados para el dado
  const [showDice, setShowDice] = useState(false);
  const [diceFaces] = useState(["1", "2", "3", "4", "Hable", "Alto"]);

  // Colores para las fichas de los jugadores - modificados para contraste con azul
  const PLAYER_COLORS = ["#FF5733", "#FFD700", "#2ECC71", "#E74C3C"];

  interface Player {
    id: number;
    color: string;
    x: number;
    y: number;
  }

  const TOKEN_RADIUS = 28; // px

  // Define las variables como un objeto
  const customIndicator = (
    <LoadingOutlined spin style={{ fontSize: "48px", color: "#ff2d66" }} />
  );
  const buttonStyles = {
    "--button-bg-color": "#584ea7", // Amarillo dorado para el botón
    "--button-color": "#f5f5f5", // Texto negro para mejor contraste con amarillo

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
      try {
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
      } catch (error) {
        console.error("Error loading questions:", error);
        // Si hay error, usar array vacío
        setQuestions([]);
      }
    };

    loadQuestions();
  }, []);
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

  //#endregion
  // Drag & drop handlers
  const handleMouseDown = (e: React.MouseEvent, playerId: number) => {
    e.preventDefault();
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

  // Touch handlers para móvil
  const handleTouchStart = (e: React.TouchEvent, playerId: number) => {
    e.preventDefault();
    const touch = e.touches[0];
    setDraggedPlayerId(playerId);
    const player = players.find((p) => p.id === playerId);
    if (player) {
      setDragOffset({
        x: touch.clientX - player.x,
        y: touch.clientY - player.y,
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

  const handleTouchMove = (e: TouchEvent) => {
    if (draggedPlayerId !== null) {
      e.preventDefault();
      const touch = e.touches[0];
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === draggedPlayerId
            ? {
                ...p,
                x: Math.max(
                  TOKEN_RADIUS,
                  Math.min(
                    window.innerWidth - TOKEN_RADIUS,
                    touch.clientX - dragOffset.x
                  )
                ),
                y: Math.max(
                  TOKEN_RADIUS,
                  Math.min(
                    window.innerHeight - TOKEN_RADIUS,
                    touch.clientY - dragOffset.y
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

  const handleTouchEnd = () => {
    setDraggedPlayerId(null);
    document.body.style.userSelect = "auto";
  };
  useEffect(() => {
    if (draggedPlayerId !== null) {
      // Mouse events
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      // Touch events
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggedPlayerId]);
  // Función para recalcular posiciones seguras
  const calculateSafePositions = () => {
    const boardW = window.innerWidth;
    const boardH = window.innerHeight;
    const isMobile = boardW <= 768;

    const safeMarginX = isMobile ? 100 : 150;
    const safeMarginY = isMobile ? 80 : 100;

    return [
      { x: safeMarginX, y: safeMarginY },
      { x: boardW - safeMarginX, y: safeMarginY },
      { x: safeMarginX, y: boardH - safeMarginY },
      { x: boardW - safeMarginX, y: boardH - safeMarginY },
    ];
  };

  // Inicializar jugadores cuando se selecciona la cantidad
  useEffect(() => {
    if (!isPlayerModalVisible) {
      const positions = calculateSafePositions();
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

  // Reposicionar fichas al redimensionar la ventana
  useEffect(() => {
    const handleResize = () => {
      if (!isPlayerModalVisible && players.length > 0) {
        const positions = calculateSafePositions();
        setPlayers((prev) =>
          prev.map((player, i) => ({
            ...player,
            x: positions[i]?.x || player.x,
            y: positions[i]?.y || player.y,
          }))
        );
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isPlayerModalVisible, players.length]);

  return (
    <div
      className="container"
      style={{
        padding: "20px",
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        zIndex: 2,
      }}
    >
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
            width: "100%",
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
      )}{" "}
      {/* Botón para obtener una pregunta - ajustado para centrado absoluto */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
          position: "relative",
          zIndex: 50,
        }}
      >
        <Button
          type="default"
          className="custom-button"
          onClick={getRandomQuestion}
          style={{
            minHeight: "50px",
            width: "220px",
            fontSize: "16px",
            fontWeight: "bold",
            ...buttonStyles,
          }}
        >
          OBTENER PREGUNTA
        </Button>
      </div>{" "}
      {/* Botón para abrir el dado */}
      <Button
        type="default"
        onClick={() => setShowDice(true)}
        className="dice-button"
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "12px",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...buttonStyles,
        }}
        title={showDice ? "Cerrar dado" : "Activar dado"}
      >
        🎲
      </Button>{" "}
      {/* Botón para abrir el modal de configuración */}
      <Button
        type="default"
        icon={<SettingOutlined />}
        onClick={() => setIsConfigModalVisible(true)}
        className="settings-button"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
          borderRadius: "8px",
        }}
        title="Configurar preguntas"
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
          {[2, 3].map((n) => (
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
          style={{
            marginTop: 24,
            width: "100%",
            minHeight: "50px",
            borderRadius: 8,
          }}
          onClick={() => setIsPlayerModalVisible(false)}
        >
          Comenzar
        </Button>
      </Modal>{" "}
      {/* Renderizar fichas de jugadores */}
      {players.map((player) => (
        <div
          key={player.id}
          className="player-token"
          onMouseDown={(e) => handleMouseDown(e, player.id)}
          onTouchStart={(e) => handleTouchStart(e, player.id)}
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
            touchAction: "none", // Prevenir scroll en móvil durante drag
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
            {player.id + 1}{" "}
          </span>
        </div>
      ))}{" "}
      {/* Componente del dado */}
      {showDice && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "transparent",
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Button
            onClick={() => setShowDice(false)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 210,
              fontSize: 18,
              pointerEvents: "auto",
              ...buttonStyles,
            }}
          >
            ✕ Cerrar
          </Button>
          <div
            style={{
              width: "100%",
              height: "100%",
              pointerEvents: "auto",
            }}
          >
            <DiceThreeJS showDice={showDice} diceFaces={diceFaces} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
