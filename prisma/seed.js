const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const salaries = [
    {
      company: "google",
      role: "Software Engineer",
      level: "L3",
      location: "Mountain View, CA",
      experienceYears: 0,
      baseSalary: 140000,
      bonus: 20000,
      stock: 40000,
      totalCompensation: 200000,
      confidenceScore: 95,
    },
    {
      company: "google",
      role: "Software Engineer",
      level: "L4",
      location: "Mountain View, CA",
      experienceYears: 3,
      baseSalary: 170000,
      bonus: 25000,
      stock: 80000,
      totalCompensation: 275000,
      confidenceScore: 90,
    },
    {
      company: "meta",
      role: "Software Engineer",
      level: "E4",
      location: "Menlo Park, CA",
      experienceYears: 2,
      baseSalary: 165000,
      bonus: 15000,
      stock: 70000,
      totalCompensation: 250000,
      confidenceScore: 92,
    },
    {
      company: "amazon",
      role: "Software Engineer",
      level: "L5",
      location: "Seattle, WA",
      experienceYears: 5,
      baseSalary: 180000,
      bonus: 40000,
      stock: 120000,
      totalCompensation: 340000,
      confidenceScore: 88,
    },
    {
      company: "netflix",
      role: "Senior Software Engineer",
      level: "L6",
      location: "Los Gatos, CA",
      experienceYears: 8,
      baseSalary: 550000,
      bonus: 0,
      stock: 0,
      totalCompensation: 550000,
      confidenceScore: 98,
    },
  ];

  for (const s of salaries) {
    await prisma.salary.create({ data: s });
  }

  console.log("Seeded database with sample data");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
