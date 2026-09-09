import { useEffect, useMemo, useRef, type CSSProperties } from "react";

/**
 * TopoField — an isolated, full-bleed animated WebGL background: a soft grid plus ultra-thin
 * contour ("topographic") lines drawn from 2D simplex noise, drifting slowly over time.
 *
 * Background and line colors are fully customizable (defaults to a white background with
 * near-black lines) and update live without reloading the underlying document. Speed, opacity,
 * and colors are pushed in via postMessage so changing a slider never causes a flicker/reload;
 * only `length` and `density` rebuild the field, since they change the noise math itself.
 *
 * Ships as a sandboxed iframe so the shader's script/canvas loop stays completely self-contained
 * from the host page.
 */

const topoFieldSource = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Topo Field</title>
</head>
<body style="margin:0;padding:0;overflow:hidden;background:__BG__;">
<canvas id="topo-canvas" style="display:block;width:100%;height:100%;"></canvas>
__BOOTSTRAP__
<script>
(function () {
  var canvas = document.getElementById('topo-canvas');
  var gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false });
  if (!gl) return;

  var vsSource = [
    'attribute vec2 a_position;',
    'void main() { gl_Position = vec4(a_position, 0.0, 1.0); }'
  ].join('\\n');

  var fsSource = [
    'precision highp float;',
    'uniform vec2 u_resolution;',
    'uniform vec2 u_mouse;',
    'uniform float u_time;',
    'uniform float u_dpr;',
    'uniform float u_noiseScale;',
    'uniform float u_numBands;',
    'uniform vec3 u_bgColor;',
    'uniform vec3 u_lineColor;',
    'uniform float u_lineOpacity;',
    '',
    'vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }',
    'float snoise(vec2 v){',
    '  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);',
    '  vec2 i  = floor(v + dot(v, C.yy));',
    '  vec2 x0 = v - i + dot(i, C.xx);',
    '  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);',
    '  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;',
    '  i = mod(i, 289.0);',
    '  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));',
    '  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);',
    '  m = m*m; m = m*m;',
    '  vec3 x = 2.0 * fract(p * C.www) - 1.0;',
    '  vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5);',
    '  vec3 a0 = x - ox; m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);',
    '  vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;',
    '  return 130.0 * dot(m, g);',
    '}',
    '',
    'void main() {',
    '  vec2 st = gl_FragCoord.xy / u_resolution.xy;',
    '  st.x *= u_resolution.x / u_resolution.y;',
    '',
    '  float gridSize = 48.0 * u_dpr;',
    '  vec2 gridSt = gl_FragCoord.xy / gridSize;',
    '  vec2 gridFract = fract(gridSt);',
    '  float lineThickness = 1.0 / gridSize;',
    '  float gridLines = step(1.0 - lineThickness, gridFract.x) + step(1.0 - lineThickness, gridFract.y);',
    '  gridLines = clamp(gridLines, 0.0, 1.0) * 0.5;',
    '',
    '  vec2 noisePos = st * u_noiseScale + vec2(u_time * 0.015, u_time * 0.025);',
    '  float n = snoise(noisePos) * 0.5 + 0.5;',
    '  float bandVal = n * u_numBands;',
    '  float triangleWave = abs(fract(bandVal) - 0.5) * 2.0;',
    '  float topoLines = smoothstep(0.03, 0.0, triangleWave) * 0.9;',
    '',
    '  float distToMouse = length(gl_FragCoord.xy - u_mouse);',
    '  float mouseEffect = smoothstep(360.0 * u_dpr, 0.0, distToMouse);',
    '',
    '  float lines = clamp(gridLines + topoLines + mouseEffect * 0.35, 0.0, 1.0) * u_lineOpacity;',
    '  vec3 targetLineColor = mix(u_lineColor, vec3(0.91, 0.51, 0.235), mouseEffect * 0.75);',
    '  vec3 color = mix(u_bgColor, targetLineColor, lines);',
    '  gl_FragColor = vec4(color, 1.0);',
    '}'
  ].join('\\n');

  function createShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  var vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
  var fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  var u = {
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    mouse: gl.getUniformLocation(program, 'u_mouse'),
    time: gl.getUniformLocation(program, 'u_time'),
    dpr: gl.getUniformLocation(program, 'u_dpr'),
    noiseScale: gl.getUniformLocation(program, 'u_noiseScale'),
    numBands: gl.getUniformLocation(program, 'u_numBands'),
    bgColor: gl.getUniformLocation(program, 'u_bgColor'),
    lineColor: gl.getUniformLocation(program, 'u_lineColor'),
    lineOpacity: gl.getUniformLocation(program, 'u_lineOpacity')
  };

  var controls = window.__TOPO_INITIAL__ || {
    speed: 1, opacity: 1, length: 1, density: 1,
    bg: [1, 1, 1], line: [0.067, 0.094, 0.153], lineOpacity: 0.7, mouseX: -1000, mouseY: -1000
  };

  function applyUniforms() {
    gl.uniform1f(u.noiseScale, 1.4 * controls.length);
    gl.uniform1f(u.numBands, 10.0 * controls.density);
    gl.uniform3f(u.bgColor, controls.bg[0], controls.bg[1], controls.bg[2]);
    gl.uniform3f(u.lineColor, controls.line[0], controls.line[1], controls.line[2]);
    gl.uniform1f(u.lineOpacity, controls.lineOpacity);
    var dpr = window.devicePixelRatio || 1;
    gl.uniform2f(u.mouse, (controls.mouseX || -1000) * dpr, (canvas.height - (controls.mouseY || -1000) * dpr));
    canvas.style.opacity = String(controls.opacity == null ? 1 : controls.opacity);
  }

  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'topo-controls') return;
    var next = event.data.controls || {};
    Object.keys(next).forEach(function (key) { controls[key] = next[key]; });
    applyUniforms();
  });

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.resolution, canvas.width, canvas.height);
    gl.uniform1f(u.dpr, dpr);
  }
  window.addEventListener('resize', resize);
  resize();
  applyUniforms();

  var last = performance.now();
  var virtual = 0;
  function render(now) {
    virtual += (now - last) * (controls.speed || 1);
    last = now;
    gl.uniform1f(u.time, virtual * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();
</script>
</body>
</html>`;

export type TopoFieldProps = {
  /** CSS color for the background, e.g. "#ffffff". */
  background?: string;
  /** CSS color for the grid + contour lines, e.g. "#111827". */
  lineColor?: string;
  /** Strength of the lines against the background, 0–1. */
  lineOpacity?: number;
  /** Animation speed multiplier. */
  speed?: number;
  /** Stretches/compresses the noise field driving the contour bands. */
  length?: number;
  /** Multiplies the number of contour bands (visual density of lines). */
  density?: number;
  /** Overall opacity of the whole field. */
  opacity?: number;
  /** CSS filter hue-rotate in degrees, applied on top of the flat colors above. */
  hue?: number;
  /** CSS filter saturation multiplier. */
  saturation?: number;
  /** CSS filter brightness multiplier. */
  brightness?: number;
  /** Mouse cursor X coordinate for interactive hover glow. */
  mouseX?: number;
  /** Mouse cursor Y coordinate for interactive hover glow. */
  mouseY?: number;
  className?: string;
  style?: CSSProperties;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** "#fff" / "#ffffff" -> [r, g, b] in 0–1. Falls back to black on anything it can't parse. */
function hexToVec3(hex: string): [number, number, number] {
  let clean = hex.trim().replace(/^#/, "");
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = Number.parseInt(clean, 16);
  const safe = Number.isNaN(int) ? 0 : int;
  return [((safe >> 16) & 255) / 255, ((safe >> 8) & 255) / 255, (safe & 255) / 255];
}

function buildDocument(initial: {
  background: string;
  lineColor: string;
  lineOpacity: number;
  speed: number;
  opacity: number;
  length: number;
  density: number;
}) {
  const bootstrap = `<script>window.__TOPO_INITIAL__=${JSON.stringify({
    bg: hexToVec3(initial.background),
    line: hexToVec3(initial.lineColor),
    lineOpacity: initial.lineOpacity,
    speed: initial.speed,
    opacity: initial.opacity,
    length: initial.length,
    density: initial.density,
  }).replace(/</g, "\\u003c")};</script>`;

  return topoFieldSource.replace("__BG__", initial.background).replace("__BOOTSTRAP__", bootstrap);
}

export function TopoField({
  background = "#FAFAF8",
  lineColor = "#111827",
  lineOpacity = 0.35,
  speed = 0.8,
  length = 1.1,
  density = 1.0,
  opacity = 1,
  hue = 0,
  saturation = 1,
  brightness = 1,
  mouseX = -1000,
  mouseY = -1000,
  className,
  style,
}: TopoFieldProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const safeSpeed = clamp(speed, 0, 3);
  const safeLength = clamp(length, 0.35, 2.5);
  const safeDensity = clamp(density, 0.25, 2.5);
  const safeOpacity = clamp(opacity, 0.05, 1);
  const safeLineOpacity = clamp(lineOpacity, 0, 1);
  const safeHue = clamp(hue, -180, 180);
  const safeSaturation = clamp(saturation, 0, 2);
  const safeBrightness = clamp(brightness, 0.35, 1.65);

  // Baked once on mount so the very first frame already has the right colors/geometry.
  // Rebuilt only if length/density change, since those alter the noise math itself.
  const source = useMemo(
    () =>
      buildDocument({
        background,
        lineColor,
        lineOpacity: safeLineOpacity,
        speed: safeSpeed,
        opacity: safeOpacity,
        length: safeLength,
        density: safeDensity,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [safeLength, safeDensity],
  );

  // Colors, speed, opacity, and mouse coordinates stay live via postMessage.
  useEffect(() => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame) return;
    frame.postMessage(
      {
        type: "topo-controls",
        controls: {
          bg: hexToVec3(background),
          line: hexToVec3(lineColor),
          lineOpacity: safeLineOpacity,
          speed: safeSpeed,
          opacity: safeOpacity,
          mouseX,
          mouseY,
        },
      },
      "*",
    );
  }, [background, lineColor, safeLineOpacity, safeSpeed, safeOpacity, mouseX, mouseY, source]);

  const filter =
    safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
      ? undefined
      : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

  return (
    <iframe
      ref={iframeRef}
      className={className}
      title="Topo Field"
      srcDoc={source}
      sandbox="allow-scripts"
      loading="eager"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        border: 0,
        background,
        filter,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

export default TopoField;
