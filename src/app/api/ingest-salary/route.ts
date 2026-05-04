import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SalaryIngestSchema } from "@/lib/validations/salary";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Strict validation
    const result = SalaryIngestSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data format", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Compute total compensation
    const totalCompensation = data.base_salary + data.bonus + data.stock;

    // Duplicate detection: same company + role + level + location + baseSalary
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
      return NextResponse.json(
        { error: "Duplicate entry detected", existingId: existing.id },
        { status: 409 }
      );
    }

    // Store in DB
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

    return NextResponse.json(salary, { status: 201 });
  } catch (error) {
    console.error("Ingestion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
