
// Add any global test setup here
import '@testing-library/jest-dom';

// Mock requestAnimationFrame for tests
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);

// Mock ResizeObserver (used by some Three.js components)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
