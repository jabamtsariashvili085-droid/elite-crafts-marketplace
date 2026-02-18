import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshTransmissionMaterial, MeshDistortMaterial } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function ParametricWall() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[2.5, 0.5, -1]} scale={1.2}>
        <torusKnotGeometry args={[1, 0.35, 200, 32, 2, 3]} />
        <MeshDistortMaterial
          color="#8B6914"
          roughness={0.2}
          metalness={0.9}
          distort={0.15}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function GraniteSink() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2 - 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
      <group ref={groupRef} position={[-2.5, -0.5, 0]}>
        {/* Basin shape */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 0.3, 1.5]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[1.6, 0.5, 1.1]} />
          <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Gold vein accent */}
        <mesh position={[0, 0.16, 0]} rotation={[0, 0.3, 0]}>
          <planeGeometry args={[2.1, 0.02]} />
          <meshStandardMaterial color="#C5961B" emissive="#8B6914" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

function GlassSphere() {
  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
      <mesh position={[0, 1, 1]} scale={0.6}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          thickness={0.5}
          chromaticAberration={0.2}
          anisotropy={0.3}
          distortion={0.3}
          distortionScale={0.5}
          temporalDistortion={0.1}
          color="#C5961B"
          transmission={0.95}
          roughness={0.05}
        />
      </mesh>
    </Float>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#C5961B" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#C5961B" />
          <directionalLight position={[-5, 3, 2]} intensity={0.3} color="#ffffff" />
          <pointLight position={[0, -2, 3]} intensity={0.5} color="#8B6914" />

          <GraniteSink />
          <ParametricWall />
          <GlassSphere />
          <Particles />

          <Environment preset="city" environmentIntensity={0.3} />
        </Suspense>
      </Canvas>
    </div>
  );
}
