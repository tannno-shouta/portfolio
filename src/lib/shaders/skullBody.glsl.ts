export const skullBodyVert = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vNormal   = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vUv       = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const skullBodyFrag = /* glsl */ `
  uniform float uTime;
  uniform float uDissolve;   // 1.0 = fully dissolved, 0.0 = visible
  uniform vec3  uHsv1;       // primary color  (H,S,V)
  uniform vec3  uHsv2;       // secondary color (H,S,V)
  uniform vec3  cameraPosition;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  // ---- HSV → RGB ----
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  // ---- 3-D Simplex Noise (IQ / Ashima) ----
  vec3 mod289v3(vec3 x) { return x - floor(x*(1.0/289.0))*289.0; }
  vec4 mod289v4(vec4 x) { return x - floor(x*(1.0/289.0))*289.0; }
  vec4 permute(vec4 x)  { return mod289v4(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

  float cnoise3(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289v3(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0,i1.z,i2.z,1.0))
      + i.y + vec4(0.0,i1.y,i2.y,1.0))
      + i.x + vec4(0.0,i1.x,i2.x,1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_*D.wyz - D.xzx;
    vec4 j = p - 49.0*floor(p*ns.z*ns.z);
    vec4 x_ = floor(j*ns.z);
    vec4 y_ = floor(j - 7.0*x_);
    vec4 xv = x_*ns.x + ns.yyyy;
    vec4 yv = y_*ns.x + ns.yyyy;
    vec4 h  = 1.0 - abs(xv) - abs(yv);
    vec4 b0 = vec4(xv.xy, yv.xy);
    vec4 b1 = vec4(xv.zw, yv.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,  h.x);
    vec3 p1 = vec3(a0.zw,  h.y);
    vec3 p2 = vec3(a1.xy,  h.z);
    vec3 p3 = vec3(a1.zw,  h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m*m;
    return 42.0*dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    // --- dissolution ---
    float noise2 = cnoise3(vPosition * 0.4) * 0.5
                 + cnoise3(vPosition * 6.0) * 0.5;
    float dissolveThreshold = uDissolve * 2.0 - noise2;
    if (dissolveThreshold > 0.4) discard;

    // dissolve edge glow
    float edge = smoothstep(0.4, 0.38, dissolveThreshold);

    // --- rim lighting ---
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
    rim = smoothstep(0.4, 1.0, rim);

    // --- color ---
    float noise1    = cnoise3(vNormal * 3.0 + uTime * 0.6);
    float fluctuation = noise1 * 0.15;
    vec3  hsv1mod  = uHsv1 + vec3(0.0, 0.0, fluctuation);
    vec3  col1     = hsv2rgb(clamp(hsv1mod, 0.0, 1.0));
    vec3  col2     = hsv2rgb(uHsv2);
    vec3  col      = mix(col1, col2, rim);

    // dissolve edge highlight
    col = mix(col, vec3(0.72, 0.64, 1.0), (1.0 - edge) * 0.6);

    gl_FragColor = vec4(col, 1.0);
  }
`;
