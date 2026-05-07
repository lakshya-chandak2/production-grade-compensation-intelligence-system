"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Zap, Scale, BarChart3 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/lib/api";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
} from "recharts";

function ComparisonContent() {
  const searchParams = useSearchParams();
  const id1 = searchParams.get("id1");
  const id2 = searchParams.get("id2");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id1 && id2) {
      const fetchData = async () => {
        const res = await fetch(`${API_BASE_URL}/api/compare?id1=${id1}&id2=${id2}`);
        const json = await res.json();
        setData(json);
        setLoading(false);
      };
      fetchData();
    }
  }, [id1, id2]);

  if (!id1 || !id2) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Scale size={40} className="text-slate-300 mb-4" />
      <h1 className="text-xl font-semibold text-slate-800">No Comparison Selected</h1>
      <p className="text-slate-500 mt-2 text-sm">Go to the dashboard and select two salaries to compare.</p>
      <Link href="/" className="mt-6 px-5 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-dark transition-colors">
        Back to Dashboard
      </Link>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="spinner" />
    </div>
  );

  const [s1, s2] = data.comparison;

  const chartData = [
    {
      name: s1.company,
      Base: s1.baseSalary,
      Bonus: s1.bonus,
      Stock: s1.stock,
    },
    {
      name: s2.company,
      Base: s2.baseSalary,
      Bonus: s2.bonus,
      Stock: s2.stock,
    }
  ];

  const ComparisonRow = ({ label, val1, val2, suffix = "" }: any) => {
    const v1 = typeof val1 === 'number' ? val1 : 0;
    const v2 = typeof val2 === 'number' ? val2 : 0;
    const diff = v1 - v2;
    const isPositive = diff > 0;

    return (
      <div className="grid grid-cols-3 py-4 border-b border-slate-100 items-center">
        <div className="text-slate-500 font-medium text-sm">{label}</div>
        <div className="text-center">
          <div className="text-lg font-semibold text-slate-900">{typeof val1 === 'number' ? `${suffix}${val1.toLocaleString()}` : val1}</div>
        </div>
        <div className="text-center relative">
          <div className="text-lg font-semibold text-slate-900">{typeof val2 === 'number' ? `${suffix}${val2.toLocaleString()}` : val2}</div>
          {typeof val1 === 'number' && diff !== 0 && (
            <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
              {isPositive ? '+' : ''}{diff.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      
      {/* Header */}
      <header className="space-y-3">
        <Link href="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Scale className="text-primary" size={24} /> Salary Comparison
        </h1>
      </header>

      {/* Company Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 text-center relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
          <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-4 text-xl font-black text-primary shadow-sm">
            {s1.company[0]}
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{s1.company}</h3>
          <p className="text-slate-500 text-sm font-medium mt-1">{s1.role}</p>
          <div className="mt-4 flex justify-center">
            <span className="badge badge-primary">Level {s1.level}</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card p-8 text-center relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
          <div className="w-14 h-14 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center mx-auto mb-4 text-xl font-black text-accent shadow-sm">
            {s2.company[0]}
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{s2.company}</h3>
          <p className="text-slate-500 text-sm font-medium mt-1">{s2.role}</p>
          <div className="mt-4 flex justify-center">
            <span className="badge badge-accent">Level {s2.level}</span>
          </div>
        </motion.div>
      </section>

      {/* Chart */}
      <section className="card p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-5 flex items-center gap-2">
          <BarChart3 size={16} className="text-slate-400" /> Financial Breakdown
        </h2>
        <div className="h-[250px] md:h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 30 }}>
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                width={80}
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px', 
                  fontSize: '13px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                wrapperStyle={{ fontSize: '12px', marginBottom: '10px' }} 
              />
              <Bar dataKey="Base" stackId="a" fill="#4f46e5" radius={[0, 0, 0, 0]} barSize={32} />
              <Bar dataKey="Bonus" stackId="a" fill="#818cf8" />
              <Bar dataKey="Stock" stackId="a" fill="#f43f5e" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Comparison Table */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Component Analysis</h2>
        
        <div>
          <div className="grid grid-cols-3 py-3 border-b border-slate-200 items-center">
            <div className="text-xs text-slate-400 font-medium">Metric</div>
            <div className="text-center text-xs text-slate-400 font-medium">{s1.company}</div>
            <div className="text-center text-xs text-slate-400 font-medium">{s2.company}</div>
          </div>
          <ComparisonRow label="Base Salary" val1={s1.baseSalary} val2={s2.baseSalary} suffix="$" />
          <ComparisonRow label="Annual Bonus" val1={s1.bonus} val2={s2.bonus} suffix="$" />
          <ComparisonRow label="Stock Options" val1={s1.stock} val2={s2.stock} suffix="$" />
          <ComparisonRow label="Experience" val1={s1.experienceYears} val2={s2.experienceYears} suffix="" />
        </div>
        
        {/* Total Comp Summary */}
        <div className="flex flex-col md:grid md:grid-cols-3 py-6 items-center bg-slate-50 -mx-6 px-6 rounded-b-xl border-t border-slate-200 mt-4 gap-4 md:gap-0">
          <div className="text-primary font-semibold text-sm flex items-center gap-2">
            <Zap size={16} /> Total Compensation
          </div>
          <div className="text-center text-2xl md:text-3xl font-bold text-slate-900">${s1.totalCompensation.toLocaleString()}</div>
          <div className="text-center text-2xl md:text-3xl font-bold text-slate-900">${s2.totalCompensation.toLocaleString()}</div>
        </div>
      </div>
      
      {/* Differential Summary */}
      <div className="card text-center p-12 bg-slate-900 text-white border-none shadow-2xl">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Compensation Differential</p>
        <h2 className={`text-4xl md:text-6xl font-black tracking-tighter ${data.analysis.totalCompensationDiff > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {data.analysis.totalCompensationDiff > 0 ? '+' : ''}${Math.abs(data.analysis.totalCompensationDiff).toLocaleString()}
        </h2>
        <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
          <div className={`w-2.5 h-2.5 rounded-full ${data.analysis.totalCompensationDiff > 0 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.5)]'}`} />
          <p className="text-white text-base font-bold">
            {Math.abs(data.analysis.percentDiff).toFixed(1)}% {data.analysis.totalCompensationDiff > 0 ? 'higher' : 'lower'}
          </p>
        </div>
      </div>
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="spinner" /></div>}>
      <ComparisonContent />
    </Suspense>
  );
}
