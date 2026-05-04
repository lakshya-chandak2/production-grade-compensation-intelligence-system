import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LEVEL_MAP: Record<string, number> = { L3: 3, L4: 4, L5: 5 };

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id1 = searchParams.get("id1");
    const id2 = searchParams.get("id2");

    if (!id1 || !id2) {
      return NextResponse.json(
        { error: "Two salary IDs are required for comparison" },
        { status: 400 }
      );
    }

    const [salary1, salary2] = await Promise.all([
      prisma.salary.findUnique({ where: { id: id1 } }),
      prisma.salary.findUnique({ where: { id: id2 } }),
    ]);

    if (!salary1 || !salary2) {
      return NextResponse.json(
        { error: "One or both salary entries not found" },
        { status: 404 }
      );
    }

    const tcDiff = salary1.totalCompensation - salary2.totalCompensation;
    const levelNum1 = LEVEL_MAP[salary1.level] || 0;
    const levelNum2 = LEVEL_MAP[salary2.level] || 0;

    return NextResponse.json({
      comparison: [salary1, salary2],
      analysis: {
        totalCompensationDiff: tcDiff,
        percentDiff: salary2.totalCompensation !== 0
          ? (tcDiff / salary2.totalCompensation) * 100
          : 0,
        levelDiff: levelNum1 - levelNum2,
        baseDiff: salary1.baseSalary - salary2.baseSalary,
        bonusDiff: salary1.bonus - salary2.bonus,
        stockDiff: salary1.stock - salary2.stock,
      },
    });
  } catch (error) {
    console.error("Comparison error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
