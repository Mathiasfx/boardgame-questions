import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, OrbitControls, Environment } from "@react-three/drei";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import * as THREE from "three";
// Component wrapper with error handling
function DiceWrapper(_a) {
    var showDice = _a.showDice, diceFaces = _a.diceFaces;
    try {
        return _jsx(DiceThreeJSInternal, { showDice: showDice, diceFaces: diceFaces });
    }
    catch (error) {
        console.error("Error en DiceThreeJS:", error);
        return (_jsxs("div", { style: { color: "white", textAlign: "center", padding: "20px" }, children: [_jsx("h3", { children: "Error al cargar el dado 3D" }), _jsx("p", { children: "Tu navegador podr\u00EDa no soportar WebGL." })] }));
    }
}
function DiceThreeJSInternal(_a) {
    var showDice = _a.showDice, diceFaces = _a.diceFaces;
    var _b = useState(false), isRolling = _b[0], setIsRolling = _b[1];
    var _c = useState(true), webGLSupported = _c[0], setWebGLSupported = _c[1];
    // Check WebGL support
    useEffect(function () {
        var canvas = document.createElement("canvas");
        var gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
        if (!gl) {
            setWebGLSupported(false);
        }
        canvas.remove();
    }, []);
    // Reset isRolling when showDice changes
    useEffect(function () {
        if (!showDice) {
            setIsRolling(false);
        }
    }, [showDice]);
    if (!showDice)
        return null;
    if (!webGLSupported) {
        return (_jsxs("div", { style: { color: "white", textAlign: "center", padding: "20px" }, children: [_jsx("h3", { children: "WebGL no soportado" }), _jsx("p", { children: "Tu navegador no soporta WebGL requerido para el dado 3D." })] }));
    }
    return (_jsxs("div", { style: { width: "100%", height: "100%", position: "relative" }, children: [_jsx("div", { style: {
                    position: "absolute",
                    top: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                }, children: _jsx("button", { disabled: isRolling, onClick: function () { return setIsRolling(true); }, style: {
                        padding: "12px 24px",
                        fontSize: "16px",
                        backgroundColor: isRolling ? "#666" : "#048FC9",
                        color: "white",
                        border: "2px solid white",
                        borderRadius: "8px",
                        cursor: isRolling ? "not-allowed" : "pointer",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                    }, children: isRolling ? "Tirando..." : "Tirar Dado" }) }), " ", _jsxs(Canvas, { shadows: true, camera: { position: [0, 4, 8], fov: 48 }, style: {
                    width: "100%",
                    height: "100vh",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 0,
                }, gl: {
                    antialias: true,
                    alpha: true,
                    preserveDrawingBuffer: false,
                }, children: [_jsx(Environment, { preset: "warehouse" }), _jsx("ambientLight", { intensity: 0.5 }), _jsx("directionalLight", { position: [5, 5, 5], intensity: 1, castShadow: true }), _jsxs(Physics, { gravity: [0, -9.8, 0], children: [_jsx(Plane, {}), _jsx(Dice, { isRolling: isRolling, setIsRolling: setIsRolling, diceFaces: diceFaces })] }), _jsx(OrbitControls, { enablePan: false, enableZoom: false })] })] }));
}
function Plane() {
    var ref = useRef(null);
    usePlane(function () { return ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, 0, 0],
    }); }, ref);
    return (_jsxs("mesh", { ref: ref, receiveShadow: true, children: [_jsx("planeGeometry", { args: [10, 10] }), _jsx("meshStandardMaterial", { color: "#E33", transparent: true, opacity: 0 })] }));
}
function Dice(_a) {
    var isRolling = _a.isRolling, setIsRolling = _a.setIsRolling, diceFaces = _a.diceFaces;
    var _b = useBox(function () { return ({
        mass: 1,
        position: [0, 2, 0],
        args: [2, 2, 2],
        // Cuando el dado colisiona con el suelo, se detiene el estado de "rolling"
        onCollide: function () { return setIsRolling(false); },
    }); }), ref = _b[0], api = _b[1];
    // Cada vez que isRolling cambie a true, reiniciamos posición y aplicamos velocidades
    useEffect(function () {
        if (isRolling) {
            api.position.set(0, 2, 0);
            api.velocity.set((Math.random() - 0.5) * 2, // Velocidad en X
            Math.random() * 5 + 2, // Velocidad en Y
            (Math.random() - 0.5) * 2 // Velocidad en Z
            );
            api.angularVelocity.set((Math.random() - 0.5) * 7, // Rotación en X
            (Math.random() - 0.5) * 5, // Rotación en Y
            (Math.random() - 0.5) * 5 // Rotación en Z
            );
        }
    }, [isRolling, api]);
    return (_jsxs("mesh", { ref: ref, castShadow: true, scale: [1, 1, 1], children: [_jsx("boxGeometry", { args: [2, 2, 2] }), _jsx("meshStandardMaterial", { color: "white" }), diceFaces.map(function (face, index) { return (_jsx(Face, { text: face, faceIndex: index }, index)); })] }));
}
function Face(_a) {
    var text = _a.text, faceIndex = _a.faceIndex;
    // Posiciones y rotaciones predefinidas para cada cara del cubo
    var faceData = [
        { pos: new THREE.Vector3(0, 0, 1.01), rot: new THREE.Euler(0, 0, 0) },
        {
            pos: new THREE.Vector3(0, 0, -1.01),
            rot: new THREE.Euler(0, Math.PI, 0),
        },
        {
            pos: new THREE.Vector3(0, 1.01, 0),
            rot: new THREE.Euler(-Math.PI / 2, 0, 0),
        },
        {
            pos: new THREE.Vector3(0, -1.01, 0),
            rot: new THREE.Euler(Math.PI / 2, 0, 0),
        },
        {
            pos: new THREE.Vector3(1.01, 0, 0),
            rot: new THREE.Euler(0, Math.PI / 2, 0),
        },
        {
            pos: new THREE.Vector3(-1.01, 0, 0),
            rot: new THREE.Euler(0, -Math.PI / 2, 0),
        },
    ];
    var _b = faceData[faceIndex], pos = _b.pos, rot = _b.rot;
    return (_jsx(Text, { position: pos, rotation: rot, fontSize: 0.5, color: "black", anchorX: "center", anchorY: "middle", children: text }));
}
export default DiceWrapper;
