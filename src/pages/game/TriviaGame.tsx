import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Radio,
  Progress,
  Space,
  message as antMessage,
} from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import { getBoardBySlug } from "../../firebase/boardService";
import { TriviaQuestion, Board } from "../../interfaces/iboard.model";

const { Title, Text } = Typography;

const TriviaGame: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState<Board | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    const fetchBoard = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const boardData = await getBoardBySlug(slug);

        // Verificar que sea una trivia
        if (
          !boardData ||
          boardData.gameType !== "trivia" ||
          !boardData.triviaQuestions
        ) {
          antMessage.error("Respuesta incorrecta");
          navigate("/dashboard");
          return;
        }

        // Aleatorizar el orden de las preguntas
        const randomizedQuestions = [...boardData.triviaQuestions].sort(
          () => Math.random() - 0.5
        );
        const boardWithRandomizedQuestions = {
          ...boardData,
          triviaQuestions: randomizedQuestions,
        };

        // Asignar el tablero con las preguntas aleatorizadas
        setBoard(boardWithRandomizedQuestions as Board);
      } catch (error) {
        console.error("Error al cargar la trivia:", error);
        antMessage.error("No se pudo cargar la trivia");
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [slug, navigate]);

  const handleOptionSelect = (optionIndex: number) => {
    if (answered) return;
    setSelectedOption(optionIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !board || !board.triviaQuestions) {
      antMessage.warning("Por favor selecciona una opción");
      return;
    }

    const currentQuestion = board.triviaQuestions[
      currentQuestionIndex
    ] as TriviaQuestion;
    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;

    if (isCorrect) {
      setScore(score + 1);
      antMessage.success("¡Respuesta correcta!");
    } else {
      antMessage.error(
        `Respuesta incorrecta. La correcta era: ${
          currentQuestion.options[currentQuestion.correctOptionIndex]
        }`
      );
    }

    setAnswered(true);
  };

  const handleNextQuestion = () => {
    if (!board || !board.triviaQuestions) return;

    if (currentQuestionIndex < board.triviaQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setGameComplete(true);
    }
  };

  const restartGame = () => {
    // Aleatorizar las preguntas nuevamente si hay un tablero
    if (board && board.triviaQuestions) {
      const randomizedQuestions = [...board.triviaQuestions].sort(
        () => Math.random() - 0.5
      );
      setBoard({
        ...board,
        triviaQuestions: randomizedQuestions,
      });
    }

    // Reiniciar el estado del juego
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnswered(false);
    setGameComplete(false);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <div className="loading-spinner" style={{ marginBottom: 20 }}></div>
        <Title level={3} style={{ color: "#303030" }}>
          Cargando trivia...
        </Title>
      </div>
    );
  }

  if (!board) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          padding: 20,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 20,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            padding: "30px 40px",
            textAlign: "center",
            maxWidth: 500,
          }}
        >
          <Title level={3} style={{ color: "#303030", marginBottom: 20 }}>
            No se pudo cargar la trivia
          </Title>
          <Text style={{ fontSize: 16, display: "block", marginBottom: 25 }}>
            La trivia solicitada no existe o no está disponible en este momento.
          </Text>
          <Button
            size="large"
            type="primary"
            onClick={() => navigate("/dashboard")}
            style={{
              borderRadius: 8,
              height: 45,
              fontSize: 16,
              paddingLeft: 25,
              paddingRight: 25,
            }}
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    const totalQuestions = board?.triviaQuestions?.length || 0;
    const percentage = Math.round((score / totalQuestions) * 100);
    let resultMessage = "";
    let status: "success" | "warning" | "error" | "info" = "info";

    if (percentage >= 80) {
      resultMessage = "¡Excelente! Eres un experto en este tema.";
      status = "success";
    } else if (percentage >= 60) {
      resultMessage = "¡Buen trabajo! Tienes un buen conocimiento del tema.";
      status = "success";
    } else if (percentage >= 40) {
      resultMessage = "No está mal, pero puedes mejorar.";
      status = "warning";
    } else {
      resultMessage = "Necesitas estudiar más sobre este tema.";
      status = "error";
    }

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: board.background
            ? `url("${board.background}")`
            : board.backgroundColor
            ? board.backgroundColor
            : `linear-gradient(135deg, ${board.colorPrimary}22 0%, ${board.colorSecondary}22 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: 20,
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: 600,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 20,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            padding: "30px 20px",
            textAlign: "center",
          }}
        >
          <TrophyOutlined
            style={{
              fontSize: 70,
              color: board.colorPrimary,
              marginBottom: 15,
            }}
          />

          <Title level={2} style={{ margin: "15px 0", color: "#303030" }}>
            ¡Trivia completada!
          </Title>

          <div style={{ marginBottom: 30 }}>
            <Progress
              type="circle"
              percent={percentage}
              format={(percent) => `${percent}%`}
              strokeColor={board.colorPrimary}
              width={120}
            />
          </div>

          <Title level={3} style={{ margin: "20px 0" }}>
            Puntuación: {score}/{totalQuestions}
          </Title>

          <Text
            style={{
              fontSize: 18,
              display: "block",
              margin: "20px 0 30px",
              color:
                status === "success"
                  ? "#52c41a"
                  : status === "warning"
                  ? "#faad14"
                  : status === "error"
                  ? "#ff4d4f"
                  : "#1890ff",
            }}
          >
            {resultMessage}
          </Text>

          <Button
            size="large"
            type="primary"
            onClick={restartGame}
            style={{
              backgroundColor: board.colorPrimary,
              borderColor: board.colorPrimary,
              borderRadius: 8,
              height: 48,
              fontSize: 16,
              paddingLeft: 30,
              paddingRight: 30,
              marginTop: 10,
            }}
          >
            Volver a jugar
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = board.triviaQuestions?.[
    currentQuestionIndex
  ] as TriviaQuestion;
  const progress = Math.round(
    ((currentQuestionIndex + 1) / (board.triviaQuestions?.length || 1)) * 100
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        backgroundImage: board.background
          ? `url("${board.background}")`
          : "none",
        backgroundColor: board.background
          ? "transparent"
          : board.backgroundColor || `${board.colorPrimary}11`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 800,
          marginTop: 20,
          padding: "0 15px",
        }}
      >
        {/* Encabezado de la trivia */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Title level={4} style={{ margin: 0, color: "rgba(0,0,0,0.85)" }}>
            {board.title}
          </Title>
          <Text style={{ fontWeight: 500 }}>
            {currentQuestionIndex + 1}/{board.triviaQuestions?.length || 0}
          </Text>
        </div>

        <Progress
          percent={progress}
          showInfo={false}
          strokeColor={board.colorPrimary}
          style={{ marginBottom: 25 }}
        />

        {/* Pregunta */}
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.95)",
            padding: "20px",
            borderRadius: 15,
            marginBottom: 25,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <Title
            level={4}
            style={{
              margin: 0,
              textAlign: "center",
              color: "#333",
            }}
          >
            {currentQuestion.question}
          </Title>
        </div>

        {/* Opciones */}
        <div style={{ marginBottom: 25 }}>
          <Radio.Group
            onChange={(e) => handleOptionSelect(e.target.value)}
            value={selectedOption}
            style={{ width: "100%" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: 12,
                    width: "100%",
                  }}
                >
                  <Radio
                    value={index}
                    style={{
                      display: "flex",
                      width: "100%",
                      height: "auto",
                      padding: "15px",
                      backgroundColor: answered
                        ? index === currentQuestion.correctOptionIndex
                          ? "rgba(82, 196, 26, 0.15)"
                          : selectedOption === index
                          ? "rgba(255, 77, 79, 0.15)"
                          : "white"
                        : "white",
                      borderRadius: 12,
                      border: answered
                        ? index === currentQuestion.correctOptionIndex
                          ? "1px solid #52c41a"
                          : selectedOption === index
                          ? "1px solid #ff4d4f"
                          : "1px solid #d9d9d9"
                        : selectedOption === index
                        ? `1px solid ${board.colorPrimary}`
                        : "1px solid #d9d9d9",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                    disabled={answered}
                  >
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: "16px",
                        fontWeight: selectedOption === index ? 500 : 400,
                      }}
                    >
                      {option}
                    </span>
                  </Radio>
                </div>
              ))}
            </Space>
          </Radio.Group>
        </div>

        {/* Pie y controles */}
        <div
          style={{
            marginTop: 30,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text strong style={{ fontSize: 16 }}>
            Puntuación: {score}/{board.triviaQuestions?.length || 0}
          </Text>

          {!answered ? (
            <Button
              type="primary"
              onClick={handleCheckAnswer}
              style={{
                backgroundColor: board.colorPrimary,
                borderColor: board.colorPrimary,
                borderRadius: 6,
                height: 40,
                paddingLeft: 20,
                paddingRight: 20,
                fontSize: 16,
              }}
              disabled={selectedOption === null}
            >
              Comprobar Respuesta
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleNextQuestion}
              style={{
                backgroundColor: board.colorSecondary,
                borderColor: board.colorSecondary,
                borderRadius: 6,
                height: 40,
                paddingLeft: 20,
                paddingRight: 20,
                fontSize: 16,
              }}
            >
              {currentQuestionIndex < (board.triviaQuestions?.length || 0) - 1
                ? "Siguiente Pregunta"
                : "Ver Resultados"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TriviaGame;
