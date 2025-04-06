import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create initial categories
  const categories = [
    {
      name: "AI Research",
      slug: "ai-research",
      description: "Mistakes and learnings in AI research",
    },
    {
      name: "Leadership",
      slug: "leadership",
      description: "Management and leadership failures in scientific contexts",
    },
    {
      name: "Publishing",
      slug: "publishing",
      description: "Publication and peer review issues",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log("Database has been seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
