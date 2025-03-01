
import * as THREE from 'three';

// Setup event handlers for mouse interaction
export function setupInteractionHandlers(
  mountRef: React.RefObject<HTMLDivElement>,
  setIsHovering: React.Dispatch<React.SetStateAction<boolean>>,
  particleGroups: any[]
) {
  if (!mountRef.current) return { cleanup: () => {} };
  
  // Controls setup variables
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let autoRotate = true;
  let targetRotationY = 0;
  
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
      particleGroups.forEach(group => {
        group.particles.visible = false;
      });
    }, 1000); // Fade out particles gradually
  };
  
  // Add event listeners
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  mountRef.current.addEventListener('mouseenter', handleMouseEnter);
  mountRef.current.addEventListener('mouseleave', handleMouseLeave);

  // Return cleanup function and control state
  return {
    cleanup: () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (mountRef.current) {
        mountRef.current.removeEventListener('mouseenter', handleMouseEnter);
        mountRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    },
    controlState: {
      isDragging,
      autoRotate,
      targetRotationY,
      getTargetRotation: () => targetRotationY,
      setAutoRotate: (value: boolean) => { autoRotate = value; },
      getAutoRotate: () => autoRotate
    }
  };
}
