import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const companyName = name.toLowerCase();

    const salaries = await prisma.salary.findMany({
      where: { company: companyName },
      orderBy: { totalCompensation: "desc" },
    });

    if (salaries.length === 0) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Compute median
    const sortedTC = salaries
      .map((s) => s.totalCompensation)
      .sort((a, b) => a - b);
    const mid = Math.floor(sortedTC.length / 2);
    const medianTC =
      sortedTC.length % 2 !== 0
        ? sortedTC[mid]
        : (sortedTC[mid - 1] + sortedTC[mid]) / 2;

    // Level distribution
    const levelDist = salaries.reduce((acc: any, curr) => {
      acc[curr.level] = (acc[curr.level] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      company: name,
      salaries,
      stats: {
        count: salaries.length,
        medianTotalCompensation: medianTC,
        levelDistribution: levelDist,
      },
    });
  } catch (error) {
    console.error("Company stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
