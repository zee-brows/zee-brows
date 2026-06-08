"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

function useLogoCells(src, columns, rows) {
  const [cells, setCells] = useState([]);

  useEffect(() => {
    let active = true;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = columns;
      canvas.height = rows;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.clearRect(0, 0, columns, rows);
      ctx.drawImage(image, 0, 0, columns, rows);
      const pixels = ctx.getImageData(0, 0, columns, rows).data;
      const next = [];

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
          const alpha = pixels[(y * columns + x) * 4 + 3];
          if (alpha > 74) {
            const neighbors = [
              y > 0 ? pixels[((y - 1) * columns + x) * 4 + 3] : 0,
              y < rows - 1 ? pixels[((y + 1) * columns + x) * 4 + 3] : 0,
              x > 0 ? pixels[(y * columns + x - 1) * 4 + 3] : 0,
              x < columns - 1 ? pixels[(y * columns + x + 1) * 4 + 3] : 0
            ];
            const edge = neighbors.some((value) => value < 62);
            if (alpha > 150 || edge) next.push({ x, y, alpha: alpha / 255, edge });
          }
        }
      }

      if (active) setCells(next);
    };
    image.src = src;
    return () => {
      active = false;
    };
  }, [src, columns, rows]);

  return cells;
}

function ReflectionTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#030303");
    gradient.addColorStop(0.23, "#151515");
    gradient.addColorStop(0.34, "#3a0608");
    gradient.addColorStop(0.46, "#090909");
    gradient.addColorStop(0.58, "#8b7352");
    gradient.addColorStop(0.68, "#121212");
    gradient.addColorStop(1, "#000000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(68, 0, 20, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(320, 0, 52, canvas.height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  }, []);
}

