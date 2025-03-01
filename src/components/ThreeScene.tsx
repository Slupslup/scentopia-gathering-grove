
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { 
  setupScene, 
  createBase, 
  createColumn, 
  createTop, 
  createGreenery, 
  setupLighting,
  animateLeaves
} from '../utils/sceneUtils';
import { 
  createParticleSystem, 
  updateParticles 
} from '../utils/particleUtils';
import { 
  setupInteractionHandlers 
} from '../utils/interactionUtils';

const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const { scene, camera, renderer } = setupScene(mountRef.current);
    mountRef.current.appendChild(renderer.domElement);

    // Create tower components
    const { base, baseGeometry, baseMaterial } = createBase();
    const { column, columnGeometry, columnMaterial } = createColumn();
    const { top, topGeometry, topMaterial } = createTop();
    
    // Add tower components to scene
    scene.add(base);
    scene.add(column);
    scene.add(top);

    // Create and add greenery
    const topY = 7.5; // Center position of the top sphere
    const leaves = createGreenery(topY);
    leaves.forEach(leaf => scene.add(leaf));

    // Create particle system
    const particleCount = 50;
    const emitterCount = 4;
    const { particles, particleGroups } = createParticleSystem(particleCount, topY, emitterCount);
    particles.forEach(particle => scene.add(particle));

    // Setup lighting
    setupLighting(scene);

    // Setup interaction handlers
    const { cleanup, controlState } = setupInteractionHandlers(
      mountRef,
      setIsHovering,
      particleGroups
    );

    // Animation
    const clock = new THREE.Clock();
    let currentRotationY = 0;
    const rotationSpeed = 0.002;
    const damping = 0.05;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      
      // Smooth rotation with damping
      if (controlState.getAutoRotate()) {
        controlState.targetRotationY += rotationSpeed;
      }
      
      // Apply damping for smooth rotation
      currentRotationY += (controlState.getTargetRotation() - currentRotationY) * damping;
      
      // Apply rotation to entire scene
      scene.rotation.y = currentRotationY;
      
      // Animate leaves slightly
      const time = Date.now() * 0.001;
      animateLeaves(leaves, time);

      // Update particles when visible
      updateParticles(particleGroups, particleCount, delta, topY);
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cleanup();
      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose materials and geometries
      [baseGeometry, columnGeometry, topGeometry].forEach(geometry => {
        geometry.dispose();
      });
      
      [baseMaterial, columnMaterial, topMaterial].forEach(material => {
        material.dispose();
      });
      
      // Dispose particle systems
      particles.forEach(p => {
        p.geometry.dispose();
        if (p.material instanceof THREE.Material) {
          p.material.dispose();
        }
      });
      
      scene.clear();
    };
  }, [isHovering]);

  return (
    <div 
      ref={mountRef} 
      className="relative w-full h-full cursor-pointer"
      title="Hover to see scent diffusion"
    />
  );
};

export default ThreeScene;
