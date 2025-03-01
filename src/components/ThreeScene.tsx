
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Exit early if ref is not attached
    if (!mountRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create tower base (cylinder)
    const towerGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
    const towerMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xF5F5F5,
      metalness: 0.3,
      roughness: 0.2
    });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    scene.add(tower);

    // Create green top part
    const topGeometry = new THREE.CylinderGeometry(0.6, 0.5, 1, 32);
    const topMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x5C8D4C,
      roughness: 0.8
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 2;
    scene.add(top);

    // Create foliage using particle system
    const foliageGeometry = new THREE.BufferGeometry();
    const foliageCount = 500;
    const positions = new Float32Array(foliageCount * 3);
    const colors = new Float32Array(foliageCount * 3);
    
    for (let i = 0; i < foliageCount; i++) {
      // Position foliage particles around the top of the tower
      const theta = Math.random() * Math.PI * 2;
      const radius = 0.2 + Math.random() * 0.5;
      const height = 1.8 + Math.random() * 1.2;
      
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
      
      // Vary green shades
      colors[i * 3] = 0.2 + Math.random() * 0.2;
      colors[i * 3 + 1] = 0.6 + Math.random() * 0.4;
      colors[i * 3 + 2] = 0.2 + Math.random() * 0.2;
    }
    
    foliageGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    foliageGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const foliageMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    const foliage = new THREE.Points(foliageGeometry, foliageMaterial);
    scene.add(foliage);

    // Create scent particles
    const scentParticles = new THREE.Group();
    scene.add(scentParticles);
    
    // Add 20 small spheres for scent particles
    for (let i = 0; i < 20; i++) {
      const particleSize = 0.04 + Math.random() * 0.05;
      const particleGeometry = new THREE.SphereGeometry(particleSize, 16, 16);
      const particleMaterial = new THREE.MeshPhongMaterial({
        color: 0xE0F0D0,
        transparent: true,
        opacity: 0.6
      });
      
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // Set initial positions
      const theta = Math.random() * Math.PI * 2;
      const radius = 0.6 + Math.random() * 0.2;
      particle.position.x = Math.cos(theta) * radius;
      particle.position.y = 2.2;
      particle.position.z = Math.sin(theta) * radius;
      
      // Store animation parameters
      particle.userData = {
        speed: 0.003 + Math.random() * 0.005,
        theta: theta,
        radius: radius,
        ySpeed: 0.005 + Math.random() * 0.01,
        amplitude: 0.2 + Math.random() * 0.3
      };
      
      scentParticles.add(particle);
    }

    // Position camera
    camera.position.z = 5;
    camera.position.y = 1;
    
    // Add mouse interaction
    let isDragging = false;
    let previousMousePosition = {
      x: 0,
      y: 0
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaMove = {
          x: e.clientX - previousMousePosition.x,
          y: e.clientY - previousMousePosition.y
        };
        
        const rotationSpeed = 0.005;
        scene.rotation.y += deltaMove.x * rotationSpeed;
        scene.rotation.x += deltaMove.y * rotationSpeed;
        scene.rotation.x = Math.max(-0.5, Math.min(0.5, scene.rotation.x));
      }
      
      previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    };
    
    const handleMouseUp = () => {
      isDragging = false;
    };
    
    // Window resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Animation loop
    let rotationSpeed = 0.002;

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Automatic rotation when not dragging
      if (!isDragging) {
        scene.rotation.y += rotationSpeed;
      }
      
      // Animate scent particles
      scentParticles.children.forEach((particle, i) => {
        const { speed, theta, radius, ySpeed, amplitude } = particle.userData;
        
        // Update theta for circular motion
        particle.userData.theta += speed;
        
        // Update particle position
        particle.position.x = Math.cos(particle.userData.theta) * radius;
        particle.position.z = Math.sin(particle.userData.theta) * radius;
        
        // Make particles float upward
        particle.position.y += ySpeed;
        
        // Reset position when particle goes too high
        if (particle.position.y > 4) {
          particle.position.y = 2.2;
          particle.userData.theta = Math.random() * Math.PI * 2;
        }
        
        // Slightly scale opacity based on height
        const heightFactor = 1 - (particle.position.y - 2.2) / 2;
        (particle.material as THREE.MeshPhongMaterial).opacity = heightFactor * 0.6;
      });
      
      // Animate foliage with subtle movement
      const time = Date.now() * 0.001;
      const positions = foliageGeometry.attributes.position;
      
      for (let i = 0; i < foliageCount; i++) {
        const ix = i * 3;
        const x = positions.array[ix];
        const z = positions.array[ix + 2];
        
        // Calculate distance from center
        const distance = Math.sqrt(x * x + z * z);
        
        // Add slight movement based on distance and time
        positions.array[ix] += Math.sin(time + i * 0.1) * 0.002 * distance;
        positions.array[ix + 2] += Math.cos(time + i * 0.1) * 0.002 * distance;
      }
      
      positions.needsUpdate = true;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  
  return (
    <div className="h-[500px] w-full" ref={mountRef}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-pulse-gentle text-sm text-stone-400 pointer-events-none">
          Loading 3D Model...
        </div>
      </div>
    </div>
  );
};

export default ThreeScene;
