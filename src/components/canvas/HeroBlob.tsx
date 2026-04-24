"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { IcosahedronGeometry } from "three";
import type { ShaderMaterial } from "three";
import { heroBlobVert, heroBlobFrag } from "@/lib/shaders/heroBlob.glsl";

export function HeroBlob() {
  const matRef = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <icosahedronGeometry args={[1.4, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={heroBlobVert}
        fragmentShader={heroBlobFrag}
        uniforms={{
          uTime: { value: 0 },
          uDistortion: { value: 0.35 },
        }}
        transparent
      />
    </mesh>
  );
}
