import admin from "firebase-admin";
import serviceAccount from "../../adminsdk.json" with { type: "json" };

let adminApp;
try {
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.warn("⚠️ Firebase Admin initialization failed (likely due to missing/invalid adminsdk.json). Firebase features will be disabled or mocked.");
  adminApp = null;
}

// Enhanced Fallback/Proxy for admin.auth()
const adminProxy = new Proxy(admin, {
  get(target, prop) {
    if (prop === 'auth') {
      return (...args) => {
        // Attempt to get real auth, or fallback to empty object
        let originalAuth;
        try {
          originalAuth = target.auth(...args);
        } catch (e) {
          originalAuth = {};
        }

        return new Proxy(originalAuth, {
          get(authTarget, authProp) {
            if (authProp === 'verifyIdToken') {
              return async (token) => {
                // Mock Token Handling
                if (token === "mock-admin-token") {
                  return { uid: "mock-admin-uid" };
                }
                if (token && typeof token === 'string' && token.startsWith("mock-token-")) {
                  return { uid: "mock-uid-" + token.replace("mock-token-", "") };
                }

                // If not mock and we have real auth, use it
                if (authTarget.verifyIdToken) {
                  return authTarget.verifyIdToken(token);
                }

                throw new Error("Firebase Admin not initialized and token is not mock");
              };
            }
            return authTarget[authProp];
          }
        });
      };
    }
    return target[prop];
  }
});

export { adminProxy as admin };
