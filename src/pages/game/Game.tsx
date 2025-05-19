import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Spin, Tooltip, Modal, Row, Col } from "antd";
import { getGameConfig } from "../../firebase/gameService";
import { LoadingOutlined, CloseOutlined } from "@ant-design/icons";
import { Question } from "../../interfaces/iquestion.model";
import "../../App.css";
import DiceThreeJS from "../../components/DiceThreeJS";
import Dado from "../../assets/illustrations/dados.png";

const Game: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [bgSize, setBgSize] = useState("67%");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [randomQuestion, setRandomQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCard, setShowCard] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showDice, setShowDice] = useState(false);
  const [gameConfig, setGameConfig] = useState<{
    title: string;
    slug: string;
    background?: string;
    colorPrimary: string;
    colorSecondary: string;
    diceFaces?: string[];
  } | null>(null);
  const [selectPlayersVisible, setSelectPlayersVisible] = useState(true);
  const [playerTokens, setPlayerTokens] = useState<{ x: number; y: number }[]>(
    []
  );
  const [draggedToken, setDraggedToken] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const updateBgSize = () => {
      setBgSize(window.innerWidth < 1300 ? "cover" : "contain");
    };

    updateBgSize(); // Llamamos al inicio para establecer el valor correcto
    window.addEventListener("resize", updateBgSize);

    return () => window.removeEventListener("resize", updateBgSize);
  }, []);
  useEffect(() => {
    const fetchGameDetails = async () => {
      if (!slug) return;

      const config = await getGameConfig(slug);
      if (config) {
        setGameConfig({
          title: config.title,
          slug: config.slug,
          colorPrimary: config.colorPrimary,
          colorSecondary: config.colorSecondary,
          background: config.background,
          diceFaces: config.diceFaces,
        });
        setQuestions(config.questions);
      }
      setLoading(false);
    };

    fetchGameDetails();
  }, [slug]);

  const rollDice = () => {
    setShowDice(!showDice);
  };

  // Obtener una pregunta aleatoria sin repetir
  const getRandomQuestion = () => {
    setShowAnswer(false);
    setShowCard(false);
    setLoading(true);

    if (questions.length === 0) {
      setRandomQuestion(null);
      alert("No hay mas");
      return;
    }

    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];

    // Eliminar del array para evitar repetición
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

  const fichaColors = ["#e74c3c", "#3498db", "#27ae60", "#f1c40f"];

  // Handler para seleccionar cantidad de jugadores
  const handleSelectPlayers = (num: number) => {
    // Posiciones iniciales separadas
    setPlayerTokens(
      Array(num)
        .fill(0)
        .map((_, i) => ({ x: 120 + i * 60, y: 420 }))
    );
    setSelectPlayersVisible(false);
  };

  // Drag & drop handlers para mouse
  const handleMouseDown = (
    idx: number,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    setDraggedToken(idx);
    setDragOffset({
      x: e.clientX - playerTokens[idx].x,
      y: e.clientY - playerTokens[idx].y,
    });
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggedToken !== null) {
      const newTokens = [...playerTokens];
      newTokens[draggedToken] = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };
      setPlayerTokens(newTokens);
    }
  };

  const handleMouseUp = () => {
    setDraggedToken(null);
    document.body.style.userSelect = "auto";
  };

  // Drag & drop handlers para touch (mobile)
  const handleTouchStart = (
    idx: number,
    e: React.TouchEvent<HTMLDivElement>
  ) => {
    const touch = e.touches[0];
    setDraggedToken(idx);
    setDragOffset({
      x: touch.clientX - playerTokens[idx].x,
      y: touch.clientY - playerTokens[idx].y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (draggedToken !== null) {
      const touch = e.touches[0];
      const newTokens = [...playerTokens];
      newTokens[draggedToken] = {
        x: touch.clientX - dragOffset.x,
        y: touch.clientY - dragOffset.y,
      };
      setPlayerTokens(newTokens);
    }
  };

  const handleTouchEnd = () => {
    setDraggedToken(null);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: gameConfig?.colorPrimary,
      }}
    >
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          backgroundColor: gameConfig?.colorPrimary,
          backgroundImage: gameConfig?.background
            ? `url(${gameConfig.background})`
            : "",
          backgroundSize: bgSize,
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          overflow: "hidden",
          touchAction: "none", // Para evitar scroll mientras se arrastra
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Modal para elegir cantidad de jugadores */}
        <Modal
          open={selectPlayersVisible}
          closable={false}
          footer={null}
          centered
          styles={{ body: { textAlign: "center" } }}
        >
          <h2>Selecciona la cantidad de jugadores</h2>
          <Row gutter={16} justify="center">
            {[2, 3, 4].map((num) => (
              <Col key={num}>
                <Button
                  type="primary"
                  style={{ margin: 10, fontSize: 22 }}
                  onClick={() => handleSelectPlayers(num)}
                >
                  {num}
                </Button>
              </Col>
            ))}
          </Row>
        </Modal>

        {/* Renderizar fichas de jugadores sobre el fondo */}
        {playerTokens.map((pos, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              width: 62,
              height: 62,
              borderRadius: "50%",
              background: fichaColors[idx],
              border: "3px solid #fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              cursor: "grab",
              zIndex: 1,
              display: selectPlayersVisible ? "none" : "block",
              userSelect: "none",
              touchAction: "none",
            }}
            onMouseDown={(e) => handleMouseDown(idx, e)}
            onTouchStart={(e) => handleTouchStart(idx, e)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 24,
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            >
              {idx + 1}
            </span>
          </div>
        ))}

        {loading && (
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: "48px", color: "#fff" }}
                spin
              />
            }
          />
        )}

        {randomQuestion && !loading && (
          <Card
            className={`${showCard ? "fade-in" : "fade-out"} cartapregunta`}
            variant="outlined"
            style={{ textAlign: "center", position: "relative", zIndex: 10 }}
          >
            {/* Botón X para cerrar la card */}
            <Button
              type="text"
              shape="circle"
              icon={<CloseOutlined />}
              onClick={() => setShowCard(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 11,
                color: gameConfig?.colorPrimary || "#333",
                background: "transparent",
                border: "none",
                fontSize: 22,
              }}
              aria-label="Cerrar pregunta"
            />
            <h1>{randomQuestion.question}</h1>
            {!showAnswer && (
              <Button
                style={{
                  marginTop: "10px",
                  backgroundColor: gameConfig?.colorPrimary
                    ? gameConfig?.colorPrimary
                    : "#2b2926",
                  color: "white",
                  borderColor: gameConfig?.colorPrimary
                    ? gameConfig?.colorPrimary
                    : "#2b2926",
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
                  color: gameConfig?.colorPrimary,
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                }}
              >
                {randomQuestion.answer}
              </p>
            )}
          </Card>
        )}

        {/* Botón para obtener una nueva pregunta */}
        <Button
          type="default"
          onClick={getRandomQuestion}
          style={{
            minHeight: "50px",
            backgroundColor: gameConfig?.colorSecondary,
            color: "#fff",
            borderColor: gameConfig?.colorSecondary,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            marginTop: "20px",
          }}
        >
          OBTENER PREGUNTA
        </Button>
        <Tooltip title="Activar o Desactivar Dado" placement="right">
          <Button
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              width: "50px",
              height: "50px",
            }}
            onClick={rollDice}
          >
            <img src={Dado} alt="Dado" width="40" style={{ margin: "8px" }} />
          </Button>
        </Tooltip>

        {/* Botón para abrir el modal de configuración */}
        {/* <Button
        type="default"
        icon={<SettingOutlined />}
        style={{ position: "absolute", top: "20px", right: "20px" }}
      ></Button> */}
        <DiceThreeJS
          showDice={showDice}
          diceFaces={
            gameConfig?.diceFaces || ["1", "2", "3", "4", "Play", "Stop"]
          }
        />
      </div>
    </div>
  );
};

export default Game;
