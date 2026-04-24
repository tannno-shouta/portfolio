"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial as ShaderMaterialType, Group } from "three";
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Vector2,
  Vector3,
} from "three";
import { gsap } from "@/lib/gsap";
import { skullBodyVert, skullBodyFrag } from "@/lib/shaders/skullBody.glsl";
import { skullAuraVert, skullAuraFrag } from "@/lib/shaders/skullAura.glsl";
import { useEffect } from "react";

// ---- Aura plane ----
function SkullAura({ opacityRef }: { opacityRef: React.MutableRefObject<number> }) {
  const matRef = useRef<ShaderMaterialType>(null);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value    = clock.getElapsedTime();
    matRef.current.uniforms.uOpacity.value = opacityRef.current;
  });

  return (
    <mesh position={[0, 0.1, -0.5]} scale={[5.5, 5.5, 1]}>
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
function SkullParticles({ opacityRef }: { opacityRef: React.MutableRefObject<number> }) {
  const matRef = useRef<ShaderMaterialType>(null);

  const geo = useMemo(() => {
    const COUNT = 360;
    const positions: number[] = [];
    const randoms:   number[] = [];
    for (let i = 0; i < COUNT; i++) {
      const angle  = (i / COUNT) * Math.PI * 2;
      const radius = 1.5 + (Math.random() - 0.5) * 0.6;
      const y      = (Math.random() - 0.5) * 2.2;
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
    matRef.current.uniforms.uOpacity.value = opacityRef.current;
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
            pos.y += sin(uTime * 0.6 + aRandom * 6.28) * 0.1;
            gl_Position  = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 2.0 + aRandom * 2.5;
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
        uniforms={{ uTime: { value: 0 }, uOpacity: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

// ---- Procedural skull blob ----
// skull-body シェーダーをそのまま使い、頂点シェーダー側で
// 楕円変形 + ノイズ変位 → 頭蓋骨らしいシルエットを作る
const skullProceduralVert = /* glsl */ `
  uniform float uTime;
  uniform float uDissolve;
  varying vec3 vNormal;
  varying vec3 vPosition;

  vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);
    const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289v3(i);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.,i1.z,i2.z,1.))
      +i.y+vec4(0.,i1.y,i2.y,1.))
      +i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.*x_);
    vec4 xv=x_*ns.x+ns.yyyy;
    vec4 yv=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(xv)-abs(yv);
    vec4 b0=vec4(xv.xy,yv.xy);
    vec4 b1=vec4(xv.zw,yv.zw);
    vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    // 楕円変形: 縦長の頭蓋骨シルエット
    vec3 pos = position;
    pos.y   *= 1.25;   // 縦に伸ばす
    pos.x   *= 0.88;   // 横を少し絞る
    pos.z   *= 0.92;

    // 下部（顎方向）を絞って頭蓋骨下部らしく
    float jawFactor = smoothstep(0.2, -1.2, pos.y) * 0.35;
    pos.x *= (1.0 - jawFactor);
    pos.z *= (1.0 - jawFactor);

    // noise 変位
    float n = snoise(normal * 1.8 + uTime * 0.2);
    pos += normal * n * 0.12;

    vNormal   = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

function SkullBlob({
  dissolveRef,
  auraOpacityRef,
  particleOpacityRef,
}: {
  dissolveRef:        React.MutableRefObject<number>;
  auraOpacityRef:     React.MutableRefObject<number>;
  particleOpacityRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<Group>(null!);
  const matRef   = useRef<ShaderMaterialType>(null);
  const mouse    = useRef(new Vector2(0, 0));
  const currentRot = useRef(new Vector2(0, 0));

  // mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.set(
        (e.clientX / window.innerWidth  - 0.5) *  1.0,
        (e.clientY / window.innerHeight - 0.5) * -0.6,
      );
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ clock }) => {
    if (!matRef.current || !groupRef.current) return;
    matRef.current.uniforms.uDissolve.value = dissolveRef.current;
    matRef.current.uniforms.uTime.value     = clock.getElapsedTime();

    currentRot.current.lerp(mouse.current, 0.06);
    groupRef.current.rotation.y = currentRot.current.x;
    groupRef.current.rotation.x = currentRot.current.y;
  });

  useEffect(() => {
    gsap.to(dissolveRef,        { current: 0,    duration: 5,   delay: 0.5, ease: "power2.inOut" });
    gsap.to(auraOpacityRef,     { current: 0.75, duration: 1.5, delay: 2.6, ease: "power2.out"   });
    gsap.to(particleOpacityRef, { current: 1,    duration: 2,   delay: 4,   ease: "power2.out"   });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.2, 32]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={skullProceduralVert}
          fragmentShader={skullBodyFrag}
          uniforms={{
            uTime:     { value: 0 },
            uDissolve: { value: 1.0 },
            uHsv1:     { value: new Vector3(0.09, 0.70, 0.45) },
            uHsv2:     { value: new Vector3(0.778, 0.11, 0.11) },
          }}
        />
      </mesh>
    </group>
  );
}

// ---- root ----
export function SkullScene() {
  const dissolveRef        = useRef(1.0);
  const auraOpacityRef     = useRef(0.0);
  const particleOpacityRef = useRef(0.0);

  return (
    <>
      <SkullAura     opacityRef={auraOpacityRef} />
      <SkullBlob
        dissolveRef={dissolveRef}
        auraOpacityRef={auraOpacityRef}
        particleOpacityRef={particleOpacityRef}
      />
      <SkullParticles opacityRef={particleOpacityRef} />
    </>
  );
}
