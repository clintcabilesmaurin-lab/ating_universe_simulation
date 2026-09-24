import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface SimulationAgentsProps {
  activeSpeaker: "clint" | "maica" | null;
  isObserving: boolean;
  isPlayingMusic: boolean;
  onSelectSpeaker?: (speaker: "clint" | "maica") => void;
}

export function SimulationAgents({
  activeSpeaker,
  isObserving,
  isPlayingMusic,
  onSelectSpeaker,
}: SimulationAgentsProps) {
  const clintGroup = useRef<THREE.Group>(null);
  const maicaGroup = useRef<THREE.Group>(null);
  const transferParticles = useRef<THREE.Points>(null);

  // Dynamic connection line object between Clint and Maica
  const connectionLineObject = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const mat = new THREE.LineBasicMaterial({
      color: "#e8effc",
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(geo, mat);
  }, []);

  // Clint's local particle field
  const clintParticlesGeo = useMemo(() => {
    const count = 35;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 0.2 + Math.random() * 0.45;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  // Maica's local particle field
  const maicaParticlesGeo = useMemo(() => {
    const count = 35;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 0.2 + Math.random() * 0.45;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  // Data exchange transfer particles traveling between Clint & Maica
  const transferCount = 24;
  const transferGeo = useMemo(() => {
    const positions = new Float32Array(transferCount * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const transferProgress = useRef(new Float32Array(transferCount).map(() => Math.random()));

  // Frame loop for orbital physics and responsive states
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speedMult = isObserving ? 0.6 : isPlayingMusic ? 1.25 : 1.0;

    // 1. Clint's Orbital Trajectory (elliptical, tilted)
    const clintAngle = t * 0.28 * speedMult;
    const clintRadiusX = 2.65;
    const clintRadiusZ = 2.15;
    const clintX = Math.cos(clintAngle) * clintRadiusX;
    const clintY = Math.sin(clintAngle * 1.5) * 0.55 + 0.35;
    const clintZ = Math.sin(clintAngle) * clintRadiusZ;

    if (clintGroup.current) {
      clintGroup.current.position.set(clintX, clintY, clintZ);
      const clintScale = activeSpeaker === "clint" ? 1.28 + Math.sin(t * 8) * 0.08 : 1.0;
      clintGroup.current.scale.lerp(new THREE.Vector3(clintScale, clintScale, clintScale), 0.1);
    }

    // 2. Maica's Orbital Trajectory (offset phase and inclination)
    const maicaAngle = t * 0.24 * speedMult + Math.PI * 0.92;
    const maicaRadiusX = 2.45;
    const maicaRadiusZ = 2.75;
    const maicaX = Math.cos(maicaAngle) * maicaRadiusX;
    const maicaY = -Math.sin(maicaAngle * 1.3) * 0.6 - 0.25;
    const maicaZ = Math.sin(maicaAngle) * maicaRadiusZ;

    if (maicaGroup.current) {
      maicaGroup.current.position.set(maicaX, maicaY, maicaZ);
      const maicaScale = activeSpeaker === "maica" ? 1.28 + Math.sin(t * 8) * 0.08 : 1.0;
      maicaGroup.current.scale.lerp(new THREE.Vector3(maicaScale, maicaScale, maicaScale), 0.1);
    }

    // 3. Dynamic Connecting Line
    const clintPos = new THREE.Vector3(clintX, clintY, clintZ);
    const maicaPos = new THREE.Vector3(maicaX, maicaY, maicaZ);

    connectionLineObject.geometry.setFromPoints([clintPos, maicaPos]);
    const targetLineOpacity =
      activeSpeaker !== null
        ? 0.55 + Math.sin(t * 6) * 0.15
        : isObserving
        ? 0.2
        : 0.12;
    const lineMat = connectionLineObject.material as THREE.LineBasicMaterial;
    lineMat.opacity = THREE.MathUtils.lerp(lineMat.opacity, targetLineOpacity, 0.08);

    // 4. Transfer particles between the two nodes
    if (transferParticles.current) {
      const posAttr = transferParticles.current.geometry.attributes.position;
      const positions = posAttr.array as Float32Array;

      for (let i = 0; i < transferCount; i++) {
        transferProgress.current[i] = (transferProgress.current[i] + 0.008 * speedMult) % 1;
        const p = transferProgress.current[i];
        const currentPos = new THREE.Vector3().lerpVectors(clintPos, maicaPos, p);
        const wobble = Math.sin(p * Math.PI * 4 + t * 4) * 0.05;
        positions[i * 3] = currentPos.x + wobble;
        positions[i * 3 + 1] = currentPos.y + wobble;
        positions[i * 3 + 2] = currentPos.z + wobble;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Clint: Cool Cyan Entity */}
      <group
        ref={clintGroup}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSpeaker?.("clint");
        }}
      >
        {/* Core glowing sphere */}
        <mesh>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshBasicMaterial color={activeSpeaker === "clint" ? "#ffffff" : "#5ac8fa"} />
        </mesh>

        {/* Outer aura ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.16, 0.19, 24]} />
          <meshBasicMaterial
            color="#5ac8fa"
            transparent
            opacity={activeSpeaker === "clint" ? 0.75 : 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Local Micro Particles */}
        <points geometry={clintParticlesGeo}>
          <pointsMaterial
            size={0.035}
            color="#5ac8fa"
            transparent
            opacity={activeSpeaker === "clint" ? 0.75 : 0.4}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>

        {/* Point light accent */}
        <pointLight
          color="#5ac8fa"
          intensity={activeSpeaker === "clint" ? 4.5 : 1.8}
          distance={3.5}
        />

        {/* Minimal HTML Label */}
        <Html
          position={[0, 0.32, 0]}
          center
          distanceFactor={10}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div
            style={{
              fontFamily: "var(--font-family-base)",
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: activeSpeaker === "clint" ? "#ffffff" : "rgba(90, 200, 250, 0.85)",
              background: "rgba(6, 8, 12, 0.65)",
              padding: "2px 6px",
              border: `1px solid ${
                activeSpeaker === "clint" ? "rgba(90, 200, 250, 0.7)" : "rgba(90, 200, 250, 0.2)"
              }`,
              borderRadius: "2px",
              whiteSpace: "nowrap",
              backdropFilter: "blur(4px)",
            }}
          >
            AI CLINT {activeSpeaker === "clint" && "●"}
          </div>
        </Html>
      </group>

      {/* Maica: Warm Coral Entity */}
      <group
        ref={maicaGroup}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSpeaker?.("maica");
        }}
      >
        {/* Core glowing sphere */}
        <mesh>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshBasicMaterial color={activeSpeaker === "maica" ? "#ffffff" : "#ff7a70"} />
        </mesh>

        {/* Outer aura ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.16, 0.19, 24]} />
          <meshBasicMaterial
            color="#ff7a70"
            transparent
            opacity={activeSpeaker === "maica" ? 0.75 : 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Local Micro Particles */}
        <points geometry={maicaParticlesGeo}>
          <pointsMaterial
            size={0.035}
            color="#ff7a70"
            transparent
            opacity={activeSpeaker === "maica" ? 0.75 : 0.4}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>

        {/* Point light accent */}
        <pointLight
          color="#ff7a70"
          intensity={activeSpeaker === "maica" ? 4.5 : 1.8}
          distance={3.5}
        />

        {/* Minimal HTML Label */}
        <Html
          position={[0, 0.32, 0]}
          center
          distanceFactor={10}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div
            style={{
              fontFamily: "var(--font-family-base)",
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: activeSpeaker === "maica" ? "#ffffff" : "rgba(255, 122, 112, 0.85)",
              background: "rgba(6, 8, 12, 0.65)",
              padding: "2px 6px",
              border: `1px solid ${
                activeSpeaker === "maica" ? "rgba(255, 122, 112, 0.7)" : "rgba(255, 122, 112, 0.2)"
              }`,
              borderRadius: "2px",
              whiteSpace: "nowrap",
              backdropFilter: "blur(4px)",
            }}
          >
            AI MAICA {activeSpeaker === "maica" && "●"}
          </div>
        </Html>
      </group>

      {/* Dynamic Connecting Line Object */}
      <primitive object={connectionLineObject} />

      {/* Data Exchange Transfer Particles */}
      <points ref={transferParticles} geometry={transferGeo}>
        <pointsMaterial
          size={0.045}
          color="#e6edfa"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </>
  );
}
