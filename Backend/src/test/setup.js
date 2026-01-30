import { jest, beforeAll, afterAll, afterEach } from "@jest/globals";

// Store original console methods
const originalLog = console.log;
const originalError = console.error;

// Global test setup to suppress console logs
beforeAll(() => {
  console.log = jest.fn((...args) => {
    const msg = typeof args[0] === "string" ? args[0] : "";
    if (
      msg.includes("Database") ||
      msg.includes("database") ||
      msg.includes("Executing") ||
      msg.includes("dotenv") ||
      msg.includes("DB_")
    ) {
      return;
    }
    originalLog(...args);
  });

  console.error = jest.fn((...args) => {
    const msg = typeof args[0] === "string" ? args[0] : "";
    if (
      msg.includes("DB Connection") ||
      msg.includes("Firebase Auth") ||
      msg.includes("database")
    ) {
      return;
    }
    originalError(...args);
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  console.log = originalLog;
  console.error = originalError;
});
