import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface RobotSequenceProps {
  totalFrames?: number;
  frameInterval?: number;
  className?: string;
  maxHeight?: string;
  folderPath?: string;
  frames?: string[];
}

interface Satellite {
  mesh: THREE.Mesh;
  radius: number;
  speed: number;
  offset: number;
  tilt: number;
}

const fibonacciSphere = (samples: number): THREE.Vector3[] => {
  const points: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let index = 0; index < samples; index += 1) {
    const y = 1 - (index / (samples - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * index;
    points.push(new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius));
  }

  return points;
};

const makeRing = (radius: number, color: number, opacity: number, tiltX: number, tiltZ: number) => {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0.008, 8, 128),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
  );
  ring.rotation.x = tiltX;
  ring.rotation.z = tiltZ;
  return ring;
};

export const RobotSequence: React.FC<RobotSequenceProps> = ({
  className = "",
  maxHeight = "760px",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 9);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.display = "block";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.zIndex = "10";
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const colorA = new THREE.Color(0x2f6bff);
    const colorB = new THREE.Color(0x17c3c3);

    const coreGeometry = new THREE.IcosahedronGeometry(2.15, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: colorA,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    const shellGeometry = new THREE.IcosahedronGeometry(2.05, 1);
    const shellMaterial = new THREE.MeshPhongMaterial({
      color: 0x0e2a6b,
      transparent: true,
      opacity: 0.12,
      shininess: 80,
      specular: 0x88aaff,
    });
    group.add(new THREE.Mesh(shellGeometry, shellMaterial));

    const pointLight = new THREE.PointLight(0x5588ff, 1.2, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight, new THREE.AmbientLight(0x334466, 0.8));

    const nodeCount = 260;
    const nodePositions = fibonacciSphere(nodeCount).map((point) =>
      point.multiplyScalar(3.35 * (1 + (Math.random() - 0.5) * 0.06))
    );
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);
    nodePositions.forEach((point, index) => {
      positions.set([point.x, point.y, point.z], index * 3);
      const mixed = colorA.clone().lerp(colorB, Math.random());
      colors.set([mixed.r, mixed.g, mixed.b], index * 3);
    });

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    nodeGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const nodeMaterial = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Points(nodeGeometry, nodeMaterial));

    const lineVertices: number[] = [];
    for (let first = 0; first < nodeCount; first += 1) {
      let connections = 0;
      for (let second = first + 1; second < nodeCount && connections < 3; second += 1) {
        if (nodePositions[first].distanceTo(nodePositions[second]) < 1.35 && Math.random() > 0.55) {
          lineVertices.push(...nodePositions[first].toArray(), ...nodePositions[second].toArray());
          connections += 1;
        }
      }
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lineVertices), 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: colorA, transparent: true, opacity: 0.14 });
    group.add(new THREE.LineSegments(lineGeometry, lineMaterial));

    const ringA = makeRing(3.9, colorB.getHex(), 0.35, Math.PI / 2.3, 0.4);
    const ringB = makeRing(4.25, colorA.getHex(), 0.22, Math.PI / 2.7, -0.6);
    group.add(ringA, ringB);

    const satellites: Satellite[] = [];
    for (let index = 0; index < 6; index += 1) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 12, 12),
        new THREE.MeshBasicMaterial({ color: index % 2 === 0 ? colorB : colorA })
      );
      scene.add(mesh);
      satellites.push({
        mesh,
        radius: 3.9 + Math.random() * 0.4,
        speed: 0.25 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
        tilt: (Math.random() - 0.5) * 1.2,
      });
    }

    let targetRotX = 0;
    let targetRotY = 0;
    let userRotX = 0;
    let userRotY = 0;
    let autoSpin = 0;
    let pointerDown = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetRotY = (((event.clientX - rect.left) / rect.width) * 2 - 1) * 0.5;
      targetRotX = (((event.clientY - rect.top) / rect.height) * 2 - 1) * 0.3;
      if (!pointerDown) return;
      userRotY += (event.clientX - lastX) * 0.005;
      userRotX += (event.clientY - lastY) * 0.005;
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const onPointerDown = (event: PointerEvent) => {
      pointerDown = true;
      lastX = event.clientX;
      lastY = event.clientY;
      container.setPointerCapture(event.pointerId);
    };
    const onPointerUp = () => {
      pointerDown = false;
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + event.deltaY * 0.003, 6, 14);
    };
    const onResize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);
    onResize();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();
    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      if (!reducedMotion) {
        autoSpin += 0.0022;
        group.rotation.x += (targetRotX + userRotX - group.rotation.x) * 0.04;
        group.rotation.y += (autoSpin + targetRotY + userRotY - group.rotation.y) * 0.06;
        core.rotation.y = elapsed * 0.15;
        core.rotation.x = Math.sin(elapsed * 0.2) * 0.08;
        ringA.rotation.z += 0.0016;
        ringB.rotation.z -= 0.0011;
        group.position.y = Math.sin(elapsed * 0.6) * 0.08;
        nodeMaterial.opacity = 0.85 + Math.sin(elapsed * 1.4) * 0.08;
        satellites.forEach((satellite) => {
          const angle = elapsed * satellite.speed + satellite.offset;
          satellite.mesh.position.set(
            Math.cos(angle) * satellite.radius,
            Math.sin(angle * 0.7) * satellite.radius * 0.3 * satellite.tilt + Math.sin(angle) * 0.3,
            Math.sin(angle) * satellite.radius
          );
        });
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("wheel", onWheel);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Points) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-label="Animated technology node globe"
      role="img"
      className={`relative flex min-h-[320px] items-end justify-center overflow-visible select-none ${className}`}
      style={{ maxHeight: maxHeight === "none" ? undefined : maxHeight, touchAction: "none" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
      />
    </div>
  );
};