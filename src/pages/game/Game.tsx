import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Spin, Tooltip } from "antd";
import { getGameConfig } from "../../firebase/gameService";
import { LoadingOutlined } from "@ant-design/icons";
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
        }}
      >
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
            bordered={false}
            style={{ textAlign: "center" }}
          >
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
