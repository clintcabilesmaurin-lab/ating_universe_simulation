import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SimulationOrbitsProps {
  isObserving: boolean;
  isPlayingMusic: boolean;
}

export function SimulationOrbits({
  isObserving,
  isPlayingMusic,
}: SimulationOrbitsProps) {
  const orbitsGroup = useRef<THREE.Group>(null);
  const pulseParticles = useRef<THREE.Points>(null);

  // 1. Clint's Orbital Trajectory Curve
  const clintOrbitGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 120;
    const clintRadiusX = 2.65;
    const clintRadiusZ = 2.15;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * clintRadiusX;
      const y = Math.sin(angle * 1.5) * 0.55 + 0.35;
      const z = Math.sin(angle) * clintRadiusZ;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // 2. Maica's Orbital Trajectory Curve
  const maicaOrbitGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 120;
    const maicaRadiusX = 2.45;
    const maicaRadiusZ = 2.75;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * maicaRadiusX;
      const y = -Math.sin(angle * 1.3) * 0.6 - 0.25;
      const z = Math.sin(angle) * maicaRadiusZ;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // 3. Thin scientific resonance curves (intersecting arcs)
  const arc1Geo = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 3.4, 2.8, 0, Math.PI * 1.6, false, 0);
    const pts = curve.getPoints(80).map((p) => new THREE.Vector3(p.x, 0, p.y));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  const arc2Geo = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 3.8, 3.2, Math.PI * 0.4, Math.PI * 2.1, false, 0);
    const pts = curve.getPoints(80).map((p) => new THREE.Vector3(p.x, 0, p.y));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  // Create primitive Line objects
  const orbitPrimitives = useMemo(() => {
    const clintLine = new THREE.Line(
      clintOrbitGeo,
      new THREE.LineBasicMaterial({
        color: "#5ac8fa",
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
      })
    );

    const maicaLine = new THREE.Line(
      maicaOrbitGeo,
      new THREE.LineBasicMaterial({
        color: "#ff7a70",
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
      })
    );

    const arc1Line = new THREE.Line(
      arc1Geo,
      new THREE.LineBasicMaterial({
        color: "#9aa6b8",
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
      })
    );

    const arc2Line = new THREE.Line(
      arc2Geo,
      new THREE.LineBasicMaterial({
        color: "#9aa6b8",
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
      })
    );

    return { clintLine, maicaLine, arc1Line, arc2Line };
  }, [clintOrbitGeo, maicaOrbitGeo, arc1Geo, arc2Geo]);

  // Occasional trajectory pulse particles
  const pulseCount = 18;
  const pulseGeo = useMemo(() => {
    const positions = new Float32Array(pulseCount * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speed = isObserving ? 0.02 : isPlayingMusic ? 0.08 : 0.04;

    if (orbitsGroup.current) {
      orbitsGroup.current.rotation.y = t * speed * 0.4;
    }

    if (pulseParticles.current) {
      const posAttr = pulseParticles.current.geometry.attributes.position;
      const positions = posAttr.array as Float32Array;

      for (let i = 0; i < pulseCount; i++) {
        const angle = (i / pulseCount) * Math.PI * 2 + t * speed * 2;
        const r = 3.4 + Math.sin(angle * 2 + t) * 0.3;
        positions[i * 3] = Math.cos(angle) * r;
        positions[i * 3 + 1] = Math.sin(angle * 3) * 0.4;
        positions[i * 3 + 2] = Math.sin(angle) * r;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={orbitsGroup}>
      {/* Clint's Orbit Line */}
      <primitive object={orbitPrimitives.clintLine} />

      {/* Maica's Orbit Line */}
      <primitive object={orbitPrimitives.maicaLine} />

      {/* Intersecting Arc 1 */}
      <primitive
        object={orbitPrimitives.arc1Line}
        rotation={[Math.PI / 3, 0, Math.PI / 4]}
      />

      {/* Intersecting Arc 2 */}
      <primitive
        object={orbitPrimitives.arc2Line}
        rotation={[-Math.PI / 4, 0, -Math.PI / 5]}
      />

      {/* Orbit Trajectory Micro Dust */}
      <points ref={pulseParticles} geometry={pulseGeo}>
        <pointsMaterial
          size={0.03}
          color="#ced7e5"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
