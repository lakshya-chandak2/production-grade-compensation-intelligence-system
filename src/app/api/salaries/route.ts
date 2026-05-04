import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SalaryFilterSchema } from "@/lib/validations/salary";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params = {
      company: searchParams.get("company") || undefined,
      role: searchParams.get("role") || undefined,
      level: searchParams.get("level") || undefined,
      location: searchParams.get("location") || undefined,
      sortBy: searchParams.get("sortBy") || "totalCompensation",
      sortOrder: searchParams.get("sortOrder") || "desc",
    };

    const validated = SalaryFilterSchema.parse(params);

    const where: any = {};
    if (validated.company) {
      where.company = {
        contains: validated.company.toLowerCase(),
      };
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

    return NextResponse.json(salaries);
  } catch (error) {
    console.error("Fetch salaries error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
