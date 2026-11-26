import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Seeding ProjectFlow database...');

  // 1. Create Demo User
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'jane.cooper@projectflow.dev' },
    update: {},
    create: {
      name: 'Jane Cooper',
      email: 'jane.cooper@projectflow.dev',
      passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
  });

  // 2. Create Demo Workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'acme-product' },
    update: {},
    create: {
      name: 'Acme Product Team',
      slug: 'acme-product',
      description: 'Primary product engineering workspace.',
      ownerId: user.id,
    },
  });

  // 3. Workspace Membership
  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: 'OWNER',
    },
  });

  // 4. Create Project
  const project = await prisma.project.create({
    data: {
      name: 'Design System 2.0',
      description: 'Unified component library and design tokens.',
      workspaceId: workspace.id,
      createdById: user.id,
      status: 'ACTIVE',
      startDate: new Date('2026-10-01'),
      dueDate: new Date('2026-12-15'),
    },
  });

  // 5. Create Project Member
  await prisma.projectMember.create({
    data: {
      projectId: project.id,
      userId: user.id,
      role: 'LEAD',
    },
  });

  // 6. Create Tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Audit color contrast ratios for AA compliance',
        description: 'Verify background surface values `#FAFAFA` and text tokens meet WCAG 2.1 AA.',
        projectId: project.id,
        assigneeId: user.id,
        createdById: user.id,
        status: 'TODO',
        priority: 'HIGH',
        dueDate: new Date('2026-11-28'),
        position: 1000.0,
      },
      {
        title: 'Implement dnd-kit sensor hooks with keyboard support',
        description: 'Implement PointerSensor and KeyboardSensor for accessible Kanban interaction.',
        projectId: project.id,
        assigneeId: user.id,
        createdById: user.id,
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        dueDate: new Date('2026-11-27'),
        position: 2000.0,
      },
      {
        title: 'Finalize Toast notification container & auto-dismiss',
        description: 'Completed 4000ms dismiss timer with subtle slide-in animation.',
        projectId: project.id,
        assigneeId: user.id,
        createdById: user.id,
        status: 'DONE',
        priority: 'MEDIUM',
        dueDate: new Date('2026-11-24'),
        position: 3000.0,
      },
    ],
  });

  console.log('[Seed] Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
