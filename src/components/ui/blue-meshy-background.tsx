import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const palette = [
  [0.145, 0.388, 0.922], [0.18, 0.43, 0.94], [0.22, 0.47, 0.95], [0.27, 0.51, 0.96],
  [0.32, 0.55, 0.97], [0.37, 0.59, 0.98], [0.42, 0.63, 0.985], [0.47, 0.67, 0.99],
  [0.52, 0.71, 0.992], [0.57, 0.75, 0.995], [0.62, 0.78, 0.996], [0.67, 0.81, 0.997],
  [0.72, 0.84, 0.998], [0.77, 0.87, 0.999], [0.82, 0.9, 1.0], [0.87, 0.93, 1.0],
  [0.91, 0.95, 1.0], [0.94, 0.97, 1.0], [0.97, 0.985, 1.0], [1.0, 1.0, 1.0],
];

const vertexShaderSource = `#version 300 es
precision mediump float;
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;

const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uResolution;
uniform float uTime;
#define NUM_COLORS 20
vec3 seaColors[NUM_COLORS] = vec3[](
  ${palette.map((color) => `vec3(${color.join(", ")})`).join(",\n  ")}
);
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float noise2D(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m *= m; m *= m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.792843 - 0.853734 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 10; i++) {
    value += amplitude * noise2D(st * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}
void main() {
  vec2 uv = (gl_FragCoord.xy / uResolution.xy) * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  uv *= 0.3;
  float time = uTime * 0.25;
  float waveAmplitude = 0.2 + 0.15 * noise2D(vec2(time, 27.7));
  uv.x += waveAmplitude * sin(uv.y * 4.0 + time);
  uv.y += waveAmplitude * sin(uv.x * 4.0 - time);
  float radius = length(uv);
  float angle = atan(uv.y, uv.x);
  float swirlStrength = 1.2 * (1.0 - smoothstep(0.0, 1.0, radius));
  angle += swirlStrength * sin(uTime + radius * 5.0);
  uv = vec2(cos(angle), sin(angle)) * radius;
  float noiseValue = fbm(uv);
  noiseValue += 0.2 * sin(time + noiseValue * 3.0);
  noiseValue = 0.5 * (noiseValue + 1.0);
  float colorIndex = clamp(noiseValue, 0.0, 1.0) * float(NUM_COLORS - 1);
  int lowIndex = int(floor(colorIndex));
  int highIndex = int(min(float(lowIndex + 1), float(NUM_COLORS - 1)));
  vec3 color = mix(seaColors[lowIndex], seaColors[highIndex], fract(colorIndex));
  outColor = vec4(color, lowIndex == 0 && highIndex == 0 ? 0.0 : 1.0);
}`;

function createShaderProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertexShader = compile(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export default function BlueMeshyBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", { alpha: true });
    if (!canvas || !gl) return;

    const program = createShaderProgram(gl);
    if (!program) return;
    const vertexArray = gl.createVertexArray();
    const buffer = gl.createBuffer();
    if (!vertexArray || !buffer) return;

    gl.useProgram(program);
    gl.bindVertexArray(vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "uResolution");
    const time = gl.getUniformLocation(program, "uTime");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(1, 1, 1, 0);

    let animationFrame = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    const startTime = performance.now();
    const render = () => {
      animationFrame = requestAnimationFrame(render);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, (performance.now() - startTime) * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      {children}
    </div>
  );
}