import React from "react";
import { TopoField, type TopoFieldProps } from "@/components/ui/topo-field";

export interface TopoBackgroundProps extends TopoFieldProps {
  children?: React.ReactNode;
}

export const TopoBackground: React.FC<TopoBackgroundProps> = ({
  background = "#fafafa",
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
  return (
    <div
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
          mouseX={-1000}
          mouseY={-1000}
          {...props}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default TopoBackground;
