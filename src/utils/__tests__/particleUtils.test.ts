
import * as THREE from 'three';
import { 
  createParticleTexture, 
  createParticleSystem, 
  updateParticles 
} from '../particleUtils';

// Mock canvas and context
const mockContext = {
  createRadialGradient: jest.fn().mockReturnValue({
    addColorStop: jest.fn()
  }),
  fillStyle: null,
  fillRect: jest.fn()
};

const mockCanvas = {
  width: 0,
  height: 0,
  getContext: jest.fn().mockReturnValue(mockContext)
};

// Mock document.createElement
global.document.createElement = jest.fn().mockImplementation((tagName) => {
  if (tagName === 'canvas') {
    return mockCanvas;
  }
  return {};
});

// Mock THREE.js
jest.mock('three', () => {
  return {
    BufferGeometry: jest.fn().mockImplementation(() => ({
      setAttribute: jest.fn()
    })),
    Float32Array: jest.fn(),
    BufferAttribute: jest.fn(),
    PointsMaterial: jest.fn(),
    Points: jest.fn().mockImplementation(() => ({
      geometry: {
        attributes: {
          position: {
            array: new Array(300).fill(0),
            needsUpdate: false
          },
          color: {
            array: new Array(300).fill(0),
            needsUpdate: false
          }
        }
      },
      visible: false,
      position: { x: 0, y: 0, z: 0 }
    })),
    Texture: jest.fn().mockImplementation(() => ({
      needsUpdate: false
    })),
    Vector3: jest.fn().mockImplementation(() => ({
      x: 0,
      y: 0,
      z: 0
    })),
    AdditiveBlending: 'AdditiveBlending'
  };
});

describe('Particle Utils', () => {
  test('createParticleTexture creates a texture', () => {
    const texture = createParticleTexture();
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(mockContext.createRadialGradient).toHaveBeenCalled();
    expect(mockContext.fillRect).toHaveBeenCalled();
    expect(texture).not.toBeNull();
    expect(texture?.needsUpdate).toBe(true);
  });

  test('createParticleSystem creates particles and particle groups', () => {
    const particleCount = 50;
    const topY = 7.5;
    const emitterCount = 4;
    
    const result = createParticleSystem(particleCount, topY, emitterCount);
    
    expect(result).toHaveProperty('particles');
    expect(result).toHaveProperty('particleGroups');
    expect(Array.isArray(result.particles)).toBe(true);
    expect(Array.isArray(result.particleGroups)).toBe(true);
    expect(result.particles.length).toBe(emitterCount);
    expect(result.particleGroups.length).toBe(emitterCount);
    
    // Check that each particle group has the expected properties
    result.particleGroups.forEach(group => {
      expect(group).toHaveProperty('particles');
      expect(group).toHaveProperty('velocity');
      expect(group).toHaveProperty('lifespan');
      expect(group).toHaveProperty('maxLifespan');
      expect(Array.isArray(group.velocity)).toBe(true);
      expect(Array.isArray(group.lifespan)).toBe(true);
      expect(group.velocity.length).toBe(particleCount);
      expect(group.lifespan.length).toBe(particleCount);
    });
  });

  test('updateParticles updates particle positions and colors', () => {
    // Create mock particle groups
    const particleGroups = [{
      particles: {
        visible: true,
        geometry: {
          attributes: {
            position: {
              array: new Array(150).fill(0),
              needsUpdate: false
            },
            color: {
              array: new Array(150).fill(0),
              needsUpdate: false
            }
          }
        },
        position: { x: 0, y: 0, z: 0 }
      },
      velocity: Array(50).fill(0).map(() => ({ x: 0.1, y: 0.2, z: 0.1 })),
      lifespan: Array(50).fill(1.0),
      maxLifespan: 2.0
    }];
    
    const particleCount = 50;
    const delta = 0.1;
    const topY = 7.5;
    
    updateParticles(particleGroups as any, particleCount, delta, topY);
    
    // Check that the attributes were updated
    expect(particleGroups[0].particles.geometry.attributes.position.needsUpdate).toBe(true);
    expect(particleGroups[0].particles.geometry.attributes.color.needsUpdate).toBe(true);
    
    // Check that lifespans were updated
    expect(particleGroups[0].lifespan[0]).toBe(1.1); // 1.0 + delta
  });
});
