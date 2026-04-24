"use client";

import { Canvas } from "@react-three/fiber";
import { SkullScene } from "./SkullScene";

export function Scene() {
  return (
    <Canvas
      className="!fixed inset-0 -z-10"
      camera={{ position: [0, 0, 4], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <SkullScene />
    </Canvas>
  );
}
