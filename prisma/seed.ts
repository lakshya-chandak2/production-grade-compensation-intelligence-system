import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.salary.deleteMany({});

  const salaries = [
    // Google — full L3-L5 coverage
    { company: "google", role: "Software Engineer", level: "L3", location: "Mountain View, CA", experienceYears: 1, baseSalary: 140000, bonus: 20000, stock: 40000, totalCompensation: 200000, confidenceScore: 95 },
    { company: "google", role: "Software Engineer", level: "L4", location: "Mountain View, CA", experienceYears: 3, baseSalary: 170000, bonus: 25000, stock: 80000, totalCompensation: 275000, confidenceScore: 92 },
    { company: "google", role: "Software Engineer", level: "L5", location: "Mountain View, CA", experienceYears: 7, baseSalary: 210000, bonus: 30000, stock: 120000, totalCompensation: 360000, confidenceScore: 90 },
    { company: "google", role: "Software Engineer", level: "L4", location: "Bangalore, IN", experienceYears: 4, baseSalary: 45000, bonus: 5000, stock: 20000, totalCompensation: 70000, confidenceScore: 88 },
    { company: "google", role: "Software Engineer", level: "L5", location: "Bangalore, IN", experienceYears: 8, baseSalary: 65000, bonus: 10000, stock: 40000, totalCompensation: 115000, confidenceScore: 85 },

    // Meta — stock-heavy
    { company: "meta", role: "Software Engineer", level: "L3", location: "Menlo Park, CA", experienceYears: 0, baseSalary: 130000, bonus: 15000, stock: 50000, totalCompensation: 195000, confidenceScore: 93 },
    { company: "meta", role: "Software Engineer", level: "L4", location: "Menlo Park, CA", experienceYears: 3, baseSalary: 165000, bonus: 15000, stock: 70000, totalCompensation: 250000, confidenceScore: 92 },
    { company: "meta", role: "Software Engineer", level: "L5", location: "Menlo Park, CA", experienceYears: 6, baseSalary: 200000, bonus: 30000, stock: 150000, totalCompensation: 380000, confidenceScore: 90 },
    { company: "meta", role: "Data Engineer", level: "L4", location: "London, UK", experienceYears: 4, baseSalary: 120000, bonus: 12000, stock: 55000, totalCompensation: 187000, confidenceScore: 87 },

    // Amazon — base-heavy, stock vests over time
    { company: "amazon", role: "Software Engineer", level: "L4", location: "Seattle, WA", experienceYears: 2, baseSalary: 160000, bonus: 30000, stock: 30000, totalCompensation: 220000, confidenceScore: 91 },
    { company: "amazon", role: "Software Engineer", level: "L5", location: "Seattle, WA", experienceYears: 5, baseSalary: 180000, bonus: 40000, stock: 120000, totalCompensation: 340000, confidenceScore: 88 },
    { company: "amazon", role: "Software Engineer", level: "L3", location: "Hyderabad, IN", experienceYears: 1, baseSalary: 30000, bonus: 5000, stock: 8000, totalCompensation: 43000, confidenceScore: 86 },
    { company: "amazon", role: "Software Engineer", level: "L4", location: "Hyderabad, IN", experienceYears: 4, baseSalary: 42000, bonus: 8000, stock: 15000, totalCompensation: 65000, confidenceScore: 84 },

    // Apple
    { company: "apple", role: "Software Engineer", level: "L3", location: "Cupertino, CA", experienceYears: 1, baseSalary: 145000, bonus: 25000, stock: 45000, totalCompensation: 215000, confidenceScore: 89 },
    { company: "apple", role: "Software Engineer", level: "L4", location: "Cupertino, CA", experienceYears: 4, baseSalary: 180000, bonus: 35000, stock: 80000, totalCompensation: 295000, confidenceScore: 87 },
    { company: "apple", role: "Software Engineer", level: "L5", location: "Cupertino, CA", experienceYears: 8, baseSalary: 220000, bonus: 45000, stock: 140000, totalCompensation: 405000, confidenceScore: 85 },

    // Microsoft
    { company: "microsoft", role: "Software Engineer", level: "L3", location: "Redmond, WA", experienceYears: 0, baseSalary: 120000, bonus: 15000, stock: 30000, totalCompensation: 165000, confidenceScore: 94 },
    { company: "microsoft", role: "Software Engineer", level: "L4", location: "Redmond, WA", experienceYears: 3, baseSalary: 155000, bonus: 20000, stock: 55000, totalCompensation: 230000, confidenceScore: 91 },
    { company: "microsoft", role: "Software Engineer", level: "L5", location: "Redmond, WA", experienceYears: 7, baseSalary: 190000, bonus: 30000, stock: 100000, totalCompensation: 320000, confidenceScore: 89 },
    { company: "microsoft", role: "Software Engineer", level: "L4", location: "Bangalore, IN", experienceYears: 3, baseSalary: 38000, bonus: 5000, stock: 12000, totalCompensation: 55000, confidenceScore: 90 },

    // Netflix — base-only, no bonus/stock
    { company: "netflix", role: "Senior Software Engineer", level: "L5", location: "Los Gatos, CA", experienceYears: 8, baseSalary: 550000, bonus: 0, stock: 0, totalCompensation: 550000, confidenceScore: 98 },
    { company: "netflix", role: "Software Engineer", level: "L4", location: "Los Gatos, CA", experienceYears: 4, baseSalary: 400000, bonus: 0, stock: 0, totalCompensation: 400000, confidenceScore: 96 },
    { company: "netflix", role: "Software Engineer", level: "L3", location: "Los Angeles, CA", experienceYears: 1, baseSalary: 250000, bonus: 0, stock: 0, totalCompensation: 250000, confidenceScore: 94 },

    // Uber
    { company: "uber", role: "Software Engineer", level: "L3", location: "San Francisco, CA", experienceYears: 1, baseSalary: 130000, bonus: 15000, stock: 35000, totalCompensation: 180000, confidenceScore: 88 },
    { company: "uber", role: "Software Engineer", level: "L4", location: "San Francisco, CA", experienceYears: 3, baseSalary: 160000, bonus: 20000, stock: 60000, totalCompensation: 240000, confidenceScore: 86 },
    { company: "uber", role: "Software Engineer", level: "L5", location: "San Francisco, CA", experienceYears: 6, baseSalary: 200000, bonus: 30000, stock: 100000, totalCompensation: 330000, confidenceScore: 84 },

    // Stripe
    { company: "stripe", role: "Software Engineer", level: "L3", location: "San Francisco, CA", experienceYears: 0, baseSalary: 140000, bonus: 10000, stock: 50000, totalCompensation: 200000, confidenceScore: 87 },
    { company: "stripe", role: "Software Engineer", level: "L4", location: "San Francisco, CA", experienceYears: 3, baseSalary: 175000, bonus: 20000, stock: 80000, totalCompensation: 275000, confidenceScore: 85 },
    { company: "stripe", role: "Software Engineer", level: "L5", location: "Seattle, WA", experienceYears: 7, baseSalary: 210000, bonus: 30000, stock: 130000, totalCompensation: 370000, confidenceScore: 83 },

    // Flipkart (India)
    { company: "flipkart", role: "Software Engineer", level: "L3", location: "Bangalore, IN", experienceYears: 1, baseSalary: 22000, bonus: 2000, stock: 5000, totalCompensation: 29000, confidenceScore: 85 },
    { company: "flipkart", role: "Software Engineer", level: "L4", location: "Bangalore, IN", experienceYears: 4, baseSalary: 35000, bonus: 5000, stock: 10000, totalCompensation: 50000, confidenceScore: 82 },
    { company: "flipkart", role: "Software Engineer", level: "L5", location: "Bangalore, IN", experienceYears: 7, baseSalary: 52000, bonus: 8000, stock: 20000, totalCompensation: 80000, confidenceScore: 80 },

    // Razorpay (India)
    { company: "razorpay", role: "Software Engineer", level: "L3", location: "Bangalore, IN", experienceYears: 0, baseSalary: 18000, bonus: 2000, stock: 3000, totalCompensation: 23000, confidenceScore: 82 },
    { company: "razorpay", role: "Software Engineer", level: "L4", location: "Bangalore, IN", experienceYears: 3, baseSalary: 28000, bonus: 4000, stock: 8000, totalCompensation: 40000, confidenceScore: 80 },
    { company: "razorpay", role: "Backend Engineer", level: "L5", location: "Bangalore, IN", experienceYears: 6, baseSalary: 42000, bonus: 6000, stock: 15000, totalCompensation: 63000, confidenceScore: 78 },
  ];

  for (const s of salaries) {
    await prisma.salary.create({ data: s });
  }

  console.log(`Seeded ${salaries.length} salary records across ${new Set(salaries.map(s => s.company)).size} companies`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
