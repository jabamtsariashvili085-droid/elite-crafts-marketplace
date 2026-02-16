import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

const GraniteBlock = ({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    ref.current.rotation.y += 0.003;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={position} scale={scale}>
        <boxGeometry args={[1.8, 0.3, 1.2]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.3}
          metalness={0.6}
          distort={0.15}
          speed={2}
        />
      </mesh>
    </Float>
  );
};

const FurniturePiece = ({ position, scale }: { position: [number, number, number]; scale: number }) => {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3 + Math.PI * 0.15;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={ref} position={position} scale={scale}>
        {/* Table top */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.6, 0.1, 0.9]} />
          <meshStandardMaterial color="#8B6914" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Legs */}
        {[[-0.65, 0, -0.35], [0.65, 0, -0.35], [-0.65, 0, 0.35], [0.65, 0, 0.35]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
            <meshStandardMaterial color="#6B4F12" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

const GoldSphere = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.3;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <MeshWobbleMaterial
        color="#D4AF37"
        factor={0.3}
        speed={1.5}
        roughness={0.2}
        metalness={0.9}
      />
    </mesh>
  );
};

const Particles = () => {
  const count = 60;
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#D4AF37" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#fff5e0" />
      <pointLight position={[-3, 2, -2]} intensity={0.5} color="#D4AF37" />

      {/* Granite slabs */}
      <GraniteBlock position={[-2.2, 0.5, -1]} scale={0.9} color="#4a4a4a" />
      <GraniteBlock position={[2.5, -0.3, -0.5]} scale={0.7} color="#6b6b6b" />
      <GraniteBlock position={[-0.5, -1, -1.5]} scale={0.6} color="#3a3a3a" />

      {/* Furniture */}
      <FurniturePiece position={[0.8, 0.8, -1]} scale={0.8} />

      {/* Gold accents */}
      <GoldSphere position={[-1.5, -0.5, 0]} />
      <GoldSphere position={[1.8, 1.2, -0.5]} />
      <GoldSphere position={[0, -1.2, 0.5]} />
      <GoldSphere position={[-2.8, 1, -0.3]} />

      <Particles />
      <Stars radius={8} depth={30} count={200} factor={2} saturation={0} fade speed={0.5} />
    </>
  );
};

const HeroScene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default HeroScene;
