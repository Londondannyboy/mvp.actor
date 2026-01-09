'use client';

/**
 * Character Model - Single Animated 3D Character for Profile Sections
 * Fixed animation binding for cloned scenes
 */

import { Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { AnimationType } from '@/lib/character-config';

interface CharacterModelProps {
  animation: AnimationType;
  color: string;
  isComplete: boolean;
  completionPercent: number;
}

// The actual 3D soldier with animation and effects
function Soldier({
  animation,
  color,
  isComplete,
  completionPercent,
}: CharacterModelProps) {
  const group = useRef<THREE.Group>(null);
  const platformRef = useRef<THREE.Mesh>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  const { scene, animations } = useGLTF('/models/Soldier.glb');

  // Clone the scene and set up animations properly
  const clonedScene = useMemo(() => {
    const clone = cloneSkeleton(scene);
    return clone;
  }, [scene]);

  // Set up shadows and materials
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Apply grayscale effect for incomplete characters
        if (completionPercent === 0) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
            mat.color.setHSL(0, 0, 0.4);
            mesh.material = mat;
          }
        }
      }
    });
  }, [clonedScene, completionPercent]);

  // Set up animation mixer and play animation
  useEffect(() => {
    if (!clonedScene || animations.length === 0) return;

    // Create mixer for this cloned scene
    const mixer = new THREE.AnimationMixer(clonedScene);
    mixerRef.current = mixer;

    // Find the matching animation clip
    const clip = animations.find((a) => a.name === animation);
    if (clip) {
      const action = mixer.clipAction(clip);
      // Slow animation for incomplete characters
      action.setEffectiveTimeScale(completionPercent === 0 ? 0.5 : 1.0);
      action.play();
    }

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(clonedScene);
    };
  }, [clonedScene, animations, animation, completionPercent]);

  // Update animation mixer every frame
  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    // Animate platform glow
    if (platformRef.current) {
      const material = platformRef.current.material as THREE.MeshStandardMaterial;
      const baseIntensity = isComplete ? 0.6 : completionPercent > 0 ? 0.3 : 0.1;
      const pulse = isComplete ? Math.sin(Date.now() * 0.002) * 0.2 : 0;
      material.emissiveIntensity = baseIntensity + pulse;
    }
  });

  // Platform opacity based on completion
  const platformOpacity = isComplete ? 0.8 : completionPercent > 0 ? 0.5 : 0.2;

  return (
    <group ref={group} position={[0, 0, 0]}>
      <primitive object={clonedScene} scale={1.3} position={[0, -1.5, 0]} />

      {/* Glowing platform */}
      <mesh
        ref={platformRef}
        position={[0, -1.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isComplete ? 0.6 : 0.2}
          transparent
          opacity={platformOpacity}
        />
      </mesh>

      {/* Outer glow ring for complete characters */}
      {isComplete && (
        <mesh position={[0, -1.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1, 1.2, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
    </group>
  );
}

// Particles for complete characters
function CompletionParticles({ color, count = 20 }: { color: string; count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1 + Math.random() * 0.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.random() * 2 - 1;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.01;
        if (positions[i * 3 + 1] > 2) positions[i * 3 + 1] = -1;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Simple ambient scene setup
function SceneSetup({ color }: { color: string }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3, 2, 0]} intensity={0.5} color={color} />
      <pointLight position={[3, 2, 0]} intensity={0.3} color="#ffffff" />
    </>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#333" wireframe />
    </mesh>
  );
}

// Main exported component
export function CharacterModel({
  animation,
  color,
  isComplete,
  completionPercent,
}: CharacterModelProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 1, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneSetup color={color} />
        <Suspense fallback={<LoadingFallback />}>
          <Soldier
            animation={animation}
            color={color}
            isComplete={isComplete}
            completionPercent={completionPercent}
          />
          {isComplete && <CompletionParticles color={color} />}
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload('/models/Soldier.glb');
