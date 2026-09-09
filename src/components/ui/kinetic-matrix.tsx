'use client';

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatrixNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  col: number;
  row: number;
  radius: number;
  label: string;
  tension: number;
  pulsePhase: number;
}

interface SynapticPulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

interface GravitationalShockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  power: number;
}

export interface KineticMatrixProps {
  title?: string;
  className?: string;
}

export function KineticMatrix({
  title = "TOPOLOGY",
  className = "",
}: KineticMatrixProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isRunning, setIsRunning] = useState(true);

  const pointerRef = useRef({
    x: -2000,
    y: -2000,
    prevX: -2000,
    prevY: -2000,
    vx: 0,
    vy: 0,
    radius: 220,
    isDown: false,
  });
  const nodesRef = useRef<MatrixNode[]>([]);
  const pulsesRef = useRef<SynapticPulse[]>([]);
  const shockwavesRef = useRef<GravitationalShockwave[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0, cols: 0, rows: 0, spacing: 52 });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) => setIsDarkMode(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const buildLattice = useCallback((width: number, height: number) => {
    const spacing = 52;
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;
    const nodes: MatrixNode[] = [];

    for (let col = 0; col < cols; col += 1) {
      for (let row = 0; row < rows; row += 1) {
        const x = col * spacing;
        const y = row * spacing;
        nodes.push({
          x,
          y,
          vx: 0,
          vy: 0,
          baseX: x,
          baseY: y,
          col,
          row,
          radius: 1.4,
          label: `0x${((col * 17 + row * 31) % 256).toString(16).padStart(2, "0").toUpperCase()}`,
          tension: 0,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    dimensionsRef.current = { width, height, cols, rows, spacing };
    nodesRef.current = nodes;
    pulsesRef.current = [];
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!container || !canvas || !context) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildLattice(width, height);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [buildLattice]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return;

    let animationFrame = 0;
    let lastTime = performance.now();

    const drawLink = (
      first: MatrixNode,
      second: MatrixNode,
      spacing: number,
      isDark: boolean,
      nodeColor: string,
    ) => {
      const distance = Math.hypot(first.x - second.x, first.y - second.y);
      const stretch = Math.abs(distance - spacing) / spacing;
      const isTensioned = first.tension > 0.05 || second.tension > 0.05 || stretch > 0.1;
      if (isTensioned) {
        const glow = Math.max(first.tension, second.tension, stretch * 2);
        context.strokeStyle = isDark
          ? `rgba(255, 255, 255, ${Math.min(1, 0.25 + glow * 0.75)})`
          : `rgba(0, 0, 0, ${Math.min(1, 0.25 + glow * 0.75)})`;
        context.lineWidth = 0.8 + glow * 1.4;
      } else {
        context.strokeStyle = `rgba(${nodeColor}, ${isDark ? 0.08 : 0.05})`;
        context.lineWidth = 0.65;
      }
      context.beginPath();
      context.moveTo(first.x, first.y);
      context.lineTo(second.x, second.y);
      context.stroke();
    };

    const render = (now: number) => {
      const deltaTime = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;
      if (!isRunning) {
        animationFrame = requestAnimationFrame(render);
        return;
      }

      const { width, height, cols, rows, spacing } = dimensionsRef.current;
      const nodes = nodesRef.current;
      const pulses = pulsesRef.current;
      const shockwaves = shockwavesRef.current;
      const pointer = pointerRef.current;
      pointer.vx = (pointer.x - pointer.prevX) / (deltaTime * 1000 || 1);
      pointer.vy = (pointer.y - pointer.prevY) / (deltaTime * 1000 || 1);
      pointer.prevX = pointer.x;
      pointer.prevY = pointer.y;
      const mouseSpeed = Math.hypot(pointer.vx, pointer.vy);
      const isDark = document.documentElement.classList.contains("dark") || isDarkMode;
      const nodeColor = isDark ? "255, 255, 255" : "17, 24, 39";
      const accentColor = isDark ? "255, 255, 255" : "0, 0, 0";

      context.fillStyle = isDark ? "#06070a" : "#ffffff";
      context.fillRect(0, 0, width, height);

      for (let index = shockwaves.length - 1; index >= 0; index -= 1) {
        const shockwave = shockwaves[index];
        shockwave.radius += 400 * deltaTime;
        shockwave.power *= Math.pow(0.12, deltaTime);
        if (shockwave.radius > shockwave.maxRadius || shockwave.power < 0.01) shockwaves.splice(index, 1);
      }

      for (const node of nodes) {
        node.pulsePhase += deltaTime * 3.2;
        const dx = pointer.x - node.x;
        const dy = pointer.y - node.y;
        const distance = Math.hypot(dx, dy);
        if (distance < pointer.radius && distance > 0) {
          const ratio = 1 - distance / pointer.radius;
          const force = ratio * (1600 + mouseSpeed * 180 + (pointer.isDown ? 2400 : 0));
          const angle = Math.atan2(dy, dx);
          node.vx -= Math.cos(angle) * force * deltaTime;
          node.vy -= Math.sin(angle) * force * deltaTime;
          node.tension = Math.min(1, node.tension + ratio * 0.5);
        }
        for (const shockwave of shockwaves) {
          const shockwaveDistance = Math.hypot(node.x - shockwave.x, node.y - shockwave.y);
          const delta = Math.abs(shockwaveDistance - shockwave.radius);
          if (delta < 55) {
            const force = (1 - delta / 55) * shockwave.power * 2800;
            const angle = Math.atan2(node.y - shockwave.y, node.x - shockwave.x);
            node.vx += Math.cos(angle) * force * deltaTime;
            node.vy += Math.sin(angle) * force * deltaTime;
            node.tension = 1;
          }
        }
        node.vx += (node.baseX - node.x) * 26 * deltaTime;
        node.vy += (node.baseY - node.y) * 26 * deltaTime;
        node.vx *= 0.85;
        node.vy *= 0.85;
        node.x += node.vx * deltaTime * 60;
        node.y += node.vy * deltaTime * 60;
        node.tension = Math.max(0, node.tension - deltaTime * 0.9);
      }

      if (Math.random() < 0.3 && nodes.length > 0 && pulses.length < 40) {
        const fromNode = Math.floor(Math.random() * nodes.length);
        const source = nodes[fromNode];
        const directions = [{ col: 1, row: 0 }, { col: -1, row: 0 }, { col: 0, row: 1 }, { col: 0, row: -1 }];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const targetCol = source.col + direction.col;
        const targetRow = source.row + direction.row;
        if (targetCol >= 0 && targetCol < cols && targetRow >= 0 && targetRow < rows) {
          pulses.push({
            fromNode,
            toNode: targetCol * rows + targetRow,
            progress: 0,
            speed: 1.6 + Math.random() * 2.2,
          });
        }
      }

      for (let col = 0; col < cols; col += 1) {
        for (let row = 0; row < rows; row += 1) {
          const index = col * rows + row;
          const node = nodes[index];
          if (!node) continue;
          if (col < cols - 1) drawLink(node, nodes[(col + 1) * rows + row], spacing, isDark, nodeColor);
          if (row < rows - 1) drawLink(node, nodes[col * rows + row + 1], spacing, isDark, nodeColor);
        }
      }

      for (let index = pulses.length - 1; index >= 0; index -= 1) {
        const pulse = pulses[index];
        pulse.progress += deltaTime * pulse.speed;
        const first = nodes[pulse.fromNode];
        const second = nodes[pulse.toNode];
        if (!first || !second || pulse.progress >= 1) {
          if (second) second.tension = Math.min(1, second.tension + 0.35);
          pulses.splice(index, 1);
          continue;
        }
        context.fillStyle = isDark ? "#ffffff" : "#000000";
        context.beginPath();
        context.arc(first.x + (second.x - first.x) * pulse.progress, first.y + (second.y - first.y) * pulse.progress, 2, 0, Math.PI * 2);
        context.fill();
      }

      for (const node of nodes) {
        const distance = Math.hypot(pointer.x - node.x, pointer.y - node.y);
        const isNear = distance < pointer.radius;
        const radius = isNear ? node.radius * 2.2 + node.tension * 1.5 : node.radius + Math.sin(node.pulsePhase) * 0.25;
        if (isNear || node.tension > 0.1) {
          context.fillStyle = `rgba(${accentColor}, ${Math.min(1, 0.25 + node.tension * 0.65)})`;
          context.beginPath();
          context.arc(node.x, node.y, radius * 2.2, 0, Math.PI * 2);
          context.fill();
        }
        context.fillStyle = isNear || node.tension > 0.1 ? (isDark ? "#ffffff" : "#000000") : `rgba(${nodeColor}, ${isDark ? 0.28 : 0.2})`;
        context.beginPath();
        context.arc(node.x, node.y, Math.max(0.8, radius), 0, Math.PI * 2);
        context.fill();
        if (distance < 90) {
          const radarRing = ((node.pulsePhase * 20) % 32) + 4;
          context.strokeStyle = `rgba(${accentColor}, ${(1 - radarRing / 36) * 0.35})`;
          context.lineWidth = 1;
          context.beginPath();
          context.arc(node.x, node.y, radarRing, 0, Math.PI * 2);
          context.stroke();
          context.font = "8px ui-monospace, SFMono-Regular, Consolas, monospace";
          context.fillStyle = `rgba(${accentColor}, 0.85)`;
          context.fillText(node.label, node.x + 9, node.y - 9);
        }
      }

      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame);
  }, [isDarkMode, isRunning]);

  const getPointerPosition = (event: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const handlePointerMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const position = getPointerPosition(event);
    if (position) Object.assign(pointerRef.current, position);
  };

  const handlePointerDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const position = getPointerPosition(event);
    if (!position) return;
    pointerRef.current.isDown = true;
    shockwavesRef.current.push({ ...position, radius: 8, maxRadius: 420, power: 1.2 });
  };

  const triggerCentralImpulse = () => {
    const { width, height } = dimensionsRef.current;
    shockwavesRef.current.push({
      x: width / 2,
      y: height / 2,
      radius: 10,
      maxRadius: Math.max(width, height) * 0.85,
      power: 1.4,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onMouseDown={handlePointerDown}
      onMouseUp={() => { pointerRef.current.isDown = false; }}
      onMouseLeave={() => { pointerRef.current.x = -2000; pointerRef.current.y = -2000; pointerRef.current.isDown = false; }}
      className={cn("group relative flex h-full w-full select-none flex-col justify-between overflow-hidden bg-neutral-50 transition-colors duration-700 dark:bg-[#06070a]", className)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full cursor-crosshair" />
      <div className="relative z-20 flex h-full w-full flex-col justify-between p-6 md:p-10">
        <header className="flex w-full items-center justify-between font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <button onClick={triggerCentralImpulse} className="flex items-center gap-1.5 rounded-lg border border-neutral-300/80 bg-white/70 px-2.5 py-1.5 backdrop-blur-md transition-all hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:bg-neutral-800" title="Trigger shockwave" aria-label="Trigger shockwave">
              <Sparkles className="size-3 text-neutral-800 dark:text-neutral-200" />
              <span className="hidden sm:inline font-mono text-[10px]">PULSE</span>
            </button>
            <button onClick={() => setIsRunning((previous) => !previous)} className="flex items-center gap-1.5 rounded-lg border border-neutral-300/80 bg-white/70 px-2.5 py-1.5 backdrop-blur-md transition-all hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:bg-neutral-800" aria-label={isRunning ? "Pause animation" : "Resume animation"}>
              {isRunning ? <Pause className="size-3" /> : <Play className="size-3" />}
              <span className="font-mono text-[10px]">{isRunning ? "FREEZE" : "RUN"}</span>
            </button>
          </div>
        </header>
        <main className="pointer-events-none flex flex-col items-center justify-center text-center">
          <h1 className="font-mono text-5xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white sm:text-7xl md:text-9xl">{title}</h1>
        </main>
        <div />
      </div>
    </div>
  );
}

export default KineticMatrix;
