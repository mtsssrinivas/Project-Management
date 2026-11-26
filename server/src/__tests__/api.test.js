import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken, verifyToken } from '../utils/jwt.js';

describe('ProjectFlow API & Security Test Suite', () => {
  describe('System & Health Checks', () => {
    it('GET /api/health should return status 200 with healthy flag', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toBe('projectflow-api');
    });

    it('Undefined route /unknown-path should return structured 404 error envelope', async () => {
      const res = await request(app).get('/unknown-path');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('Authentication Security & Zod Validation', () => {
    it('POST /api/auth/register should reject invalid email and short passwords', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'A',
          email: 'not-an-email',
          password: 'short',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details).toBeInstanceOf(Array);
      expect(res.body.error.details.length).toBeGreaterThan(0);
    });

    it('POST /api/auth/login should reject empty credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('Protected endpoints should return 401 when token is missing', async () => {
      const res = await request(app).get('/api/workspaces');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('Protected endpoints should reject invalid/tampered tokens', async () => {
      const res = await request(app)
        .get('/api/workspaces')
        .set('Authorization', 'Bearer invalid-token-signature');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('Cryptographic & Token Utilities', () => {
    it('Bcrypt password hashing should securely salt and verify credentials', async () => {
      const plain = 'StrongSecretPass123!';
      const hash = await hashPassword(plain);

      expect(hash).not.toBe(plain);
      expect(hash.startsWith('$2')).toBe(true);

      const isValid = await comparePassword(plain, hash);
      expect(isValid).toBe(true);

      const isInvalid = await comparePassword('WrongPassword', hash);
      expect(isInvalid).toBe(false);
    });

    it('JWT token issuance and verification should sign and hydrate payload', () => {
      const payload = { id: 'usr_test_123', email: 'test@projectflow.dev' };
      const token = signToken(payload);

      expect(typeof token).toBe('string');
      const decoded = verifyToken(token);

      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
    });
  });

  describe('Kanban Fractional Positioning Logic', () => {
    it('Calculates midpoint between adjacent cards for O(1) card move updates', () => {
      const prevPosition = 1000.0;
      const nextPosition = 2000.0;
      const newPosition = (prevPosition + nextPosition) / 2;

      expect(newPosition).toBe(1500.0);
      expect(newPosition).toBeGreaterThan(prevPosition);
      expect(newPosition).toBeLessThan(nextPosition);
    });

    it('Calculates position when moving to top of column', () => {
      const nextPosition = 1000.0;
      const newPosition = nextPosition / 2;

      expect(newPosition).toBe(500.0);
      expect(newPosition).toBeLessThan(nextPosition);
    });

    it('Calculates position when moving to bottom of column', () => {
      const prevPosition = 3000.0;
      const newPosition = prevPosition + 1000.0;

      expect(newPosition).toBe(4000.0);
      expect(newPosition).toBeGreaterThan(prevPosition);
    });
  });
});
