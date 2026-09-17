import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = new URL('../assets/turtle-shells.glb', import.meta.url).href;

// measured from the exported model: center ~(0, 1.21, 0), max extent ~2.77 (the
// most-stretched shell's long axis)
const TARGET = new THREE.Vector3(0, 1.21, 0);

// index 0 = base shape (least stretched) -> fastest
// index 2 = most stretched shape -> slowest
const SPEEDS = [0.55, 0.3, 0.15];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function Scene() {
  const { scene } = useGLTF(MODEL_URL);
  const reducedMotion = useReducedMotion();
  const refs = useRef([]);
  const { camera } = useThree();

  const meshes = useMemo(() => {
    const list = [];
    scene.traverse((obj) => {
      if (obj.isMesh) list.push(obj);
    });
    return list;
  }, [scene]);

  useEffect(() => {
    camera.position.set(3.2, 2.2, 4.2);
    camera.lookAt(TARGET);
  }, [camera]);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    refs.current.forEach((mesh, i) => {
      if (mesh) mesh.rotation.y += (SPEEDS[i] ?? 0.2) * delta;
    });
  });

  return (
    <group>
      {meshes.map((mesh, i) => (
        <mesh
          key={mesh.uuid}
          ref={(el) => (refs.current[i] = el)}
          geometry={mesh.geometry}
          position={mesh.position}
          scale={mesh.scale}
          rotation={mesh.rotation}
        >
          <meshStandardMaterial
            color="#ff2b1f"
            emissive="#4a0a05"
            emissiveIntensity={0.5}
            roughness={0.32}
            metalness={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function TurtleShellsLogo({ className = '', onReady }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ fov: 30 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
        onCreated={() => onReady?.()}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 2]} intensity={2} />
        <directionalLight position={[-3, -1, -2]} intensity={0.5} />
        <Scene />
      </Canvas>
    </div>
  );
}
