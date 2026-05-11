/* eslint-disable no-console */
import { PrismaClient, Role, PlanTier } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.info('Seeding demo workspace…');

  const user = await prisma.user.upsert({
    where: { email: 'demo@rfpilot.dev' },
    update: {},
    create: {
      clerkId: 'user_demo',
      email: 'demo@rfpilot.dev',
      name: 'Demo User',
    },
  });

  const org = await prisma.organization.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      clerkOrgId: 'org_demo',
      slug: 'acme',
      name: 'Acme Corp',
    },
  });

  await prisma.membership.upsert({
    where: { userId_orgId: { userId: user.id, orgId: org.id } },
    update: {},
    create: { userId: user.id, orgId: org.id, role: Role.OWNER },
  });

  await prisma.subscription.upsert({
    where: { orgId: org.id },
    update: {},
    create: {
      orgId: org.id,
      stripeCustomerId: 'cus_demo',
      tier: PlanTier.FREE,
      seats: 1,
    },
  });

  console.info('Seed complete.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
