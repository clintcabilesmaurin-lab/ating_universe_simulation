import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SimulationCoreProps {
  activeSpeaker: "clint" | "maica" | null;
  isObserving: boolean;
  isPlayingMusic: boolean;
}

export function SimulationCore({
  activeSpeaker,
  isObserving,
  isPlayingMusic,
}: SimulationCoreProps) {
  const coreGroup = useRef<THREE.Group>(null);
  const innerSphere = useRef<THREE.Mesh>(null);
  const wireframeIcosa = useRef<THREE.Mesh>(null);
  const wireframeDodeca = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const fragmentsGroup = useRef<THREE.Group>(null);

  // Determine dynamic target colors based on active speaker state
  const targetColors = useMemo(() => {
    if (activeSpeaker === "clint") {
      return {
        light: "#5ac8fa",
        emissive: "#1b425b",
        wireframe: "#64d2ff",
        intensity: 5.5,
      };
    }
    if (activeSpeaker === "maica") {
      return {
        light: "#ff7a70",
        emissive: "#5b2420",
        wireframe: "#ff9088",
        intensity: 5.5,
      };
    }
    // Idle / Both active
    return {
      light: isPlayingMusic ? "#9ab4d0" : "#d8dce6",
      emissive: "#141720",
      wireframe: "#8a94a6",
      intensity: isObserving ? 2.2 : 3.0,
    };
  }, [activeSpeaker, isObserving, isPlayingMusic]);

  // Generate delicate floating shards / fragments
  const fragmentData = useMemo(() => {
    const items = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 0.85 + Math.random() * 0.45;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      items.push({
        pos: new THREE.Vector3(x, y, z),
        origPos: new THREE.Vector3(x, y, z),
        rotSpeed: (Math.random() - 0.5) * 0.04,
        scale: 0.02 + Math.random() * 0.035,
      });
    }
    return items;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speedMult = activeSpeaker ? 1.8 : isObserving ? 0.6 : 1.0;

    if (coreGroup.current) {
      coreGroup.current.rotation.y = t * 0.12 * speedMult;
      coreGroup.current.rotation.z = Math.sin(t * 0.2) * 0.05;
    }

    if (wireframeIcosa.current) {
      wireframeIcosa.current.rotation.x = t * 0.18 * speedMult;
      wireframeIcosa.current.rotation.y = -t * 0.22 * speedMult;
    }

    if (wireframeDodeca.current) {
      wireframeDodeca.current.rotation.y = t * 0.15 * speedMult;
      wireframeDodeca.current.rotation.z = -t * 0.12 * speedMult;
    }

    if (ringA.current) {
      ringA.current.rotation.z = t * 0.25 * speedMult;
    }
    if (ringB.current) {
      ringB.current.rotation.x = -t * 0.2 * speedMult;
    }

    // Breathing pulse
    if (innerSphere.current) {
      const pulse = 1 + Math.sin(t * (activeSpeaker ? 3.5 : 1.8)) * 0.045;
      innerSphere.current.scale.set(pulse, pulse, pulse);
    }

    // Dynamic light color transition
    if (pointLightRef.current) {
      pointLightRef.current.color.lerp(new THREE.Color(targetColors.light), 0.08);
      pointLightRef.current.intensity = THREE.MathUtils.lerp(
        pointLightRef.current.intensity,
        targetColors.intensity + (activeSpeaker ? Math.sin(t * 6) * 0.8 : 0),
        0.1
      );
    }

    // Breathing fragments
    if (fragmentsGroup.current) {
      const expand = activeSpeaker ? 1.15 : 1.0 + Math.sin(t * 1.5) * 0.04;
      fragmentsGroup.current.scale.set(expand, expand, expand);
      fragmentsGroup.current.children.forEach((child, idx) => {
        child.rotation.x += fragmentData[idx].rotSpeed;
        child.rotation.y += fragmentData[idx].rotSpeed * 1.2;
      });
    }
  });

  return (
    <group ref={coreGroup} position={[0, 0, 0]}>
      {/* Central Core Light */}
      <pointLight
        ref={pointLightRef}
        color={targetColors.light}
        intensity={targetColors.intensity}
        distance={7}
        decay={2}
      />

      {/* Translucent Central Orb - sized conservatively ~0.42 radius */}
      <mesh ref={innerSphere}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color="#0e1117"
          emissive={targetColors.emissive}
          emissiveIntensity={0.8}
          roughness={0.25}
          metalness={0.85}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Mid Layer Wireframe Icosahedron */}
      <mesh ref={wireframeIcosa}>
        <icosahedronGeometry args={[0.68, 0]} />
        <meshBasicMaterial
          color={targetColors.wireframe}
          wireframe
          transparent
          opacity={activeSpeaker ? 0.6 : 0.3}
        />
      </mesh>

      {/* Outer Layer Wireframe Octahedron */}
      <mesh ref={wireframeDodeca}>
        <octahedronGeometry args={[0.92, 0]} />
        <meshBasicMaterial
          color="#929cb0"
          wireframe
          transparent
          opacity={activeSpeaker ? 0.45 : 0.2}
        />
      </mesh>

      {/* Precision Planar Ring A */}
      <mesh ref={ringA} rotation={[Math.PI / 3.4, 0.2, 0]}>
        <torusGeometry args={[1.15, 0.007, 8, 120]} />
        <meshBasicMaterial
          color={activeSpeaker === "clint" ? "#64d2ff" : "#8ca0b8"}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Precision Planar Ring B */}
      <mesh ref={ringB} rotation={[-Math.PI / 4, 0.3, 0.4]}>
        <torusGeometry args={[1.35, 0.005, 8, 120]} />
        <meshBasicMaterial
          color={activeSpeaker === "maica" ? "#ff7a70" : "#a88e96"}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Delicate floating fragments */}
      <group ref={fragmentsGroup}>
        {fragmentData.map((item, idx) => (
          <mesh
            key={idx}
            position={[item.pos.x, item.pos.y, item.pos.z]}
            scale={[item.scale, item.scale, item.scale]}
          >
            <tetrahedronGeometry args={[1, 0]} />
            <meshBasicMaterial
              color={idx % 2 === 0 ? "#7fa2c0" : "#c08c90"}
              wireframe
              transparent
              opacity={0.35}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
