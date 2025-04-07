/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Space,
  notification,
  Upload,
  ColorPicker,
  Tooltip,
} from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  LinkOutlined,
  UploadOutlined,
  GlobalOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  createBoard,
  getUserBoards,
  updateBoard,
  deleteBoard,
  generateSlug,
} from "../../../firebase/boardService";
import { useAuth } from "../../../providers/AuthContext";
import { Board } from "../../../interfaces/iboard.model";
import { uploadBackgroundImage } from "../../../firebase/storageService";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

const MyGames: React.FC = () => {
  const { currentUser } = useAuth();
  const [trivias, setTrivias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [colorPrimary, setColorPrimary] = useState("");
  const [colorSecondary, setColorSecondary] = useState("");
  const [background, setBackground] = useState("");
  const [questions, setQuestions] = useState<
    { question: string; answer: string }[]
  >([]);
  const [editTriviaId, setEditTriviaId] = useState<string | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [diceFaces, setDiceFaces] = useState<string[]>([
    "1",
    "2",
    "3",
    "4",
    "Play",
    "Stop",
  ]);

  useEffect(() => {
    if (currentUser) {
      fetchBoards();
    }
  }, [currentUser]);

  //#region Obtener los Boards
  const fetchBoards = async () => {
    setLoading(true);
    try {
      const triviasData = await getUserBoards(currentUser!.uid);
      setTrivias(triviasData);
    } catch (error) {
      console.error("Error cargando mis juegos", error);
    }
    setLoading(false);
  };
  //#endregion

  //#region Subir imagen de fondo
  const handleFileChange = (info: any) => {
    const file = info.fileList[0]?.originFileObj as File;
    if (!file) return;

    // Validar formato (solo JPG o PNG)
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      notification.error({
        message: "Formato de imagen no permitido. Solo JPG o PNG.",
      });
      setBackgroundFile(null);
      return;
    }

    // Validar tamaño (máx 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB en bytes
    if (file.size > maxSize) {
      notification.error({
        message: "La imagen es demasiado grande. Máximo 2MB.",
      });
      setBackgroundFile(null);
      return;
    }

    setBackgroundFile(file);
  };

  //#endregion

  //#region Crear o actualizar el board
  const handleCreateOrUpdateTrivia = async () => {
    if (!title.trim()) {
      notification.error({ message: "El título no puede estar vacío." });
      return;
    }
    if (!colorPrimary.trim()) {
      notification.error({
        message: "El color principal no puede estar vacío.",
      });
      return;
    }
    if (!colorSecondary.trim()) {
      notification.error({
        message: "El color secundario no puede estar vacío.",
      });
      return;
    }
    if (!backgroundFile && !background) {
      notification.error({ message: "Debes subir una imagen de fondo." });
      return;
    }
    if (questions.length === 0) {
      notification.error({ message: "Debes agregar al menos una pregunta." });
      return;
    }
    if (questions.some((q) => !q.question.trim() || !q.answer.trim())) {
      notification.error({
        message: "Todas las preguntas y respuestas deben estar completas.",
      });
      return;
    }
    setLoading(true);

    try {
      const slug = editTriviaId
        ? trivias.find((t) => t.id === editTriviaId)?.slug
        : generateSlug(title);
      let imageUrl = background;

      if (backgroundFile) {
        imageUrl = await uploadBackgroundImage(
          currentUser!.uid,
          slug,
          backgroundFile
        );
      }

      if (editTriviaId) {
        await updateBoard(currentUser!.uid, editTriviaId, {
          title,
          colorPrimary,
          colorSecondary,
          background: imageUrl,
          questions,
          diceFaces,
        });
        notification.success({ message: "Board actualizado" });
      } else {
        const board: Board = {
          userId: currentUser!.uid,
          title,
          colorPrimary,
          colorSecondary,
          background: imageUrl,
          questions,
          diceFaces,
        };
        await createBoard(board);
        notification.success({ message: "Board Creado" });
      }
      fetchBoards();
      closeModal();
    } catch (error) {
      notification.error({ message: "Error al guardar la trivia" + error });
    } finally {
      setLoading(false);
    }
  };
  //#endregion

  //#region Eliminar el board
  const handleDeleteTrivia = async (triviaId: string) => {
    Modal.confirm({
      title: "¿Estás seguro?",
      content: "Esta acción eliminará la trivia permanentemente.",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          await deleteBoard(currentUser!.uid, triviaId);
          notification.success({ message: "Trivia eliminada" });
          fetchBoards();
        } catch (error) {
          notification.error({ message: "Error al eliminar trivia" + error });
        }
      },
    });
  };
  //#endregion

  //#region Editar el board
  const handleEditTrivia = (trivia: any) => {
    setEditTriviaId(trivia.id);
    setTitle(trivia.title);
    setColorPrimary(trivia.colorPrimary || "");
    setColorSecondary(trivia.colorSecondary || "");
    setBackground(trivia.background || "");
    setQuestions(trivia.questions || []);
    setIsModalOpen(true);
  };
  //#endregion

  //#region Copiar el link del board
  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/game/${slug}`;
    navigator.clipboard.writeText(url);
    notification.success({ message: "Enlace copiado al portapapeles" });
  };
  //#endregion

  //#region Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditTriviaId(null);
    setTitle("");
    setColorPrimary("");
    setColorSecondary("");
    setBackground("");
    setBackgroundFile(null);
    setQuestions([]);
  };
  //#endregion

  //#region color hex a RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };
  //#endregion

  //#region Descargar tarjetas en PDF
  const downloadCardsPDF = (board: Board) => {
    const { questions } = board;
    // Parámetros de la página
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = 210;
    const pageHeight = 297;

    // Ajustes de distribución de tarjetas
    const outerMargin = 5;
    const gap = 5;
    const cols = 3;
    const availableWidth = pageWidth - 2 * outerMargin - (cols - 1) * gap;
    const cardWidth = availableWidth / cols; // ~63 mm
    const cardHeight = cardWidth * (95 / 55); // ~109 mm
    const rows = Math.floor(
      (pageHeight - 2 * outerMargin + gap) / (cardHeight + gap)
    );

    // Color primario del board para el borde
    const [r, g, b] = board.colorPrimary
      ? hexToRgb(board.colorPrimary)
      : [83, 91, 242];

    let currentCol = 0;
    let currentRow = 0;
    const padding = 5;
    const lineHeight = 7;

    // ---------------------------
    // 1) Páginas de FRENTE
    // ---------------------------
    questions.forEach((item, index) => {
      const x = outerMargin + currentCol * (cardWidth + gap);
      const y = outerMargin + currentRow * (cardHeight + gap);

      // Tarjeta: fondo blanco + borde colorPrimario
      doc.setFillColor(255, 255, 255);
      doc.setLineWidth(2);
      doc.setDrawColor(r, g, b);
      doc.roundedRect(x, y, cardWidth, cardHeight, 5, 5, "DF");

      // Texto de la pregunta en bold
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0); // texto negro
      const textLines = doc.splitTextToSize(
        item.question,
        cardWidth - 2 * padding
      );
      const textBlockHeight = textLines.length * lineHeight;
      const textY = y + (cardHeight - textBlockHeight) / 2 + lineHeight / 2;
      doc.text(textLines, x + cardWidth / 2, textY, { align: "center" });

      // Actualizar posición de columna/fila
      currentCol++;
      if (currentCol === cols) {
        currentCol = 0;
        currentRow++;
      }
      // Si se llena la página y quedan más tarjetas, nueva página
      if (currentRow === rows && index < questions.length - 1) {
        doc.addPage();
        currentCol = 0;
        currentRow = 0;
      }
    });

    // ---------------------------
    // 2) Páginas del DORSO
    // ---------------------------
    const addBackSide = () => {
      const backsideText = `¿Cuanto sabes de ...?`;
      const totalCards = questions.length;
      let processedCards = 0;

      while (processedCards < totalCards) {
        doc.addPage();
        currentCol = 0;
        currentRow = 0;

        while (currentRow < rows && processedCards < totalCards) {
          const x = outerMargin + currentCol * (cardWidth + gap);
          const y = outerMargin + currentRow * (cardHeight + gap);

          // Tarjeta del dorso: fondo gris claro + borde colorPrimario
          doc.setFillColor(230, 230, 230);
          doc.setLineWidth(2);
          doc.setDrawColor(r, g, b);
          doc.roundedRect(x, y, cardWidth, cardHeight, 5, 5, "DF");

          // Texto estilo "escrito": bolditalic + contorno negro y relleno blanco
          doc.setFont("helvetica", "bolditalic");
          doc.setFontSize(24);
          // Hacemos un split en caso de que el título sea muy largo
          const backsideLines = doc.splitTextToSize(
            backsideText,
            cardWidth - 2 * padding
          );
          const backsideBlockHeight = backsideLines.length * (lineHeight + 2);
          const backsideTextY =
            y + (cardHeight - backsideBlockHeight) / 2 + lineHeight / 2;

          // Activar renderizado con contorno (stroke) y relleno (fill)
          doc.setLineJoin("round"); // esquinas redondeadas en el contorno
          doc.setLineWidth(0.7); // grosor del contorno
          doc.setDrawColor(0, 0, 0); // contorno negro
          doc.setTextColor(24, 23, 28);

          // Imprimir el texto con "fillThenStroke" para lograr el efecto contorneado
          doc.text(backsideLines, x + cardWidth / 2, backsideTextY, {
            align: "center",
          });

          currentCol++;
          if (currentCol === cols) {
            currentCol = 0;
            currentRow++;
          }
          processedCards++;
        }
      }
    };

    // Generar el dorso
    addBackSide();

    // Finalmente, descargar
    doc.save(`${board.title}_tarjetas.pdf`);
  };

  //#endregion
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          minHeight: "50px",
        }}
      >
        <h2 style={{ marginRight: "20px", marginBottom: "0px" }}>Mis Juegos</h2>
        <Button
          className="custom-button"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Nuevo Juego
        </Button>
      </div>

      <Table
        dataSource={trivias}
        loading={loading}
        rowKey="id"
        style={{ marginTop: 20 }}
      >
        <Table.Column title="Título" dataIndex="title" key="title" />
        <Table.Column
          title="Acciones"
          key="actions"
          render={(_, trivia) => (
            <Space>
              <Tooltip title="Ver Juego online" placement="top">
                <Link to={`/game/${trivia.slug}`}>
                  <Button icon={<GlobalOutlined />} />
                </Link>
              </Tooltip>

              <Tooltip placement="top" title="Copiar enlace">
                <Button
                  icon={<LinkOutlined />}
                  onClick={() => handleCopyLink(trivia.slug)}
                />
              </Tooltip>

              <Tooltip title="Descargar Tarjetas" placement="top">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => downloadCardsPDF(trivia as Board)}
                />
              </Tooltip>
              <Tooltip title="Editar Trivia" placement="top">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEditTrivia(trivia)}
                />
              </Tooltip>
              <Tooltip title="Eliminar Trivia" placement="top">
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDeleteTrivia(trivia.id)}
                />
              </Tooltip>
            </Space>
          )}
        />
      </Table>

      <Modal
        title={editTriviaId ? "Editar Trivia" : "Nueva Trivia"}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={handleCreateOrUpdateTrivia}
        okText={editTriviaId ? "Guardar cambios" : "Crear Trivia"}
        confirmLoading={loading}
      >
        <Input
          placeholder="Título de la Trivia"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            marginBottom: 10,
            borderColor: !title.trim() ? "red" : undefined,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <label style={{ fontSize: 14 }}>Color Principal:</label>
          <ColorPicker
            value={colorPrimary}
            onChange={(color) => setColorPrimary(color.toHexString())}
          />

          <label style={{ fontSize: 14 }}>Color Secundario:</label>
          <ColorPicker
            value={colorSecondary}
            onChange={(color) => setColorSecondary(color.toHexString())}
          />
        </div>
        <h4>Caras del Dado</h4>
        {diceFaces.map((face, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <Input
              placeholder={`Cara ${index + 1}`}
              value={face}
              onChange={(e) => {
                const updatedFaces = [...diceFaces];
                updatedFaces[index] = e.target.value;
                setDiceFaces(updatedFaces);
              }}
            />
          </div>
        ))}

        <Button
          onClick={
            () => setDiceFaces(["1", "2", "3", "4", "Play", "Stop"]) // Restablecer a valores por defecto
          }
        >
          Restablecer Caras por Defecto
        </Button>

        <Upload
          beforeUpload={() => false} // Evita la carga automática
          onChange={handleFileChange}
          maxCount={1}
          fileList={
            backgroundFile ? [{ uid: "-1", name: backgroundFile.name }] : []
          }
        >
          <Button icon={<UploadOutlined />}>Subir Imagen de Fondo</Button>
        </Upload>
        {!background && !backgroundFile && (
          <p style={{ color: "red", fontSize: "12px" }}>
            ⚠ Debes subir una imagen
          </p>
        )}

        {/* Vista previa de la imagen si existe */}
        {background && (
          <img
            src={background}
            alt="Fondo"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              marginTop: 10,
            }}
          />
        )}
        <h4>Preguntas</h4>
        {questions.map((q, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <Input
              placeholder="Pregunta"
              value={q.question}
              onChange={(e) => {
                const updated = [...questions];
                updated[index] = {
                  ...updated[index],
                  question: e.target.value,
                };
                setQuestions(updated);
              }}
              style={{ marginBottom: 10 }}
            />
            <Input
              placeholder="Respuesta"
              value={q.answer}
              onChange={(e) => {
                const updated = [...questions];
                updated[index] = { ...updated[index], answer: e.target.value };
                setQuestions(updated);
              }}
            />
          </div>
        ))}
        <Button
          onClick={() =>
            setQuestions([...questions, { question: "", answer: "" }])
          }
        >
          + Agregar Pregunta
        </Button>
      </Modal>
    </div>
  );
};

export default MyGames;
