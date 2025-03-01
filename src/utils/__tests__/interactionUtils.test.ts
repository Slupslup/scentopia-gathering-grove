
import { setupInteractionHandlers } from '../interactionUtils';
import React from 'react';

describe('Interaction Utils', () => {
  // Mock React.RefObject and setIsHovering function
  const mockRef = {
    current: document.createElement('div')
  };
  const mockSetIsHovering = jest.fn();
  const mockParticleGroups = [
    { particles: { visible: false } },
    { particles: { visible: false } }
  ];

  // Mock event listeners
  let documentEvents: Record<string, (e: any) => void> = {};
  let divEvents: Record<string, (e: any) => void> = {};

  // Mock addEventListener and removeEventListener
  document.addEventListener = jest.fn((event, callback) => {
    documentEvents[event] = callback;
  });
  document.removeEventListener = jest.fn((event) => {
    delete documentEvents[event];
  });

  mockRef.current.addEventListener = jest.fn((event, callback) => {
    divEvents[event] = callback;
  });
  mockRef.current.removeEventListener = jest.fn((event) => {
    delete divEvents[event];
  });

  afterEach(() => {
    jest.clearAllMocks();
    documentEvents = {};
    divEvents = {};
  });

  test('setupInteractionHandlers returns cleanup function and control state', () => {
    const result = setupInteractionHandlers(
      mockRef as React.RefObject<HTMLDivElement>,
      mockSetIsHovering,
      mockParticleGroups as any[]
    );

    expect(result).toHaveProperty('cleanup');
    expect(result).toHaveProperty('controlState');
    expect(typeof result.cleanup).toBe('function');
    expect(result.controlState).toHaveProperty('getTargetRotation');
    expect(result.controlState).toHaveProperty('setAutoRotate');
    expect(result.controlState).toHaveProperty('getAutoRotate');
  });

  test('mouse down event sets dragging to true', () => {
    const result = setupInteractionHandlers(
      mockRef as React.RefObject<HTMLDivElement>,
      mockSetIsHovering,
      mockParticleGroups as any[]
    );

    // Simulate mouse down event
    documentEvents['mousedown']({ clientX: 100, clientY: 100 });
    
    // Auto rotate should be set to false
    expect(result.controlState.getAutoRotate()).toBe(false);
  });

  test('mouse enter event sets hover state to true', () => {
    setupInteractionHandlers(
      mockRef as React.RefObject<HTMLDivElement>,
      mockSetIsHovering,
      mockParticleGroups as any[]
    );

    // Simulate mouse enter event
    divEvents['mouseenter']({});
    
    // isHovering should be set to true
    expect(mockSetIsHovering).toHaveBeenCalledWith(true);
    
    // Particles should be visible
    expect(mockParticleGroups[0].particles.visible).toBe(true);
    expect(mockParticleGroups[1].particles.visible).toBe(true);
  });

  test('mouse leave event sets hover state to false', () => {
    jest.useFakeTimers();
    
    setupInteractionHandlers(
      mockRef as React.RefObject<HTMLDivElement>,
      mockSetIsHovering,
      mockParticleGroups as any[]
    );

    // Simulate mouse leave event
    divEvents['mouseleave']({});
    
    // isHovering should be set to false
    expect(mockSetIsHovering).toHaveBeenCalledWith(false);
    
    // Particles should still be visible before timeout
    expect(mockParticleGroups[0].particles.visible).toBe(true);
    
    // Advance timers to trigger the setTimeout callback
    jest.advanceTimersByTime(1000);
    
    // Particles should be invisible after timeout
    expect(mockParticleGroups[0].particles.visible).toBe(false);
    expect(mockParticleGroups[1].particles.visible).toBe(false);
    
    jest.useRealTimers();
  });

  test('cleanup function removes event listeners', () => {
    const result = setupInteractionHandlers(
      mockRef as React.RefObject<HTMLDivElement>,
      mockSetIsHovering,
      mockParticleGroups as any[]
    );

    // Call cleanup function
    result.cleanup();
    
    // Check that removeEventListener was called for all events
    expect(document.removeEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(document.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(document.removeEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));
    expect(mockRef.current.removeEventListener).toHaveBeenCalledWith('mouseenter', expect.any(Function));
    expect(mockRef.current.removeEventListener).toHaveBeenCalledWith('mouseleave', expect.any(Function));
  });
});
