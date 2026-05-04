const { z } = require('zod');

const SalaryIngestSchema = z.object({
  company: z.string().min(1).transform((s) => s.trim().toLowerCase()),
  role: z.string().min(1),
  level_standardized: z.enum(["L3", "L4", "L5"]),
  location: z.string().min(1),
  experience_years: z.number().int().min(0),
  base_salary: z.number().positive(),
  bonus: z.number().min(0).default(0),
  stock: z.number().min(0).default(0),
  confidence: z.number().min(0).max(100).default(100),
});

const SalaryFilterSchema = z.object({
  company: z.string().optional(),
  role: z.string().optional(),
  level: z.string().optional(),
  location: z.string().optional(),
  sortBy: z.enum(["totalCompensation", "createdAt", "experienceYears"]).default("totalCompensation"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

module.exports = { SalaryIngestSchema, SalaryFilterSchema };
