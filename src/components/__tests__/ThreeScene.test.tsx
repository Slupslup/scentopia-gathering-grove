
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThreeScene from '../ThreeScene';
import * as sceneUtils from '../../utils/sceneUtils';
import * as interactionUtils from '../../utils/interactionUtils';
import * as particleUtils from '../../utils/particleUtils';

// Mock the utility functions
jest.mock('../../utils/sceneUtils');
jest.mock('../../utils/interactionUtils');
jest.mock('../../utils/particleUtils');
jest.mock('three', () => {
  const originalModule = jest.requireActual('three');
  return {
    ...originalModule,
    WebGLRenderer: jest.fn().mockImplementation(() => ({
      setSize: jest.fn(),
      render: jest.fn(),
      setPixelRatio: jest.fn(),
      domElement: document.createElement('canvas'),
      shadowMap: {
        enabled: false,
        type: null,
      },
    })),
    PerspectiveCamera: jest.fn().mockImplementation(() => ({
      aspect: 1,
      updateProjectionMatrix: jest.fn(),
    })),
    Clock: jest.fn().mockImplementation(() => ({
      getDelta: jest.fn().mockReturnValue(0.1),
    })),
  };
});

describe('ThreeScene Component', () => {
  beforeEach(() => {
    // Setup mocks for utility functions
    (sceneUtils.setupScene as jest.Mock).mockReturnValue({
      scene: { add: jest.fn(), rotation: { y: 0 }, clear: jest.fn() },
      camera: { aspect: 1, updateProjectionMatrix: jest.fn() },
      renderer: {
        setSize: jest.fn(),
        render: jest.fn(),
        domElement: document.createElement('canvas'),
      },
    });
    
    (sceneUtils.createBase as jest.Mock).mockReturnValue({
      base: { position: { y: 0 } },
      baseGeometry: { dispose: jest.fn() },
      baseMaterial: { dispose: jest.fn() }
    });
    
    (sceneUtils.createColumn as jest.Mock).mockReturnValue({
      column: { position: { y: 0 } },
      columnGeometry: { dispose: jest.fn() },
      columnMaterial: { dispose: jest.fn() }
    });
    
    (sceneUtils.createTop as jest.Mock).mockReturnValue({
      top: { position: { y: 0 } },
      topGeometry: { dispose: jest.fn() },
      topMaterial: { dispose: jest.fn() }
    });
    
    (sceneUtils.createGreenery as jest.Mock).mockReturnValue([]);
    (sceneUtils.setupLighting as jest.Mock).mockReturnValue({});
    
    (particleUtils.createParticleSystem as jest.Mock).mockReturnValue({
      particles: [],
      particleGroups: []
    });
    
    (interactionUtils.setupInteractionHandlers as jest.Mock).mockReturnValue({
      cleanup: jest.fn(),
      controlState: {
        getTargetRotation: jest.fn().mockReturnValue(0),
        getAutoRotate: jest.fn().mockReturnValue(true)
      }
    });
  });

  test('renders without crashing', () => {
    render(<ThreeScene />);
    const threeSceneElement = screen.getByTitle('Hover to see scent diffusion');
    expect(threeSceneElement).toBeInTheDocument();
  });

  test('initializes scene and components', () => {
    render(<ThreeScene />);
    expect(sceneUtils.setupScene).toHaveBeenCalled();
    expect(sceneUtils.createBase).toHaveBeenCalled();
    expect(sceneUtils.createColumn).toHaveBeenCalled();
    expect(sceneUtils.createTop).toHaveBeenCalled();
    expect(sceneUtils.createGreenery).toHaveBeenCalled();
    expect(sceneUtils.setupLighting).toHaveBeenCalled();
    expect(particleUtils.createParticleSystem).toHaveBeenCalled();
    expect(interactionUtils.setupInteractionHandlers).toHaveBeenCalled();
  });
});
