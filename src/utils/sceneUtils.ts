
import * as THREE from 'three';

// Create and setup the scene
export function setupScene(container: HTMLDivElement) {
  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8f9fa);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    40, // field of view
    container.clientWidth / container.clientHeight, // aspect ratio
    0.1, // near clipping plane
    1000 // far clipping plane
  );
  camera.position.set(0, 0, 25);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  return { scene, camera, renderer };
}

// Create base for the scent tower
export function createBase() {
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
  
  return { base, baseGeometry, baseMaterial };
}

// Create column for the scent tower
export function createColumn() {
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
  
  return { column, columnGeometry, columnMaterial };
}

// Create top part of the scent tower
export function createTop() {
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
  
  return { top, topGeometry, topMaterial };
}

// Create a leaf for the greenery
export function createLeaf(x: number, y: number, z: number, scale: number, rotationY: number) {
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
  
  return leaf;
}

// Create all the greenery for the tower
export function createGreenery(topY: number) {
  const leaves: THREE.Mesh[] = [];
  
  // Add a group of leaves around the top of the tower
  const leafCount = 60;
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

  return leaves;
}

// Setup lighting for the scene
export function setupLighting(scene: THREE.Scene) {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Directional light
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
  
  return { ambientLight, directionalLight, spotLight };
}

// Animate leaves
export function animateLeaves(leaves: THREE.Mesh[], time: number) {
  leaves.forEach((leaf, index) => {
    leaf.rotation.x += Math.sin(time * 0.3 + index) * 0.002;
    leaf.rotation.y += Math.cos(time * 0.2 + index) * 0.001;
  });
}
