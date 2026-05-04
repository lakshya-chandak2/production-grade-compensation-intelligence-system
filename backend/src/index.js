require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { prisma } = require('./lib/prisma');
const { SalaryIngestSchema, SalaryFilterSchema } = require('./lib/validations');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ FIXED CORS (frontend-safe)
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

app.use(express.json());

/* ---------------- HEALTH CHECK ---------------- */
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "Backend running fine 🚀" });
});

/* ---------------- GET SALARIES ---------------- */
app.get('/api/salaries', async (req, res) => {
  try {
    const params = {
      company: req.query.company || undefined,
      role: req.query.role || undefined,
      level: req.query.level || undefined,
      location: req.query.location || undefined,
      sortBy: req.query.sortBy || "totalCompensation",
      sortOrder: req.query.sortOrder || "desc",
    };

    const validated = SalaryFilterSchema.parse(params);

    const where = {};
    if (validated.company) {
      where.company = { contains: validated.company.toLowerCase() };
    }
    if (validated.role) where.role = { contains: validated.role };
    if (validated.level) where.level = validated.level;
    if (validated.location) where.location = { contains: validated.location };

    const salaries = await prisma.salary.findMany({
      where,
      orderBy: {
        [validated.sortBy]: validated.sortOrder,
      },
    });

    res.json(salaries);
  } catch (error) {
    console.error("Fetch salaries error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ---------------- INGEST SALARY ---------------- */
app.post('/api/ingest-salary', async (req, res) => {
  try {
    const result = SalaryIngestSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid data format",
        details: result.error.format()
      });
    }

    const data = result.data;
    const totalCompensation = data.base_salary + data.bonus + data.stock;

    const existing = await prisma.salary.findFirst({
      where: {
        company: data.company,
        role: data.role,
        level: data.level_standardized,
        location: data.location,
        baseSalary: data.base_salary,
      },
    });

    if (existing) {
      return res.status(409).json({
        error: "Duplicate entry detected",
        existingId: existing.id
      });
    }

    const salary = await prisma.salary.create({
      data: {
        company: data.company,
        role: data.role,
        level: data.level_standardized,
        location: data.location,
        experienceYears: data.experience_years,
        baseSalary: data.base_salary,
        bonus: data.bonus,
        stock: data.stock,
        totalCompensation,
        confidenceScore: data.confidence,
      },
    });

    res.status(201).json(salary);
  } catch (error) {
    console.error("Ingestion error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ---------------- COMPANY STATS ---------------- */
app.get('/api/company/:name', async (req, res) => {
  try {
    const companyName = req.params.name.toLowerCase();

    const salaries = await prisma.salary.findMany({
      where: { company: companyName },
      orderBy: { totalCompensation: "desc" },
    });

    if (salaries.length === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    const sortedTC = salaries.map(s => s.totalCompensation).sort((a, b) => a - b);
    const mid = Math.floor(sortedTC.length / 2);

    const medianTC =
      sortedTC.length % 2 !== 0
        ? sortedTC[mid]
        : (sortedTC[mid - 1] + sortedTC[mid]) / 2;

    const levelDist = salaries.reduce((acc, curr) => {
      acc[curr.level] = (acc[curr.level] || 0) + 1;
      return acc;
    }, {});

    res.json({
      company: companyName,
      salaries,
      stats: {
        count: salaries.length,
        medianTotalCompensation: medianTC,
        levelDistribution: levelDist,
      },
    });
  } catch (error) {
    console.error("Company stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ---------------- COMPARE ---------------- */
app.get('/api/compare', async (req, res) => {
  try {
    const { id1, id2 } = req.query;

    if (!id1 || !id2) {
      return res.status(400).json({ error: "Two salary IDs required" });
    }

    const [salary1, salary2] = await Promise.all([
      prisma.salary.findUnique({ where: { id: id1 } }),
      prisma.salary.findUnique({ where: { id: id2 } }),
    ]);

    if (!salary1 || !salary2) {
      return res.status(404).json({ error: "Salary not found" });
    }

    const tcDiff = salary1.totalCompensation - salary2.totalCompensation;

    const LEVEL_MAP = { L3: 3, L4: 4, L5: 5 };
    const levelDiff =
      (LEVEL_MAP[salary1.level] || 0) - (LEVEL_MAP[salary2.level] || 0);

    res.json({
      comparison: [salary1, salary2],
      analysis: {
        totalCompensationDiff: tcDiff,
        percentDiff:
          salary2.totalCompensation !== 0
            ? (tcDiff / salary2.totalCompensation) * 100
            : 0,
        levelDiff,
        baseDiff: salary1.baseSalary - salary2.baseSalary,
        bonusDiff: salary1.bonus - salary2.bonus,
        stockDiff: salary1.stock - salary2.stock,
      },
    });
  } catch (error) {
    console.error("Comparison error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ---------------- SERVER START ---------------- */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});