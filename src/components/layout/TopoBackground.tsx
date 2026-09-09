import React, { useState, useRef } from "react";
import { TopoField, type TopoFieldProps } from "@/components/ui/topo-field";

export interface TopoBackgroundProps extends TopoFieldProps {
  children?: React.ReactNode;
}

export const TopoBackground: React.FC<TopoBackgroundProps> = ({
  background = "#FAFAF8",
  lineColor = "#111827",
  lineOpacity = 0.28,
  speed = 0.8,
  length = 1.0,
  density = 1.0,
  opacity = 1,
  className = "",
  children,
  ...props
}) => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    if (!isHovered) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden bg-bg-base ${className}`}
    >
      {/* WebGL Shader TopoField background with live mouse coordinates */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
        <TopoField
          background={background}
          lineColor={lineColor}
          lineOpacity={lineOpacity}
          speed={speed}
          length={length}
          density={density}
          opacity={opacity}
          mouseX={isHovered ? mousePos.x : -1000}
          mouseY={isHovered ? mousePos.y : -1000}
          {...props}
        />
      </div>

      {/* Interactive hover spotlight aura overlay following mouse position */}
      <div
        className="pointer-events-none absolute inset-0 z-1 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(232, 130, 60, 0.15), transparent 75%)`,
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default TopoBackground;
