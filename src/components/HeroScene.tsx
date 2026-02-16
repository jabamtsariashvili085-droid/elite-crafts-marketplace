import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Mouse-tracking camera rig
const CameraRig = () => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useMemo(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    target.current.x += (mouse.current.x - target.current.x) * 0.03;
    target.current.y += (mouse.current.y - target.current.y) * 0.03;
    camera.position.x = target.current.x * 1.2;
    camera.position.y = -target.current.y * 0.8;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// Polished granite countertop slab
const GraniteCountertop = ({ position, scale, color, rotation = [0, 0, 0] }: {
  position: [number, number, number]; scale: number; color: string; rotation?: [number, number, number];
}) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.y += 0.002;
    ref.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime * 0.25) * 0.05;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} position={position} scale={scale} rotation={rotation}>
        <boxGeometry args={[2.2, 0.18, 1.4]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.15}
          metalness={0.7}
          distort={0.08}
          speed={1.5}
          envMapIntensity={1.2}
        />
        {/* Edge highlight */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[2.22, 0.02, 1.42]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} opacity={0.3} transparent />
        </mesh>
      </mesh>
    </Float>
  );
};

// Detailed chair
const Chair = ({ position, scale }: { position: [number, number, number]; scale: number }) => {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.4 + Math.PI * 0.2;
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={ref} position={position} scale={scale}>
        {/* Seat */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.5, 0.06, 0.5]} />
          <meshStandardMaterial color="#A0522D" roughness={0.35} metalness={0.15} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.8, -0.22]}>
          <boxGeometry args={[0.46, 0.65, 0.05]} />
          <meshStandardMaterial color="#8B4513" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Legs */}
        {[[-0.2, 0.2, -0.2], [0.2, 0.2, -0.2], [-0.2, 0.2, 0.2], [0.2, 0.2, 0.2]].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]}>
            <cylinderGeometry args={[0.025, 0.03, 0.45, 8]} />
            <meshStandardMaterial color="#6B3A0A" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

// Table with realistic proportions
const Table = ({ position, scale }: { position: [number, number, number]; scale: number }) => {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.25 + Math.PI * 0.1;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.45}>
      <group ref={ref} position={position} scale={scale}>
        {/* Tabletop */}
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.8, 0.08, 0.9]} />
          <meshStandardMaterial color="#8B6914" roughness={0.3} metalness={0.25} />
        </mesh>
        {/* Tabletop edge bevel */}
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[1.84, 0.03, 0.94]} />
          <meshStandardMaterial color="#7A5C10" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Legs - tapered */}
        {[[-0.75, 0.24, -0.35], [0.75, 0.24, -0.35], [-0.75, 0.24, 0.35], [0.75, 0.24, 0.35]].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]}>
            <cylinderGeometry args={[0.035, 0.05, 0.55, 8]} />
            <meshStandardMaterial color="#6B4F12" roughness={0.45} metalness={0.15} />
          </mesh>
        ))}
        {/* Cross brace */}
        <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[1.4, 0.03, 0.03]} />
          <meshStandardMaterial color="#6B4F12" roughness={0.5} />
        </mesh>
      </group>
    </Float>
  );
};

// Marble vase
const Vase = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.y += 0.005;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
  });

  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.3}>
      <mesh ref={ref} position={position}>
        <latheGeometry args={[
          [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.15, 0.05),
            new THREE.Vector2(0.2, 0.15),
            new THREE.Vector2(0.18, 0.35),
            new THREE.Vector2(0.12, 0.5),
            new THREE.Vector2(0.1, 0.55),
            new THREE.Vector2(0.13, 0.6),
          ],
          24
        ]} />
        <MeshDistortMaterial
          color="#e8e0d0"
          roughness={0.2}
          metalness={0.4}
          distort={0.05}
          speed={1}
        />
      </mesh>
    </Float>
  );
};

// Gold accent objects
const GoldRing = ({ position, rotationSpeed = 1 }: { position: [number, number, number]; rotationSpeed?: number }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * 0.5 * rotationSpeed;
    ref.current.rotation.z = state.clock.elapsedTime * 0.3 * rotationSpeed;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + position[0]) * 0.2;
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[0.18, 0.04, 16, 32]} />
      <meshStandardMaterial color="#D4AF37" roughness={0.15} metalness={0.95} />
    </mesh>
  );
};

const GoldSphere = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0] * 2) * 0.25;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.12, 32, 32]} />
      <MeshWobbleMaterial color="#D4AF37" factor={0.25} speed={1.2} roughness={0.15} metalness={0.95} />
    </mesh>
  );
};

// Diamond shape accent
const Diamond = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.6;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.2;
  });

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.95} />
    </mesh>
  );
};

// Enhanced particles with varying sizes
const Particles = () => {
  const count = 120;
  const ref = useRef<THREE.Points>(null!);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      sz[i] = Math.random() * 0.04 + 0.01;
    }
    return [pos, sz];
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#D4AF37" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
};

// Glowing orb for atmosphere
const GlowOrb = ({ position, color, size = 0.5 }: { position: [number, number, number]; color: string; size?: number }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const s = size + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.06} />
    </mesh>
  );
};

const Scene = () => {
  return (
    <>
      <CameraRig />

      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={0.9} color="#fff5e0" castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#D4AF37" />
      <pointLight position={[-4, 2, -2]} intensity={0.6} color="#D4AF37" distance={10} />
      <pointLight position={[3, -1, 2]} intensity={0.4} color="#8B6914" distance={8} />
      <spotLight position={[0, 4, 2]} angle={0.4} penumbra={0.8} intensity={0.5} color="#fff" />

      {/* Granite countertops */}
      <GraniteCountertop position={[-2.5, 0.6, -1.5]} scale={0.85} color="#3a3a3a" rotation={[0.05, 0.3, 0]} />
      <GraniteCountertop position={[2.8, -0.2, -1]} scale={0.65} color="#5a5a5a" rotation={[-0.03, -0.5, 0.02]} />
      <GraniteCountertop position={[-0.8, -1.2, -2]} scale={0.55} color="#2a2a2a" rotation={[0.02, 0.8, -0.01]} />
      <GraniteCountertop position={[1, 1.5, -2.5]} scale={0.45} color="#707070" rotation={[0.1, -0.2, 0.05]} />

      {/* Furniture */}
      <Table position={[0.5, 0.3, -1.2]} scale={0.7} />
      <Chair position={[-1.5, -0.5, 0]} scale={0.9} />
      <Vase position={[2.2, 0.8, -0.5]} />

      {/* Gold accents */}
      <GoldRing position={[-2, 1.5, 0.5]} rotationSpeed={0.8} />
      <GoldRing position={[3, -0.8, -0.3]} rotationSpeed={1.2} />
      <GoldSphere position={[-1.2, -1, 0.5]} />
      <GoldSphere position={[1.5, 1.8, -0.8]} />
      <GoldSphere position={[-3, 0.2, -0.5]} />
      <Diamond position={[0.3, -1.5, 0.3]} />
      <Diamond position={[-2.5, -0.8, 0.8]} />
      <Diamond position={[2.8, 1.3, 0.2]} />

      {/* Atmospheric glows */}
      <GlowOrb position={[-2, 0, -1]} color="#D4AF37" size={0.8} />
      <GlowOrb position={[2, 1, -1.5]} color="#8B6914" size={0.6} />

      <Particles />
      <Stars radius={10} depth={40} count={300} factor={2.5} saturation={0} fade speed={0.4} />

      <Environment preset="city" />
    </>
  );
};

const HeroScene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 48 }}
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
