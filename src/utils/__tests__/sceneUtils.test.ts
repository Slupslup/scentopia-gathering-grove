
import * as THREE from 'three';
import { 
  setupScene,
  createBase,
  createColumn,
  createTop,
  createGreenery,
  setupLighting,
  animateLeaves
} from '../sceneUtils';

// Mock THREE.js
jest.mock('three', () => {
  return {
    Scene: jest.fn().mockImplementation(() => ({
      background: null,
      add: jest.fn(),
    })),
    PerspectiveCamera: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
    })),
    WebGLRenderer: jest.fn().mockImplementation(() => ({
      setSize: jest.fn(),
      shadowMap: { enabled: false, type: null },
      domElement: document.createElement('canvas'),
    })),
    Color: jest.fn(),
    CylinderGeometry: jest.fn(),
    SphereGeometry: jest.fn(),
    PlaneGeometry: jest.fn(),
    MeshStandardMaterial: jest.fn().mockImplementation(() => ({
      dispose: jest.fn(),
    })),
    Mesh: jest.fn().mockImplementation(() => ({
      position: { y: 0, set: jest.fn() },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { set: jest.fn() },
      castShadow: false,
      receiveShadow: false,
    })),
    AmbientLight: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
    })),
    DirectionalLight: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
      castShadow: false,
    })),
    SpotLight: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
      target: { position: { set: jest.fn() } },
    })),
    PCFSoftShadowMap: 'PCFSoftShadowMap',
  };
});

describe('Scene Utils', () => {
  const mockContainer = document.createElement('div');
  Object.defineProperty(mockContainer, 'clientWidth', { value: 800 });
  Object.defineProperty(mockContainer, 'clientHeight', { value: 600 });

  test('setupScene creates scene, camera, and renderer', () => {
    const result = setupScene(mockContainer);
    expect(result).toHaveProperty('scene');
    expect(result).toHaveProperty('camera');
    expect(result).toHaveProperty('renderer');
    expect(THREE.Scene).toHaveBeenCalled();
    expect(THREE.PerspectiveCamera).toHaveBeenCalled();
    expect(THREE.WebGLRenderer).toHaveBeenCalled();
  });

  test('createBase returns base mesh with geometry and material', () => {
    const result = createBase();
    expect(result).toHaveProperty('base');
    expect(result).toHaveProperty('baseGeometry');
    expect(result).toHaveProperty('baseMaterial');
    expect(THREE.CylinderGeometry).toHaveBeenCalled();
    expect(THREE.MeshStandardMaterial).toHaveBeenCalled();
    expect(THREE.Mesh).toHaveBeenCalled();
  });

  test('createColumn returns column mesh with geometry and material', () => {
    const result = createColumn();
    expect(result).toHaveProperty('column');
    expect(result).toHaveProperty('columnGeometry');
    expect(result).toHaveProperty('columnMaterial');
    expect(THREE.CylinderGeometry).toHaveBeenCalled();
    expect(THREE.MeshStandardMaterial).toHaveBeenCalled();
    expect(THREE.Mesh).toHaveBeenCalled();
  });

  test('createTop returns top mesh with geometry and material', () => {
    const result = createTop();
    expect(result).toHaveProperty('top');
    expect(result).toHaveProperty('topGeometry');
    expect(result).toHaveProperty('topMaterial');
    expect(THREE.SphereGeometry).toHaveBeenCalled();
    expect(THREE.MeshStandardMaterial).toHaveBeenCalled();
    expect(THREE.Mesh).toHaveBeenCalled();
  });

  test('createGreenery returns array of leaf meshes', () => {
    const topY = 7.5;
    const leaves = createGreenery(topY);
    expect(Array.isArray(leaves)).toBe(true);
    // Ensure we have leaves since we're creating both main leaves and vines
    expect(THREE.PlaneGeometry).toHaveBeenCalled();
    expect(THREE.MeshStandardMaterial).toHaveBeenCalled();
    expect(THREE.Mesh).toHaveBeenCalled();
  });

  test('setupLighting adds lights to scene', () => {
    const mockScene = { add: jest.fn() };
    const result = setupLighting(mockScene as any);
    expect(result).toHaveProperty('ambientLight');
    expect(result).toHaveProperty('directionalLight');
    expect(result).toHaveProperty('spotLight');
    expect(THREE.AmbientLight).toHaveBeenCalled();
    expect(THREE.DirectionalLight).toHaveBeenCalled();
    expect(THREE.SpotLight).toHaveBeenCalled();
    expect(mockScene.add).toHaveBeenCalled();
  });

  test('animateLeaves applies rotation to leaves', () => {
    const mockLeaves = [
      { rotation: { x: 0, y: 0 } },
      { rotation: { x: 0, y: 0 } }
    ];
    const time = 1.0;
    animateLeaves(mockLeaves as any[], time);
    // Check that rotation values were updated
    expect(mockLeaves[0].rotation.x).not.toBe(0);
    expect(mockLeaves[0].rotation.y).not.toBe(0);
  });
});
