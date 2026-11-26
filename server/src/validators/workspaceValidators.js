import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Workspace name must be at least 2 characters').max(60),
    description: z.string().max(255).optional(),
  }),
});

export const updateWorkspaceSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid workspace ID format'),
  }),
  body: z.object({
    name: z.string().min(2).max(60).optional(),
    description: z.string().max(255).optional(),
  }),
});

export const inviteMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid workspace ID format'),
  }),
  body: z.object({
    email: z.string().email('Please enter a valid email to invite'),
    role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
  }),
});
