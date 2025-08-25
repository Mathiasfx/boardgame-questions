import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
var SimpleDice = function (_a) {
    var showDice = _a.showDice, diceFaces = _a.diceFaces;
    var _b = useState(false), isRolling = _b[0], setIsRolling = _b[1];
    var _c = useState(1), currentValue = _c[0], setCurrentValue = _c[1];
    var rollDice = function () {
        setIsRolling(true);
        var rollCount = 0;
        var maxRolls = 10;
        var rollInterval = setInterval(function () {
            setCurrentValue(Math.floor(Math.random() * 6) + 1);
            rollCount++;
            if (rollCount >= maxRolls) {
                clearInterval(rollInterval);
                setIsRolling(false);
            }
        }, 100);
    };
    if (!showDice)
        return null;
    return (_jsxs("div", { style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
            color: "white",
        }, children: [_jsx("div", { style: {
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
                }, children: diceFaces[currentValue - 1] || currentValue }), _jsx("button", { disabled: isRolling, onClick: rollDice, style: {
                    padding: "12px 24px",
                    fontSize: "18px",
                    backgroundColor: "#048FC9",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: isRolling ? "not-allowed" : "pointer",
                    opacity: isRolling ? 0.7 : 1,
                }, children: isRolling ? "Tirando..." : "Tirar Dado" })] }));
};
export default SimpleDice;
