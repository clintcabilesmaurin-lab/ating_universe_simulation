import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SimulationCore } from "./SimulationCore";
import { SimulationAgents } from "./SimulationAgents";
import { SimulationOrbits } from "./SimulationOrbits";

interface SimulationWorldProps {
  activeSpeaker: "clint" | "maica" | null;
  isObserving: boolean;
  isPlayingMusic: boolean;
  onSelectSpeaker?: (speaker: "clint" | "maica") => void;
}

function SceneRig({
  activeSpeaker,
  isObserving,
  isPlayingMusic,
  onSelectSpeaker,
}: SimulationWorldProps) {
  const { size } = useThree();
  const worldGroup = useRef<THREE.Group>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const isMobile = size.width < 768;
  const baseElev = isMobile ? 1.05 : 0.92;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalized coordinates from -1 to 1
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseTarget.current.x = nx;
      mouseTarget.current.y = ny;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    // Smooth pointer parallax on the scene group
    if (worldGroup.current) {
      const targetRotY = mouseTarget.current.x * 0.18;
      const targetRotX = -mouseTarget.current.y * 0.12;
      worldGroup.current.rotation.y = THREE.MathUtils.damp(
        worldGroup.current.rotation.y,
        targetRotY,
        2.5,
        delta
      );
      worldGroup.current.rotation.x = THREE.MathUtils.damp(
        worldGroup.current.rotation.x,
        targetRotX,
        2.5,
        delta
      );

      // Elevated 3D scene positioning so core and orbital paths float well above dialogue box
      const targetPosX = mouseTarget.current.x * 0.15;
      const targetPosY = baseElev + mouseTarget.current.y * 0.1;
      worldGroup.current.position.x = THREE.MathUtils.damp(
        worldGroup.current.position.x,
        targetPosX,
        2.0,
        delta
      );
      worldGroup.current.position.y = THREE.MathUtils.damp(
        worldGroup.current.position.y,
        targetPosY,
        2.0,
        delta
      );
    }
  });

  return (
    <group ref={worldGroup} position={[0, baseElev, 0]}>
      <SimulationOrbits
        isObserving={isObserving}
        isPlayingMusic={isPlayingMusic}
      />
      <SimulationCore
        activeSpeaker={activeSpeaker}
        isObserving={isObserving}
        isPlayingMusic={isPlayingMusic}
      />
      <SimulationAgents
        activeSpeaker={activeSpeaker}
        isObserving={isObserving}
        isPlayingMusic={isPlayingMusic}
        onSelectSpeaker={onSelectSpeaker}
      />
    </group>
  );
}

export function SimulationWorld(props: SimulationWorldProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "auto", zIndex: 0 }}>
      <Canvas
        camera={{
          position: [0, 0.28, isMobile ? 8.2 : 6.8],
          fov: isMobile ? 48 : 40,
        }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 6, 4]} intensity={0.4} color="#e5ebf5" />
        <directionalLight position={[-4, -3, -2]} intensity={0.2} color="#8a94a6" />
        <SceneRig {...props} />
      </Canvas>
    </div>
  );
}
