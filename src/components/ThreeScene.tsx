
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      40, // field of view
      mountRef.current.clientWidth / mountRef.current.clientHeight, // aspect ratio
      0.1, // near clipping plane
      1000 // far clipping plane
    );
    camera.position.set(0, 0, 25);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Base for the scent tower
    const baseGeometry = new THREE.CylinderGeometry(2, 2.2, 0.5, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x5a6b59,
      metalness: 0.2,
      roughness: 0.8
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -7;
    base.castShadow = true;
    base.receiveShadow = true;
    scene.add(base);

    // Main column of the scent tower
    const columnGeometry = new THREE.CylinderGeometry(1.5, 1.5, 15, 32);
    const columnMaterial = new THREE.MeshStandardMaterial({
      color: 0xdedede,
      metalness: 0.3,
      roughness: 0.5
    });
    const column = new THREE.Mesh(columnGeometry, columnMaterial);
    column.position.y = 0;
    column.castShadow = true;
    column.receiveShadow = true;
    scene.add(column);

    // Top part of the scent tower (where scent is emitted)
    const topGeometry = new THREE.SphereGeometry(1.8, 32, 32);
    const topMaterial = new THREE.MeshStandardMaterial({
      color: 0xb6c8a0,
      metalness: 0.1,
      roughness: 0.3
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 7.5;
    top.castShadow = true;
    top.receiveShadow = true;
    scene.add(top);

    // Create the greenery
    function createLeaf(x: number, y: number, z: number, scale: number, rotationY: number) {
      const leafGeometry = new THREE.PlaneGeometry(1, 1.5);
      const leafMaterial = new THREE.MeshStandardMaterial({
        color: 0x669966,
        side: THREE.DoubleSide,
        metalness: 0.1,
        roughness: 0.8
      });
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.set(x, y, z);
      leaf.scale.set(scale, scale, scale);
      leaf.rotation.x = Math.random() * Math.PI / 4;
      leaf.rotation.y = rotationY;
      leaf.rotation.z = Math.random() * Math.PI / 4;
      leaf.castShadow = true;
      scene.add(leaf);
      return leaf;
    }

    // Add a group of leaves around the top of the tower
    const leaves: THREE.Mesh[] = [];
    const leafCount = 60;
    const topY = 7.5; // Center of the top sphere
    const leafStartY = topY + 1; // Starting position of leaves
    const leafEndY = topY + 5; // Ending position of leaves
    const leafRadiusMax = 4;

    for (let i = 0; i < leafCount; i++) {
      const radiusRatio = Math.random();
      const radius = radiusRatio * leafRadiusMax;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = leafStartY + (leafEndY - leafStartY) * Math.random();
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      const scale = 0.7 + radiusRatio * 0.7;
      const leaf = createLeaf(x, y, z, scale, theta);
      leaves.push(leaf);
    }

    // Add smaller leaves/vines that drape down
    const vineCount = 30;
    const vineStartY = topY + 1;
    const vineEndY = -2; // Extend down the column
    const vineRadiusMax = 2.5;

    for (let i = 0; i < vineCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radiusRatio = Math.random() * 0.6 + 0.4; // 0.4 to 1.0
      const radius = radiusRatio * vineRadiusMax;
      
      // Create 5-10 leaves per vine
      const leavesPerVine = 5 + Math.floor(Math.random() * 6);
      for (let j = 0; j < leavesPerVine; j++) {
        const heightRatio = j / leavesPerVine;
        const y = vineStartY - (vineStartY - vineEndY) * heightRatio;
        
        // Add some randomness to position
        const xOffset = (Math.random() - 0.5) * 0.5;
        const zOffset = (Math.random() - 0.5) * 0.5;
        const x = radius * Math.cos(theta) + xOffset;
        const z = radius * Math.sin(theta) + zOffset;
        
        const scale = 0.4 + (1 - heightRatio) * 0.4; // Smaller leaves toward the bottom
        const rotationOffset = (Math.random() - 0.5) * Math.PI / 4;
        const leaf = createLeaf(x, y, z, scale, theta + rotationOffset);
        leaf.rotation.x += Math.PI / 3; // Tilt leaves down a bit
        leaves.push(leaf);
      }
    }

    // Enhanced scent particles system
    const particleCount = 50;
    const particles: THREE.Points[] = [];
    const particleGroups: {
      particles: THREE.Points,
      velocity: THREE.Vector3[],
      lifespan: number[],
      maxLifespan: number
    }[] = [];

    // Create multiple particle emitters around the top sphere
    const emitterCount = 4;
    for (let e = 0; e < emitterCount; e++) {
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const colors = new Float32Array(particleCount * 3);
      
      const emitterAngle = (e / emitterCount) * Math.PI * 2;
      const emitterX = Math.cos(emitterAngle) * 1.8;
      const emitterZ = Math.sin(emitterAngle) * 1.8;
      const emitterY = topY;

      const velocity: THREE.Vector3[] = [];
      const lifespan: number[] = [];
      const maxLifespan = 2.0; // seconds
      
      // Initialize particles
      for (let i = 0; i < particleCount; i++) {
        // Initial position at the emitter
        positions[i * 3] = emitterX;
        positions[i * 3 + 1] = emitterY;
        positions[i * 3 + 2] = emitterZ;
        
        // Random size variation
        sizes[i] = Math.random() * 0.1 + 0.05;
        
        // Soft gradient colors (white -> light green -> transparent)
        colors[i * 3] = 0.9; // R
        colors[i * 3 + 1] = 1.0; // G
        colors[i * 3 + 2] = 0.9; // B
        
        // Random velocity in a cone shape upward and outward
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.5 + 0.5;
        velocity.push(new THREE.Vector3(
          Math.cos(angle) * speed * 0.5,
          Math.random() * speed + 1.0, // Mostly upward
          Math.sin(angle) * speed * 0.5
        ));
        
        // Random lifespan for staggered emission
        lifespan.push(Math.random() * maxLifespan);
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        map: createParticleTexture(),
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
      particleSystem.visible = false; // Initially invisible
      scene.add(particleSystem);
      
      particles.push(particleSystem);
      particleGroups.push({
        particles: particleSystem,
        velocity,
        lifespan,
        maxLifespan
      });
    }

    // Create a custom texture for particles
    function createParticleTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      
      const context = canvas.getContext('2d');
      if (!context) return null;
      
      // Create a radial gradient for a soft, glowing particle
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(200, 255, 220, 0.8)');
      gradient.addColorStop(0.8, 'rgba(180, 255, 200, 0.2)');
      gradient.addColorStop(1, 'rgba(150, 255, 180, 0)');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
      
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Soft spotlight effect
    const spotLight = new THREE.SpotLight(0xb6c8a0, 0.8, 30, Math.PI / 4, 0.3, 1);
    spotLight.position.set(0, 15, 0);
    spotLight.target.position.set(0, 0, 0);
    scene.add(spotLight);
    scene.add(spotLight.target);

    // Controls setup (manual rotation instead of OrbitControls)
    let rotationSpeed = 0.002;
    let autoRotate = true;
    let targetRotationY = 0;
    let currentRotationY = 0;
    const damping = 0.05;
    
    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      autoRotate = false;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaMove = { x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y };
        targetRotationY += deltaMove.x * 0.01;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };
    
    const handleMouseUp = () => {
      isDragging = false;
      setTimeout(() => {
        if (!isDragging) autoRotate = true;
      }, 2000);
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
      particleGroups.forEach(group => {
        group.particles.visible = true;
      });
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
      setTimeout(() => {
        if (!isHovering) {
          particleGroups.forEach(group => {
            group.particles.visible = false;
          });
        }
      }, 1000); // Fade out particles gradually
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    mountRef.current.addEventListener('mouseenter', handleMouseEnter);
    mountRef.current.addEventListener('mouseleave', handleMouseLeave);

    // Animation
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      
      // Smooth rotation with damping
      if (autoRotate) {
        targetRotationY += rotationSpeed;
      }
      
      // Apply damping for smooth rotation
      currentRotationY += (targetRotationY - currentRotationY) * damping;
      
      // Apply rotation to entire scene
      scene.rotation.y = currentRotationY;
      
      // Animate leaves slightly
      const time = Date.now() * 0.001;
      leaves.forEach((leaf, index) => {
        leaf.rotation.x += Math.sin(time * 0.3 + index) * 0.002;
        leaf.rotation.y += Math.cos(time * 0.2 + index) * 0.001;
      });

      // Update particles when visible
      particleGroups.forEach(group => {
        if (group.particles.visible) {
          const positions = (group.particles.geometry.attributes.position as THREE.BufferAttribute).array;
          const colors = (group.particles.geometry.attributes.color as THREE.BufferAttribute).array;
          
          for (let i = 0; i < particleCount; i++) {
            // Update lifespan
            group.lifespan[i] += delta;
            if (group.lifespan[i] > group.maxLifespan) {
              group.lifespan[i] = 0;
              
              // Reset position to emitter
              positions[i * 3] = group.particles.position.x;
              positions[i * 3 + 1] = topY;
              positions[i * 3 + 2] = group.particles.position.z;
            } else {
              // Update position based on velocity and lifespan
              const lifeFactor = group.lifespan[i] / group.maxLifespan;
              
              // Apply velocity
              positions[i * 3] += group.velocity[i].x * delta;
              positions[i * 3 + 1] += group.velocity[i].y * delta;
              positions[i * 3 + 2] += group.velocity[i].z * delta;
              
              // Fade out color based on lifespan
              colors[i * 3] = 0.9 * (1 - lifeFactor); // Red
              colors[i * 3 + 1] = 1.0 * (1 - lifeFactor * 0.5); // Green fades slower
              colors[i * 3 + 2] = 0.9 * (1 - lifeFactor); // Blue
            }
          }
          
          group.particles.geometry.attributes.position.needsUpdate = true;
          group.particles.geometry.attributes.color.needsUpdate = true;
        }
      });
      
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
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (mountRef.current) {
        mountRef.current.removeEventListener('mouseenter', handleMouseEnter);
        mountRef.current.removeEventListener('mouseleave', handleMouseLeave);
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
