"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
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
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!data || data.error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="text-primary font-mono mb-4">[ERROR_NODE_NOT_FOUND]</div>
      <h1 className="text-2xl font-black uppercase tracking-tighter">Access Denied</h1>
      <Link href="/" className="mt-8 px-8 py-3 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all font-bold uppercase tracking-widest text-xs">
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
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8 md:space-y-12 text-slate-200 relative">
      <div className="scanline" />
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 relative z-10 pt-16 md:pt-0">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 text-primary/50 hover:text-primary transition-colors text-xs font-bold tracking-widest uppercase">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl md:text-3xl font-black text-primary uppercase">
              {data.company[0]}
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black uppercase tracking-tighter glow-text leading-tight"
            >
              {data.company}
            </motion.h1>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-none">
            <StatCard 
              title="Median Comp" 
              value={`$${data.stats.medianTotalCompensation.toLocaleString()}`} 
              icon={DollarSign}
            />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs md:text-sm font-bold flex items-center gap-3 uppercase tracking-[0.4em] text-primary">
              <BarChart3 size={16} /> Level Distribution
            </h2>
            <div className="text-[9px] md:text-[10px] font-mono text-slate-500 uppercase">Live Data</div>
          </div>
          <div className="glass p-6 md:p-10 rounded-3xl h-[350px] md:h-[450px] border-primary/10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f2ff" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#ff00ff" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="level" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#00f2ff', opacity: 0.05 }}
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid #00f2ff33', borderRadius: '4px', fontSize: '10px', fontFamily: 'monospace' }}
                />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} barSize={40} className="md:barSize-[60]" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xs md:text-sm font-bold flex items-center gap-3 uppercase tracking-[0.4em] text-accent">
            <TrendingUp size={16} /> Key Insights
          </h2>
          <div className="glass p-6 md:p-8 rounded-3xl space-y-6 md:space-y-8 border-accent/10">
            <div>
              <p className="text-slate-500 text-[9px] md:text-[10px] uppercase tracking-widest mb-1">Total Records</p>
              <p className="text-3xl md:text-4xl font-black text-white leading-none">{data.stats.count}</p>
            </div>
            <div className="h-[1px] bg-slate-800 w-full" />
            <div>
              <p className="text-slate-500 text-[9px] md:text-[10px] uppercase tracking-widest mb-1">Top Level</p>
              <p className="text-3xl md:text-4xl font-black text-accent leading-none">
                {Object.entries(data.stats.levelDistribution).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "N/A"}
              </p>
            </div>
            <div className="h-[1px] bg-slate-800 w-full" />
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-2">Note</p>
              <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed font-mono">
                Data reflects current Level {Object.entries(data.stats.levelDistribution).sort((a: any, b: any) => b[1] - a[1])[0]?.[0]} dominance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 relative z-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-slate-500">Individual Records</h2>
        <SalaryTable salaries={restrictedSalaries} />
      </section>
    </main>
  );
}
