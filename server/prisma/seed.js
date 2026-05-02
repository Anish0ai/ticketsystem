const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Users ───────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "anish@ticketsys.com" },
    update: {},
    create: {
      name: "Anish",
      email: "anish@ticketsys.com",
      role: "Admin",
    },
  });

  const dev1 = await prisma.user.upsert({
    where: { email: "rahul@ticketsys.com" },
    update: {},
    create: {
      name: "Rahul",
      email: "rahul@ticketsys.com",
      role: "Developer",
    },
  });

  const dev2 = await prisma.user.upsert({
    where: { email: "kiran@ticketsys.com" },
    update: {},
    create: {
      name: "Kiran",
      email: "kiran@ticketsys.com",
      role: "Developer",
    },
  });

  console.log("✅ Users created:", admin.name, dev1.name, dev2.name);

  // ─── Projects ────────────────────────────────────────
  const project1 = await prisma.project.create({
    data: {
      name: "E-Commerce Platform",
      description: "Full-stack online store with payment integration and admin dashboard.",
      platform: "Web",
      techStack: ["React", "Node.js", "PostgreSQL", "Stripe"],
      members: { connect: [{ id: admin.id }, { id: dev1.id }, { id: dev2.id }] },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Fitness Tracker App",
      description: "Mobile app for tracking workouts, calories, and health metrics.",
      platform: "Mobile",
      techStack: ["React Native", "Firebase", "GraphQL"],
      members: { connect: [{ id: admin.id }, { id: dev2.id }] },
    },
  });

  console.log("✅ Projects created:", project1.name, project2.name);

  // ─── Tickets ─────────────────────────────────────────
  const tickets = await Promise.all([
    prisma.ticket.create({
      data: {
        title: "Fix checkout page crash on empty cart",
        description: "The checkout page throws an unhandled error when the cart is empty. Need to add a guard clause.",
        status: "Open",
        priority: "High",
        type: "Bug",
        platform: "Web",
        projectId: project1.id,
        creatorId: admin.id,
        assignedToId: dev1.id,
      },
    }),
    prisma.ticket.create({
      data: {
        title: "Add dark mode toggle to settings",
        description: "Implement a dark mode toggle in user settings that persists across sessions.",
        status: "InProgress",
        priority: "Medium",
        type: "Enhancement",
        platform: "Web",
        projectId: project1.id,
        creatorId: dev1.id,
        assignedToId: dev2.id,
      },
    }),
    prisma.ticket.create({
      data: {
        title: "Implement push notifications for workout reminders",
        description: "Send push notifications to users based on their workout schedule.",
        status: "Open",
        priority: "High",
        type: "Feature",
        platform: "Mobile",
        projectId: project2.id,
        creatorId: admin.id,
        assignedToId: dev2.id,
      },
    }),
    prisma.ticket.create({
      data: {
        title: "Optimize product image loading speed",
        description: "Product images are loading slowly. Implement lazy loading and WebP format conversion.",
        status: "Closed",
        priority: "Medium",
        type: "Enhancement",
        platform: "Web",
        projectId: project1.id,
        creatorId: dev2.id,
        assignedToId: dev1.id,
      },
    }),
    prisma.ticket.create({
      data: {
        title: "Calorie tracker shows wrong daily total",
        description: "The daily calorie total is not resetting at midnight. Timezone handling issue.",
        status: "Open",
        priority: "Low",
        type: "Bug",
        platform: "Mobile",
        projectId: project2.id,
        creatorId: dev2.id,
        assignedToId: null,
      },
    }),
  ]);

  console.log(`✅ ${tickets.length} Tickets created`);

  // ─── Comments ────────────────────────────────────────
  await prisma.comment.createMany({
    data: [
      {
        text: "I can reproduce this consistently on Chrome. Will push a fix today.",
        ticketId: tickets[0].id,
        authorId: dev1.id,
      },
      {
        text: "Dark mode toggle is working! Just need to wire up the persistence layer.",
        ticketId: tickets[1].id,
        authorId: dev2.id,
      },
    ],
  });

  console.log("✅ Comments created");
  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
