"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SalaryTable, StatCard } from "@/components/dashboard";
import { ArrowLeft, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/lib/api";


export default function CompanyPage() {
  const { name } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${API_BASE_URL}/api/company/${name}`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    fetchData();
  }, [name]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="spinner" />
    </div>
  );

  if (!data || data.error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <span className="text-2xl text-slate-400">?</span>
      </div>
      <h1 className="text-xl font-semibold text-slate-800">Company Not Found</h1>
      <p className="text-slate-500 text-sm mt-1.5">The company you&apos;re looking for doesn&apos;t exist in our database.</p>
      <Link href="/" className="mt-6 px-5 py-2.5 bg-primary text-white hover:bg-primary-dark transition-colors rounded-lg font-medium text-sm">
        Return to Dashboard
      </Link>
    </div>
  );

  // Filter for L3, L4, L5
  const restrictedSalaries = data.salaries.filter((s: any) => ["L3", "L4", "L5"].includes(s.level));
  const chartData = ["L3", "L4", "L5"].map(level => ({
    level,
    count: data.stats.levelDistribution[level] || 0,
  }));

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-primary transition-all text-xs font-bold uppercase tracking-widest">
            <ArrowLeft size={14} strokeWidth={3} /> Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl md:text-4xl font-black shadow-xl shadow-primary/20">
              {data.company[0]}
            </div>
            <div className="space-y-1">
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter"
              >
                {data.company}
              </motion.h1>
              <p className="text-slate-500 font-medium">Enterprise Technology Analytics</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-72">
          <StatCard 
            title="Median Total Comp" 
            value={`$${data.stats.medianTotalCompensation.toLocaleString()}`} 
            icon={DollarSign}
            trend="Market Leading"
          />
        </div>
      </header>

      {/* Chart + Insights */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <BarChart3 size={16} className="text-slate-400" /> Level Distribution
          </h2>
          <div className="card p-6 h-[350px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="level" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={8}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    fontSize: '13px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                  }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} barSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <TrendingUp size={16} className="text-slate-400" /> Key Insights
          </h2>
          <div className="card p-8 space-y-6">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Total Records</p>
              <p className="text-4xl font-black text-slate-900 tracking-tight">{data.stats.count}</p>
            </div>
            <div className="h-[1px] bg-slate-100/60 w-full" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Primary Level</p>
              <p className="text-4xl font-black text-primary tracking-tight">
                {Object.entries(data.stats.levelDistribution).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "N/A"}
              </p>
            </div>
            <div className="h-[1px] bg-slate-100/60 w-full" />
            <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-2">Market Insight</p>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Standardized level {Object.entries(data.stats.levelDistribution).sort((a: any, b: any) => b[1] - a[1])[0]?.[0]} represents the core engineering tier at {data.company}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Individual Records */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">Individual Records</h2>
        <SalaryTable salaries={restrictedSalaries} />
      </section>
    </main>
  );
}
