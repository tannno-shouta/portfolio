export const workImageVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const workImageFrag = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uHover;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    float strength = uHover * 0.018;
    float wave = sin(vUv.y * 18.0 + uTime * 3.0) * strength;

    // RGB split
    float r = texture2D(uTexture, vUv + vec2(strength + wave, 0.0)).r;
    float g = texture2D(uTexture, vUv).g;
    float b = texture2D(uTexture, vUv - vec2(strength + wave, 0.0)).b;
    float a = texture2D(uTexture, vUv).a;

    gl_FragColor = vec4(r, g, b, a);
  }
`;
