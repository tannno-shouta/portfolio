"use client";

import { useRef, useMemo, useEffect, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "three";
import { gsap } from "@/lib/gsap";
import { skullBodyVert, skullBodyFrag } from "@/lib/shaders/skullBody.glsl";
import { skullAuraVert, skullAuraFrag } from "@/lib/shaders/skullAura.glsl";

const SKULL_URL =
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/skull/model.gltf";

// ---- Aura plane ----
function SkullAura({ opacity }: { opacity: { current: number } }) {
  const matRef = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value    = clock.getElapsedTime();
    matRef.current.uniforms.uOpacity.value = opacity.current;
  });

  return (
    <mesh position={[0, 0.3, -0.5]} scale={[5.5, 5.5, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={skullAuraVert}
        fragmentShader={skullAuraFrag}
        uniforms={{
          uTime:    { value: 0 },
          uOpacity: { value: 0 },
          uHsv1:    { value: new Vector3(0.15, 0.62, 1.0) },
        }}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

// ---- 360 particles ----
function SkullParticles({ opacity }: { opacity: { current: number } }) {
  const matRef = useRef<ShaderMaterial>(null);

  const geo = useMemo(() => {
    const COUNT = 360;
    const positions: number[] = [];
    const randoms:   number[] = [];

    for (let i = 0; i < COUNT; i++) {
      const angle  = (i / COUNT) * Math.PI * 2;
      const radius = 1.4 + (Math.random() - 0.5) * 0.5;
      const y      = (Math.random() - 0.5) * 2.0;
      positions.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      randoms.push(Math.random());
    }

    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(positions, 3));
    g.setAttribute("aRandom",  new Float32BufferAttribute(randoms, 1));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value    = clock.getElapsedTime();
    matRef.current.uniforms.uOpacity.value = opacity.current;
  });

  return (
    <points geometry={geo}>
      <shaderMaterial
        ref={matRef}
        vertexShader={`
          attribute float aRandom;
          uniform float uTime;
          varying float vRandom;
          void main() {
            vRandom = aRandom;
            vec3 pos = position;
            pos.y += sin(uTime * 0.6 + aRandom * 6.28) * 0.08;
            gl_Position  = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 2.0 + aRandom * 2.0;
          }
        `}
        fragmentShader={`
          uniform float uOpacity;
          varying float vRandom;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            gl_FragColor = vec4(0.72, 0.64, 1.0, (1.0 - d * 2.0) * uOpacity * vRandom);
          }
        `}
        uniforms={{
          uTime:    { value: 0 },
          uOpacity: { value: 0 },
        }}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

// ---- Skull mesh ----
function SkullMesh({
  dissolve,
  auraOpacity,
  particleOpacity,
}: {
  dissolve:        { current: number };
  auraOpacity:     { current: number };
  particleOpacity: { current: number };
}) {
  const { scene } = useGLTF(SKULL_URL);
  const groupRef  = useRef<Group>(null);
  const matRef    = useRef<ShaderMaterial>(null);
  const { camera, mouse } = useThree();

  // mouse tracking – lerped rotation
  const targetRot = useRef(new Vector2(0, 0));
  const currentRot = useRef(new Vector2(0, 0));

  useFrame(() => {
    if (!matRef.current || !groupRef.current) return;

    // update uniforms
    matRef.current.uniforms.uDissolve.value = dissolve.current;

    // mouse look
    targetRot.current.set(mouse.y * 0.3, mouse.x * 0.5);
    currentRot.current.lerp(targetRot.current, 0.06);
    groupRef.current.rotation.x = currentRot.current.x;
    groupRef.current.rotation.y = currentRot.current.y;
  });

  // apply shader to every mesh in the GLTF
  useEffect(() => {
    const mat = new ShaderMaterial({
      vertexShader:   skullBodyVert,
      fragmentShader: skullBodyFrag,
      uniforms: {
        uTime:    { value: 0 },
        uDissolve: { value: 1.0 },
        uHsv1:    { value: new Vector3(0.09, 0.70, 0.45) },
        uHsv2:    { value: new Vector3(0.778, 0.11, 0.11) },
      },
    });
    matRef.current = mat;

    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        (child as Mesh).material = mat;
      }
    });

    // dissolve-in animation
    gsap.to(dissolve, {
      current: 0,
      duration: 5,
      delay: 0.5,
      ease: "power2.inOut",
    });
    gsap.to(auraOpacity, {
      current: 0.75,
      duration: 1.5,
      delay: 2.6,
      ease: "power2.out",
    });
    gsap.to(particleOpacity, {
      current: 1,
      duration: 2,
      delay: 4,
      ease: "power2.out",
    });

    // uTime ticker (separate from dissolve)
    const ticker = gsap.ticker.add((t) => {
      if (mat.uniforms.uTime) mat.uniforms.uTime.value = t;
    });

    return () => {
      gsap.ticker.remove(ticker as unknown as (t: number, dt: number, frame: number) => void);
      mat.dispose();
    };
  }, [scene]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={[0.9, 0.9, 0.9]}>
      <primitive object={scene} />
    </group>
  );
}

// ---- orchestrator ----
const dissolve        = { current: 1.0 };
const auraOpacity     = { current: 0.0 };
const particleOpacity = { current: 0.0 };

export function SkullScene() {
  return (
    <>
      <SkullAura opacity={auraOpacity} />
      <Suspense fallback={null}>
        <SkullMesh
          dissolve={dissolve}
          auraOpacity={auraOpacity}
          particleOpacity={particleOpacity}
        />
      </Suspense>
      <SkullParticles opacity={particleOpacity} />
    </>
  );
}

useGLTF.preload(SKULL_URL);
