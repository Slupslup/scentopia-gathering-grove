
import * as THREE from 'three';

// Create a custom texture for particles
export function createParticleTexture() {
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

// Create particle system
export function createParticleSystem(
  particleCount: number, 
  topY: number, 
  emitterCount: number
) {
  const particles: THREE.Points[] = [];
  const particleGroups: {
    particles: THREE.Points,
    velocity: THREE.Vector3[],
    lifespan: number[],
    maxLifespan: number
  }[] = [];

  // Create multiple particle emitters around the top sphere
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
    
    particles.push(particleSystem);
    particleGroups.push({
      particles: particleSystem,
      velocity,
      lifespan,
      maxLifespan
    });
  }

  return { particles, particleGroups };
}

// Update particle positions and colors
export function updateParticles(
  particleGroups: {
    particles: THREE.Points,
    velocity: THREE.Vector3[],
    lifespan: number[],
    maxLifespan: number
  }[],
  particleCount: number,
  delta: number,
  topY: number
) {
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
}
