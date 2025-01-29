/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Space, notification } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import {
  createBoard,
  getUserBoards,
  updateBoard,
  deleteBoard,
} from "../../../firebase/boardService";
import { useAuth } from "../../../providers/AuthContext";

const MyGames: React.FC = () => {
  const { currentUser } = useAuth();
  const [trivias, setTrivias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [editTriviaId, setEditTriviaId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchBoards();
    }
  }, [currentUser]);

  const fetchBoards = async () => {
    setLoading(true);
    try {
      const triviasData = await getUserBoards(currentUser!.uid);
      setTrivias(triviasData);
    } catch (error) {
      console.error("Error cargando trivias", error);
    }
    setLoading(false);
  };

  const handleCreateOrUpdateTrivia = async () => {
    if (!title.trim()) {
      notification.error({ message: "El título no puede estar vacío" });
      return;
    }

    try {
      if (editTriviaId) {
        await updateBoard(currentUser!.uid, editTriviaId, {
          title,
          questions: questions.map((q) => ({ question: q })),
        });
        notification.success({ message: "Trivia actualizada" });
      } else {
        await createBoard(
          currentUser!.uid,
          title,
          questions.map((q) => ({ question: q }))
        );
        notification.success({ message: "Trivia creada" });
      }
      fetchBoards();
      closeModal();
    } catch (error) {
      notification.error({ message: "Error al guardar la trivia" + error });
    }
  };

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

  const handleEditTrivia = (trivia: any) => {
    setEditTriviaId(trivia.id);
    setTitle(trivia.title);
    setQuestions(trivia.questions.map((q: any) => q.question));
    setIsModalOpen(true);
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/game/${slug}`;
    navigator.clipboard.writeText(url);
    notification.success({ message: "Enlace copiado al portapapeles" });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditTriviaId(null);
    setTitle("");
    setQuestions([]);
  };

  return (
    <div>
      <h2>Mis Juegos</h2>
      <Button
        className="custom-button"
        icon={<PlusOutlined />}
        onClick={() => setIsModalOpen(true)}
      >
        Nuevo Juego
      </Button>

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
              <Button
                icon={<LinkOutlined />}
                onClick={() => handleCopyLink(trivia.slug)}
              />
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEditTrivia(trivia)}
              />
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDeleteTrivia(trivia.id)}
              />
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
      >
        <Input
          placeholder="Título de la Trivia"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <h4>Preguntas</h4>
        {questions.map((q, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: 10, marginBottom: 5 }}
          >
            <Input
              value={q}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[index] = e.target.value;
                setQuestions(newQuestions);
              }}
            />
            <Button
              danger
              onClick={() =>
                setQuestions(questions.filter((_, i) => i !== index))
              }
            >
              X
            </Button>
          </div>
        ))}
        <Button
          type="dashed"
          onClick={() => setQuestions([...questions, ""])}
          block
        >
          + Agregar pregunta
        </Button>
      </Modal>
    </div>
  );
};

export default MyGames;
