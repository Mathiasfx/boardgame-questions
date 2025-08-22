import React, { useState } from "react";
import { Modal, Button } from "antd";
import "./App.css";

const AppTest: React.FC = () => {
  const [isInitialModalVisible, setIsInitialModalVisible] = useState(true);
  const [isPlayerModalVisible, setIsPlayerModalVisible] = useState(false);
  const [showDice, setShowDice] = useState(false);
  const [numPlayers, setNumPlayers] = useState(2);

  const buttonStyles = {
    backgroundColor: "#048FC9",
    color: "white",
    borderColor: "#f5f5f5",
    border: "4px solid #f5f5f5",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  };

  return (
    <div className="container" style={{ padding: "20px", minHeight: "100vh" }}>
      <h1>Test - Scratch Game</h1>

      {/* Modal inicial para seleccionar la opción */}
      <Modal
        title="Selecciona una opción"
        open={isInitialModalVisible}
        footer={null}
        closable={false}
      >
        <Button
          type="primary"
          onClick={() => {
            setIsInitialModalVisible(false);
            setIsPlayerModalVisible(true);
          }}
          style={{ width: "100%", marginBottom: "10px", minHeight: "50px" }}
        >
          Preguntas RCP
        </Button>
        <Button
          type="default"
          onClick={() => {
            setIsInitialModalVisible(false);
            setIsPlayerModalVisible(true);
          }}
          style={{ width: "100%", minHeight: "50px" }}
        >
          Crear Mis Propias Preguntas
        </Button>
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
      </Modal>

      {/* Botón para obtener una pregunta */}
      <Button type="default" style={{ minHeight: "50px", ...buttonStyles }}>
        Obtener Pregunta
      </Button>

      {/* Botón para abrir el dado */}
      <Button
        type="default"
        onClick={() => setShowDice(!showDice)}
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
      </Button>

      {showDice && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "2px solid #ccc",
            borderRadius: "10px",
            zIndex: 1000,
          }}
        >
          <h3>Dado activado!</h3>
          <Button onClick={() => setShowDice(false)}>Cerrar</Button>
        </div>
      )}
    </div>
  );
};

export default AppTest;
