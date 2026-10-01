"use client";

import { Canvas, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import type { Group } from "three";

function Plate({
  position,
  size,
  color,
  rotation = 0,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  rotation?: number;
}) {
  return (
    <mesh
      position={position}
      rotation={[0, 0, rotation]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.62} metalness={0.04} />
    </mesh>
  );
}

function Scene({ selected, active }: { selected: number; active: boolean }) {
  const group = useRef<Group>(null);
  const { invalidate } = useThree();
  const previous = useRef(selected);

  useEffect(() => {
    if (!group.current || previous.current === selected) return;
    const node = group.current;
    previous.current = selected;
    if (!active) {
      invalidate();
      return;
    }
    const tween = gsap.fromTo(
      node.rotation,
      { y: selected > 0 ? -0.18 : 0.18, z: -0.05 },
      {
        y: 0,
        z: 0,
        duration: 0.75,
        ease: "power2.out",
        onUpdate: invalidate,
      },
    );
    return () => {
      tween.kill();
    };
  }, [selected, active, invalidate]);

  return (
    <group ref={group} rotation={[-0.13, -0.14, -0.05]}>
      <ambientLight intensity={2.1} />
      <directionalLight position={[3, 4, 8]} intensity={2.4} castShadow />
      <Plate
        position={[0.12, -0.18, -0.5]}
        size={[5.5, 4, 0.13]}
        color="#c7d6f5"
        rotation={0.07}
      />
      <Plate
        position={[-0.12, 0.04, -0.25]}
        size={[5.5, 4, 0.13]}
        color="#f4eee2"
        rotation={-0.045}
      />
      <Plate position={[0, 0.2, 0]} size={[5.25, 3.74, 0.13]} color="#ffffff" />
      {selected === 0 && (
        <group>
          <Plate
            position={[-1.37, 1.28, 0.13]}
            size={[1.55, 0.14, 0.04]}
            color="#3659dc"
          />
          <Plate
            position={[-0.28, 0.72, 0.13]}
            size={[3.72, 0.12, 0.04]}
            color="#c8d6f6"
          />
          <Plate
            position={[-0.57, 0.47, 0.13]}
            size={[3.13, 0.12, 0.04]}
            color="#dce7ff"
          />
          <Plate
            position={[-1.36, -0.4, 0.2]}
            size={[1.08, 1.1, 0.16]}
            color="#dce7ff"
          />
          <Plate
            position={[0, -0.4, 0.2]}
            size={[1.08, 1.1, 0.16]}
            color="#b8dfc7"
          />
          <Plate
            position={[1.36, -0.4, 0.2]}
            size={[1.08, 1.1, 0.16]}
            color="#f4d8ca"
          />
          <Plate
            position={[0, -1.25, 0.13]}
            size={[3.98, 0.1, 0.04]}
            color="#c8d6f6"
          />
        </group>
      )}
      {selected === 1 && (
        <group>
          <mesh position={[0, 0.25, 0.2]} rotation={[0, 0, -0.3]} castShadow>
            <torusGeometry args={[1.13, 0.045, 12, 96]} />
            <meshStandardMaterial color="#3659dc" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.25, 0.25]} rotation={[0, 0, -0.3]}>
            <coneGeometry args={[0.32, 1.55, 3]} />
            <meshStandardMaterial color="#3659dc" roughness={0.48} />
          </mesh>
          <mesh position={[0, 0.25, 0.27]} rotation={[0, 0, 2.84]}>
            <coneGeometry args={[0.32, 1.55, 3]} />
            <meshStandardMaterial color="#b8dfc7" roughness={0.48} />
          </mesh>
          <Plate
            position={[-1.4, -1.23, 0.12]}
            size={[1.0, 0.12, 0.04]}
            color="#c8d6f6"
          />
          <Plate
            position={[0, -1.23, 0.12]}
            size={[1.0, 0.12, 0.04]}
            color="#3659dc"
          />
          <Plate
            position={[1.4, -1.23, 0.12]}
            size={[1.0, 0.12, 0.04]}
            color="#c8d6f6"
          />
        </group>
      )}
      {selected === 2 && (
        <group>
          <Plate
            position={[0, 0.72, 0.13]}
            size={[4.55, 0.38, 0.05]}
            color="#203454"
          />
          <Plate
            position={[-1.04, 0.73, 0.18]}
            size={[1.4, 0.08, 0.04]}
            color="#b8dfc7"
          />
          <Plate
            position={[0, -0.12, 0.17]}
            size={[4.55, 1.06, 0.1]}
            color="#dce7ff"
          />
          <Plate
            position={[-0.87, -0.15, 0.24]}
            size={[1.7, 0.12, 0.04]}
            color="#3659dc"
          />
          <Plate
            position={[-1.42, -1.1, 0.17]}
            size={[1.0, 0.42, 0.1]}
            color="#f4d8ca"
          />
          <Plate
            position={[0, -1.1, 0.17]}
            size={[1.0, 0.42, 0.1]}
            color="#b8dfc7"
          />
          <Plate
            position={[1.42, -1.1, 0.17]}
            size={[1.0, 0.42, 0.1]}
            color="#c8d6f6"
          />
        </group>
      )}
    </group>
  );
}

export default function ServiceShowcaseCanvas({
  selected,
  active,
  onReady,
}: {
  selected: number;
  active: boolean;
  onReady: () => void;
}) {
  return (
    <Canvas
      className="service-showcase-canvas"
      orthographic
      camera={{ position: [0, 0, 10], zoom: 65 }}
      dpr={[1, 1.5]}
      frameloop="demand"
      shadows
      gl={{ antialias: true, powerPreference: "low-power" }}
      onCreated={onReady}
    >
      <Scene selected={selected} active={active} />
    </Canvas>
  );
}
