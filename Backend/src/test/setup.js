import { jest, beforeAll, afterAll } from '@jest/globals';

// Mock database to prevent actual connections
jest.mock('../Database/db.js', () => {
  const mockSequelize = {
    authenticate: jest.fn().mockResolvedValue(true),
    define: jest.fn(),
    transaction: jest.fn(),
    close: jest.fn(),
    query: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockSequelize,
  };
});

// Global test setup to suppress console logs
beforeAll(() => {
  // Suppress console.log for database connection messages
  const originalLog = console.log;
  const originalError = console.error;
  
  console.log = jest.fn((...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Database connected')) {
      return; // Suppress DB connection logs
    }
    originalLog(...args);
  });
  
  console.error = jest.fn((...args) => {
    if (typeof args[0] === 'string' && args[0].includes('DB Connection Error')) {
      return; // Suppress DB connection errors
    }
    originalError(...args);
  });
});

afterAll(() => {
  // Restore console methods
  jest.restoreAllMocks();
});

