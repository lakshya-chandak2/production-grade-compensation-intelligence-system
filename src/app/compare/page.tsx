"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Zap, Scale, BarChart3, PieChart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell
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
        const res = await fetch(`/api/compare?id1=${id1}&id2=${id2}`);
        const json = await res.json();
        setData(json);
        setLoading(false);
      };
      fetchData();
    }
  }, [id1, id2]);

  if (!id1 || !id2) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <Scale size={48} className="text-slate-700 mb-4" />
      <h1 className="text-2xl font-bold">No Comparison Selected</h1>
      <p className="text-slate-400 mt-2">Go to the dashboard and select two salaries to compare.</p>
      <Link href="/" className="mt-6 px-6 py-3 bg-primary rounded-xl font-bold hover:bg-primary-dark transition-colors">
        Back to Dashboard
      </Link>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-16 h-[2px] bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-white translate-x-[-100%] animate-[scanline_2s_ease-in-out_infinite]" />
      </div>
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
      <div className="grid grid-cols-3 py-6 border-b border-slate-800 items-center">
        <div className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">{label}</div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{typeof val1 === 'number' ? `${suffix}${val1.toLocaleString()}` : val1}</div>
        </div>
        <div className="text-center relative">
          <div className="text-2xl font-bold text-white">{typeof val2 === 'number' ? `${suffix}${val2.toLocaleString()}` : val2}</div>
          {typeof val1 === 'number' && diff !== 0 && (
            <div className={`absolute -right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-1 rounded ${isPositive ? 'bg-success/10 text-success' : 'bg-red-500/10 text-red-400'}`}>
              {isPositive ? '+' : ''}{diff.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto space-y-12 text-slate-200 relative">
      <div className="scanline" />
      
      <header className="space-y-4 relative z-10">
        <Link href="/" className="flex items-center gap-2 text-primary/50 hover:text-primary transition-colors text-xs font-bold tracking-widest uppercase">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <h1 className="text-5xl font-black flex items-center gap-4 glow-text italic">
          <Scale className="text-primary" size={42} /> Compensation Comparison <span className="text-primary">v2.0</span>
        </h1>
      </header>

      <section className="grid grid-cols-3 gap-8 mb-8 relative z-10">
        <div className="flex items-center">
          <div className="h-[1px] flex-1 bg-primary/20" />
          <div className="px-4 text-[10px] font-mono text-primary/40 uppercase tracking-[0.3em]">Selection</div>
          <div className="h-[1px] flex-1 bg-primary/20" />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-3xl text-center border-t-2 border-primary glow-blue"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-2xl font-black uppercase text-primary">
            {s1.company[0]}
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">{s1.company}</h3>
          <p className="text-slate-500 text-xs font-mono mt-1 uppercase">{s1.role}</p>
          <div className="mt-6 px-4 py-1.5 bg-primary/10 text-primary rounded border border-primary/20 text-[10px] font-black tracking-widest uppercase">
            Level {s1.level}
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 rounded-3xl text-center border-t-2 border-accent shadow-[0_0_30px_rgba(255,0,255,0.1)]"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4 text-2xl font-black uppercase text-accent">
            {s2.company[0]}
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">{s2.company}</h3>
          <p className="text-slate-500 text-xs font-mono mt-1 uppercase">{s2.role}</p>
          <div className="mt-6 px-4 py-1.5 bg-accent/10 text-accent rounded border border-accent/20 text-[10px] font-black tracking-widest uppercase">
            Level {s2.level}
          </div>
        </motion.div>
      </section>

      <section className="glass p-10 rounded-3xl relative z-10 border-primary/5">
        <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-primary mb-8 flex items-center gap-3">
          <BarChart3 size={18} /> Financial Breakdown
        </h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 50, right: 50 }}>
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                width={80}
              />
              <Tooltip 
                cursor={{ fill: '#00f2ff', opacity: 0.05 }}
                contentStyle={{ backgroundColor: '#050505', border: '1px solid #00f2ff33', borderRadius: '4px', fontSize: '10px', fontFamily: 'monospace' }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', marginBottom: '20px' }} />
              <Bar dataKey="Base" stackId="a" fill="#00f2ff" radius={[0, 0, 0, 0]} barSize={40} />
              <Bar dataKey="Bonus" stackId="a" fill="#ff00ff" />
              <Bar dataKey="Stock" stackId="a" fill="#00ff41" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="glass rounded-3xl p-10 relative z-10 border-primary/5">
        <div className="space-y-2 mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-primary">Component Analysis</h2>
          <div className="h-[1px] w-full bg-gradient-to-r from-primary/50 to-transparent" />
        </div>
        
        <ComparisonRow label="Base Salary" val1={s1.baseSalary} val2={s2.baseSalary} suffix="$" />
        <ComparisonRow label="Annual Bonus" val1={s1.bonus} val2={s2.bonus} suffix="$" />
        <ComparisonRow label="Stock Options" val1={s1.stock} val2={s2.stock} suffix="$" />
        <ComparisonRow label="Experience" val1={s1.experienceYears} val2={s2.experienceYears} suffix=" Yrs" />
        
        <div className="grid grid-cols-3 py-12 items-center bg-primary/5 -mx-10 px-10 rounded-b-3xl border-t border-primary/10">
          <div className="text-primary font-black uppercase text-xs tracking-[0.3em] flex items-center gap-3">
            <Zap size={20} className="animate-pulse" /> Total Compensation
          </div>
          <div className="text-center text-5xl font-black text-white glow-text italic tracking-tighter">${s1.totalCompensation.toLocaleString()}</div>
          <div className="text-center text-5xl font-black text-white glow-text italic tracking-tighter">${s2.totalCompensation.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="text-center p-12 bg-black/60 rounded-[40px] border border-primary/10 relative z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
        <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.5em] mb-4">Compensation Differential</p>
        <h2 className={`text-7xl font-black italic tracking-tighter ${data.analysis.totalCompensationDiff > 0 ? 'text-success' : 'text-red-500'}`}>
          {data.analysis.totalCompensationDiff > 0 ? '+' : ''}{data.analysis.totalCompensationDiff.toLocaleString()}
        </h2>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 rounded border border-slate-800">
          <div className={`w-2 h-2 rounded-full ${data.analysis.totalCompensationDiff > 0 ? 'bg-success animate-ping' : 'bg-red-500'}`} />
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">{Math.abs(data.analysis.percentDiff).toFixed(1)}% {data.analysis.totalCompensationDiff > 0 ? 'higher' : 'lower'}</p>
        </div>
      </div>
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0f172a]"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <ComparisonContent />
    </Suspense>
  );
}
