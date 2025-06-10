import { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, OrbitControls, Environment } from "@react-three/drei";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { Mesh } from "three";
import * as THREE from "three";

// Component wrapper with error handling
function DiceWrapper({
  showDice,
  diceFaces,
}: {
  showDice: boolean;
  diceFaces: string[];
}) {
  try {
    return <DiceThreeJSInternal showDice={showDice} diceFaces={diceFaces} />;
  } catch (error) {
    console.error("Error en DiceThreeJS:", error);
    return (
      <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
        <h3>Error al cargar el dado 3D</h3>
        <p>Tu navegador podría no soportar WebGL.</p>
      </div>
    );
  }
}

function DiceThreeJSInternal({
  showDice,
  diceFaces,
}: {
  showDice: boolean;
  diceFaces: string[];
}) {
  const [isRolling, setIsRolling] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
    if (!gl) {
      setWebGLSupported(false);
    }
    canvas.remove();
  }, []);

  // Reset isRolling when showDice changes
  useEffect(() => {
    if (!showDice) {
      setIsRolling(false);
    }
  }, [showDice]);

  if (!showDice) return null;

  if (!webGLSupported) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
        <h3>WebGL no soportado</h3>
        <p>Tu navegador no soporta WebGL requerido para el dado 3D.</p>
      </div>
    );
  }
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <button
          disabled={isRolling}
          onClick={() => setIsRolling(true)}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: isRolling ? "#666" : "#865E93",
            color: "white",
            border: "2px solid white",
            borderRadius: "8px",
            cursor: isRolling ? "not-allowed" : "pointer",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          {isRolling ? "Tirando..." : "Tirar Dado"}
        </button>
      </div>{" "}
      <Canvas
        shadows
        camera={{ position: [0, 4, 8], fov: 48 }}
        style={{
          width: "100%",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
        }}
      >
        <Environment preset="warehouse" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Physics gravity={[0, -9.8, 0]}>
          <Plane />
          <Dice
            isRolling={isRolling}
            setIsRolling={setIsRolling}
            diceFaces={diceFaces}
          />
        </Physics>
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
}

function Plane() {
  const ref = useRef<Mesh>(null);
  usePlane(
    () => ({
      rotation: [-Math.PI / 2, 0, 0],
      position: [0, 0, 0],
    }),
    ref
  );

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#E33" transparent opacity={0} />
    </mesh>
  );
}

interface DiceProps {
  isRolling: boolean;
  setIsRolling: (value: boolean) => void;
}

function Dice({
  isRolling,
  setIsRolling,
  diceFaces,
}: DiceProps & { diceFaces: string[] }) {
  const [ref, api] = useBox<Mesh>(() => ({
    mass: 1,
    position: [0, 2, 0],
    args: [2, 2, 2],
    // Cuando el dado colisiona con el suelo, se detiene el estado de "rolling"
    onCollide: () => setIsRolling(false),
  }));

  // Cada vez que isRolling cambie a true, reiniciamos posición y aplicamos velocidades
  useEffect(() => {
    if (isRolling) {
      api.position.set(0, 2, 0);
      api.velocity.set(
        (Math.random() - 0.5) * 2, // Velocidad en X
        Math.random() * 5 + 2, // Velocidad en Y
        (Math.random() - 0.5) * 2 // Velocidad en Z
      );
      api.angularVelocity.set(
        (Math.random() - 0.5) * 7, // Rotación en X
        (Math.random() - 0.5) * 5, // Rotación en Y
        (Math.random() - 0.5) * 5 // Rotación en Z
      );
    }
  }, [isRolling, api]);

  return (
    <mesh ref={ref} castShadow scale={[1, 1, 1]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="white" />
      {/* Agregamos las caras del dado */}
      {diceFaces.map((face, index) => (
        <Face key={index} text={face} faceIndex={index} />
      ))}
    </mesh>
  );
}

function Face({ text, faceIndex }: { text: string; faceIndex: number }) {
  // Posiciones y rotaciones predefinidas para cada cara del cubo
  const faceData = [
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

  const { pos, rot } = faceData[faceIndex];

  return (
    <Text
      position={pos}
      rotation={rot}
      fontSize={0.5}
      color="black"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
}

export default DiceWrapper;
