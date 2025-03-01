
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
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
      // For MeshStandardMaterial, these properties are valid
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
      // For MeshStandardMaterial, these properties are valid
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

    // Add some scent particles
    const particles: THREE.Mesh[] = [];
    const particleCount = 10;
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.6
    });

    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2 + 2;
      particle.position.x = radius * Math.cos(theta);
      particle.position.y = topY + Math.random() * 3;
      particle.position.z = radius * Math.sin(theta);
      particle.visible = false; // Initially invisible
      scene.add(particle);
      particles.push(particle);
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

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Animation
    let particleTimer = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animate leaves slightly
      const time = Date.now() * 0.001;
      leaves.forEach((leaf, index) => {
        leaf.rotation.x += Math.sin(time * 0.3 + index) * 0.002;
        leaf.rotation.y += Math.cos(time * 0.2 + index) * 0.001;
      });

      // Periodic scent emission animation
      particleTimer += 0.01;
      if (particleTimer > 2 * Math.PI) particleTimer = 0;
      
      particles.forEach((particle, index) => {
        const offset = (index / particles.length) * 2 * Math.PI;
        const visibleThreshold = Math.sin(particleTimer + offset);
        
        if (visibleThreshold > 0.7) {
          if (!particle.visible) particle.visible = true;
          
          // Move upward when visible
          particle.position.y += 0.03;
          
          // Fade out as it goes up
          if (particle.material) {
            (particle.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - visibleThreshold / 3);
          }
          
          // Reset when it gets too high
          if (particle.position.y > topY + 8) {
            const theta = Math.random() * Math.PI * 2;
            const radius = Math.random() * 2 + 2;
            particle.position.x = radius * Math.cos(theta);
            particle.position.y = topY + Math.random() * 1;
            particle.position.z = radius * Math.sin(theta);
            particle.visible = false;
          }
        }
      });
      
      controls.update();
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
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      // Dispose materials and geometries
      [baseGeometry, columnGeometry, topGeometry, particleGeometry].forEach(geometry => {
        geometry.dispose();
      });
      
      [baseMaterial, columnMaterial, topMaterial, particleMaterial].forEach(material => {
        material.dispose();
      });
      
      scene.clear();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default ThreeScene;
