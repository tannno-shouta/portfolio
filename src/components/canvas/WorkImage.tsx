"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import type { ShaderMaterial } from "three";
import { gsap } from "@/lib/gsap";
import { workImageVert, workImageFrag } from "@/lib/shaders/workImage.glsl";

interface WorkImageProps {
  src: string;
  width: number;
  height: number;
  position: [number, number, number];
  isVisible?: boolean;
}

export function WorkImage({
  src,
  width,
  height,
  position,
  isVisible = true,
}: WorkImageProps) {
  const matRef = useRef<ShaderMaterial>(null);
  const hoverRef = useRef(0);
  const texture = useTexture(src);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uHover.value = hoverRef.current;
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  const onPointerEnter = () => {
    gsap.to(hoverRef, { current: 1, duration: 0.6, ease: "power3.out" });
  };
  const onPointerLeave = () => {
    gsap.to(hoverRef, { current: 0, duration: 0.6, ease: "power3.out" });
  };

  return (
    <mesh
      position={position}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <planeGeometry args={[width, height, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={workImageVert}
        fragmentShader={workImageFrag}
        uniforms={{
          uTexture: { value: texture },
          uHover: { value: 0 },
          uTime: { value: 0 },
        }}
      />
    </mesh>
  );
}
