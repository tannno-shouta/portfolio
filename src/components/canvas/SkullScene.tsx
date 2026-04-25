"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial as ThreeShaderMaterial, Group } from "three";
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "three";
import { gsap } from "@/lib/gsap";
import { skullBodyFrag } from "@/lib/shaders/skullBody.glsl";
import { skullAuraVert, skullAuraFrag } from "@/lib/shaders/skullAura.glsl";

// ── 頂点シェーダー（外部 .glsl.ts を使わずここに書く） ──────────────────
const skullVert = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  // simplex noise
  vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
    i=mod289v3(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
    vec4 xv=x_*ns.x+ns.yyyy;vec4 yv=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(xv)-abs(yv);
    vec4 b0=vec4(xv.xy,yv.xy);vec4 b1=vec4(xv.zw,yv.zw);
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

  void main(){
    vUv = uv;
    vec3 pos = position;
    // skull shape: stretch vertically, taper jaw
    pos.y *= 1.25;
    pos.x *= 0.88;
    pos.z *= 0.92;
    float jaw = smoothstep(0.2, -1.2, pos.y) * 0.35;
    pos.x *= (1.0 - jaw);
    pos.z *= (1.0 - jaw);
    // organic noise wobble
    float n = snoise(normal * 1.8 + uTime * 0.2);
    pos += normal * n * 0.1;
    vNormal   = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ── Aura ────────────────────────────────────────────────────────────────────
function SkullAura() {
  const matRef = useRef<ThreeShaderMaterial>(null);

  useEffect(() => {
    if (!matRef.current) return;
    gsap.to(matRef.current.uniforms.uOpacity, {
      value: 0.8,
      duration: 1.5,
      delay: 2.2,
      ease: "power2.out",
    });
  }, []);

  useFrame(({ clock }) => {
    if (matRef.current)
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
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

// ── Particles ────────────────────────────────────────────────────────────────
function SkullParticles() {
  const matRef = useRef<ThreeShaderMaterial>(null);

  const geo = useMemo(() => {
    const COUNT = 360;
    const pos: number[] = [], rnd: number[] = [];
    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * Math.PI * 2;
      const r = 1.5 + (Math.random() - 0.5) * 0.6;
      const y = (Math.random() - 0.5) * 2.2;
      pos.push(Math.cos(a) * r, y, Math.sin(a) * r);
      rnd.push(Math.random());
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.setAttribute("aRandom",  new Float32BufferAttribute(rnd, 1));
    return g;
  }, []);

  useEffect(() => {
    if (!matRef.current) return;
    gsap.to(matRef.current.uniforms.uOpacity, {
      value: 1,
      duration: 2,
      delay: 3.8,
      ease: "power2.out",
    });
  }, []);

  useFrame(({ clock }) => {
    if (matRef.current)
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points geometry={geo}>
      <shaderMaterial
        ref={matRef}
        vertexShader={`
          attribute float aRandom;
          uniform float uTime;
          varying float vRandom;
          void main(){
            vRandom=aRandom;
            vec3 p=position;
            p.y+=sin(uTime*0.6+aRandom*6.28)*0.1;
            gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
            gl_PointSize=2.0+aRandom*2.5;
          }
        `}
        fragmentShader={`
          uniform float uOpacity;
          varying float vRandom;
          void main(){
            float d=length(gl_PointCoord-0.5);
            if(d>0.5)discard;
            gl_FragColor=vec4(0.72,0.64,1.0,(1.0-d*2.0)*uOpacity*vRandom);
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

// ── Skull blob ───────────────────────────────────────────────────────────────
function SkullBlob() {
  const groupRef = useRef<Group>(null!);
  const matRef   = useRef<ThreeShaderMaterial>(null);
  const mouse    = useRef(new Vector2(0, 0));
  const curRot   = useRef(new Vector2(0, 0));

  useEffect(() => {
    if (!matRef.current) return;

    // dissolve 1 → 0 (fully dissolved → visible)
    gsap.to(matRef.current.uniforms.uDissolve, {
      value: 0,
      duration: 5,
      delay: 0.3,
      ease: "power2.inOut",
    });

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
    if (matRef.current)
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    if (groupRef.current) {
      curRot.current.lerp(mouse.current, 0.06);
      groupRef.current.rotation.y = curRot.current.x;
      groupRef.current.rotation.x = curRot.current.y;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.2, 32]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={skullVert}
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

// ── Root ─────────────────────────────────────────────────────────────────────
export function SkullScene() {
  return (
    <>
      <SkullAura />
      <SkullBlob />
      <SkullParticles />
    </>
  );
}
