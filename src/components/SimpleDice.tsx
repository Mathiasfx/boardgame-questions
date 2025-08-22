import React, { useState } from "react";

interface SimpleDiceProps {
  showDice: boolean;
  diceFaces: string[];
}

const SimpleDice: React.FC<SimpleDiceProps> = ({ showDice, diceFaces }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentValue, setCurrentValue] = useState(1);

  const rollDice = () => {
    setIsRolling(true);
    let rollCount = 0;
    const maxRolls = 10;

    const rollInterval = setInterval(() => {
      setCurrentValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;

      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        setIsRolling(false);
      }
    }, 100);
  };

  if (!showDice) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        color: "white",
      }}
    >
      <div
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: "white",
          border: "3px solid #333",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "48px",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "20px",
          transform: isRolling ? "rotate(360deg)" : "rotate(0deg)",
          transition: isRolling
            ? "transform 0.1s linear"
            : "transform 0.3s ease",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
        }}
      >
        {diceFaces[currentValue - 1] || currentValue}
      </div>

      <button
        disabled={isRolling}
        onClick={rollDice}
        style={{
          padding: "12px 24px",
          fontSize: "18px",
          backgroundColor: "#048FC9",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: isRolling ? "not-allowed" : "pointer",
          opacity: isRolling ? 0.7 : 1,
        }}
      >
        {isRolling ? "Tirando..." : "Tirar Dado"}
      </button>
    </div>
  );
};

export default SimpleDice;
