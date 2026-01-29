import { jest } from "@jest/globals";
import { loginUser, registerUser } from '../controller/authController.js';

jest.mock('../Config/firebaseAdmin.js', () => ({
  admin: {
    auth: () => ({
      verifyIdToken: jest.fn(),
    }),
  },
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Security Tests', () => {
  it('should handle login authentication', async () => {
    const req = { body: { id_token: 'valid_token' } };
    const res = mockResponse();

    await loginUser(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });

  it('should handle register authentication', async () => {
    const req = { body: { id_token: 'valid_token', email: 'test@example.com', name: 'Test' } };
    const res = mockResponse();

    await registerUser(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });
});