function LogoSculpture({ src, pointer, reduced }) {
  const group = useRef(null);
  const face = useRef(null);
  const relief = useRef(null);
  const texture = useLoader(THREE.TextureLoader, src);
  const reflection = ReflectionTexture();
  const { viewport } = useThree();
  const isMobile = viewport.width < 6.2;
  const size = isMobile ? 3.34 : 4.62;
  const width = size * 0.67;
  const height = size;
  const columns = isMobile ? 44 : 58;
  const rows = isMobile ? 66 : 88;
  const cells = useLogoCells(src, columns, rows);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  const depthLayers = useMemo(() => Array.from({ length: isMobile ? 12 : 24 }), [isMobile]);
  const reliefGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  useEffect(() => () => reliefGeometry.dispose(), [reliefGeometry]);

  useEffect(() => {
    if (!relief.current || !cells.length) return;
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    const cellW = width / columns;
    const cellH = height / rows;

    cells.forEach((cell, index) => {
      const px = (cell.x / (columns - 1) - 0.5) * width;
      const py = -(cell.y / (rows - 1) - 0.5) * height;
      const sx = cellW * 1.08;
      const sy = cellH * 1.08;
      const sz = cell.edge ? 0.18 : 0.28 + cell.alpha * 0.16;
      matrix.compose(
        new THREE.Vector3(px, py, 0.06 + sz * 0.5),
        new THREE.Quaternion(),
        new THREE.Vector3(sx, sy, sz)
      );
      relief.current.setMatrixAt(index, matrix);
      color.set(cell.edge ? "#8a693c" : cell.alpha > 0.78 ? "#1b0809" : "#0e0e0e");
      relief.current.setColorAt(index, color);
    });

    relief.current.count = cells.length;
    relief.current.instanceMatrix.needsUpdate = true;
    if (relief.current.instanceColor) relief.current.instanceColor.needsUpdate = true;
  }, [cells, columns, height, rows, width]);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const object = group.current;
    if (!object) return;

    const idle = reduced ? 0.32 : elapsed * (isMobile ? 0.18 : 0.24);
    const targetY = idle + pointer.current.x * (isMobile ? 0.18 : 0.72);
    const targetX = -0.08 + pointer.current.y * (isMobile ? 0.06 : 0.28);
    const targetZ = pointer.current.x * -0.04;

    object.rotation.y = THREE.MathUtils.damp(object.rotation.y, targetY, 3.6, delta);
    object.rotation.x = THREE.MathUtils.damp(object.rotation.x, targetX, 3.4, delta);
    object.rotation.z = THREE.MathUtils.damp(object.rotation.z, targetZ, 3.2, delta);
    object.position.y = reduced ? 0 : Math.sin(elapsed * 0.85) * 0.075;
    object.position.x = THREE.MathUtils.damp(object.position.x, pointer.current.x * 0.08, 2.6, delta);

    if (face.current?.map) {
      face.current.map.offset.x = (Math.sin(elapsed * 0.42) + pointer.current.x * 0.55) * 0.04;
      face.current.map.offset.y = (Math.cos(elapsed * 0.34) + pointer.current.y * 0.4) * 0.025;
    }
  });

  return (
    <group ref={group} scale={isMobile ? 0.92 : 1}>
      <mesh position={[0, -0.03, -0.34]} rotation={[0, 0, 0]}>
        <boxGeometry args={[width * 1.08, height * 1.045, 0.22, 8, 8, 1]} />
        <meshPhysicalMaterial color="#050505" metalness={0.92} roughness={0.22} clearcoat={1} clearcoatRoughness={0.18} reflectivity={1} />
      </mesh>
      <mesh position={[0.025, -0.035, -0.205]}>
        <planeGeometry args={[width * 1.04, height * 1.02, 1, 1]} />
        <meshPhysicalMaterial
          alphaMap={texture}
          transparent
          color="#070707"
          metalness={0.98}
          roughness={0.2}
          clearcoat={0.9}
          clearcoatRoughness={0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {depthLayers.map((_, index) => {
        const z = -0.016 * (index + 1);
        const shade = index / Math.max(depthLayers.length - 1, 1);
        return (
          <mesh position={[index * 0.0025, index * -0.001, z]} scale={[1 + shade * 0.018, 1 + shade * 0.018, 1]} key={index}>
            <planeGeometry args={[width, height, 1, 1]} />
            <meshPhysicalMaterial
              alphaMap={texture}
              transparent
              color={shade > 0.82 ? "#7a5b33" : new THREE.Color().setHSL(0, 0, 0.045 + shade * 0.04)}
              metalness={0.96}
              roughness={0.18 + shade * 0.12}
              clearcoat={0.9}
              clearcoatRoughness={0.22}
              reflectivity={0.72}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        );
      })}
      {cells.length ? (
        <instancedMesh ref={relief} args={[reliefGeometry, undefined, cells.length]} frustumCulled={false}>
          <meshPhysicalMaterial
            vertexColors
            metalness={0.98}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.16}
            reflectivity={1}
          />
        </instancedMesh>
      ) : null}
      <mesh position={[0, 0, 0.49]}>
        <planeGeometry args={[width, height, 1, 1]} />
        <meshPhysicalMaterial
          ref={face}
          map={reflection}
          alphaMap={texture}
          transparent
          color="#111111"
          metalness={1}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.12}
          reflectivity={1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0.055, 0.025, 0.515]}>
        <planeGeometry args={[width * 1.006, height * 1.006, 1, 1]} />
        <meshPhysicalMaterial
          alphaMap={texture}
          transparent
          color="#8e6c3f"
          metalness={1}
          roughness={0.14}
          clearcoat={1}
          clearcoatRoughness={0.12}
          side={THREE.DoubleSide}
          opacity={0.32}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Showroom({ pointer }) {
  const lightRig = useRef(null);
  const floor = useRef(null);

  useFrame((state, delta) => {
    if (lightRig.current) {
      lightRig.current.rotation.y = THREE.MathUtils.damp(lightRig.current.rotation.y, pointer.current.x * 0.24, 2.4, delta);
      lightRig.current.position.x = THREE.MathUtils.damp(lightRig.current.position.x, pointer.current.x * 0.32, 2.2, delta);
    }
    if (floor.current) floor.current.material.opacity = 0.42 + Math.sin(state.clock.elapsedTime * 0.5) * 0.035;
  });

  return (
    <>
      <color attach="background" args={["#030303"]} />
      <fog attach="fog" args={["#030303", 8, 17]} />
      <ambientLight intensity={0.34} />
      <group ref={lightRig}>
        <rectAreaLight width={5.2} height={2.4} intensity={2.8} color="#ffffff" position={[0, 2.3, 3.1]} rotation={[-0.6, 0, 0]} />
        <rectAreaLight width={1.8} height={5.4} intensity={2.1} color="#4a4a4a" position={[-3.2, 0.6, 1.7]} rotation={[0, 0.75, 0]} />
        <rectAreaLight width={1.4} height={4.2} intensity={1.1} color="#7b1115" position={[3.1, 0.3, 2.2]} rotation={[0, -0.8, 0]} />
        <spotLight intensity={2.2} angle={0.28} penumbra={0.72} color="#d5c6a8" position={[0.8, 3.2, 3.6]} />
      </group>
      <mesh ref={floor} position={[0, -2.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshPhysicalMaterial color="#050505" metalness={0.72} roughness={0.24} clearcoat={0.82} clearcoatRoughness={0.32} transparent opacity={0.46} />
      </mesh>
      <mesh position={[0, -2.33, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.35, 2.9, 96]} />
        <meshBasicMaterial color="#1f1f1f" transparent opacity={0.36} />
      </mesh>
      <mesh position={[0, -2.32, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.18, 96]} />
        <meshBasicMaterial color="#080808" transparent opacity={0.72} />
      </mesh>
      <mesh position={[0, 0.15, -2.6]}>
        <planeGeometry args={[7.4, 4.8]} />
        <meshPhysicalMaterial color="#070707" metalness={0.5} roughness={0.42} clearcoat={0.45} />
      </mesh>
    </>
  );
}

function CameraMotion({ pointer }) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.current.x * 0.34, 2.3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.05 + pointer.current.y * 0.12, 2.3, delta);
    camera.lookAt(0, -0.08, 0);
  });

  return null;
}

function HeroScene({ src, pointer, reduced }) {
  return (
    <>
      <Showroom pointer={pointer} />
      <LogoSculpture src={src} pointer={pointer} reduced={reduced} />
      <CameraMotion pointer={pointer} />
    </>
  );
}

export default function HeroLogo3D({ src = "/assets/zee-brows-official-logo-cutout.webp" }) {
  const pointer = useRef({ x: 0, y: 0 });
  const [reduced, setReduced] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    const update = () => {
      setReduced(motionQuery.matches);
      setCoarse(pointerQuery.matches);
    };
    update();
    motionQuery.addEventListener?.("change", update);
    pointerQuery.addEventListener?.("change", update);
    return () => {
      motionQuery.removeEventListener?.("change", update);
      pointerQuery.removeEventListener?.("change", update);
    };
  }, []);

  const onPointerMove = (event) => {
    if (reduced || coarse) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.current.y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  const onPointerLeave = () => {
    pointer.current.x = 0;
    pointer.current.y = 0;
  };

  return (
    <div className="hero-logo-3d hero-logo-showroom" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.1, 6.4], fov: 34, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        performance={{ min: 0.55 }}
      >
        <Suspense fallback={null}>
          <HeroScene src={src} pointer={pointer} reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}
