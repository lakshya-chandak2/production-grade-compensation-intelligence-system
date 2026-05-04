"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Filter, TrendingUp, Users, Building2, MapPin } from "lucide-react";
import { StatCard, SalaryTable } from "@/components/dashboard";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/lib/api";


import { SubmitSalaryModal } from "@/components/submit-modal";

function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export default function Home() {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [filters, setFilters] = useState({
    company: "",
    role: "",
    level: "",
    location: "",
    sortBy: "totalCompensation",
    sortOrder: "desc" as "asc" | "desc",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchSalaries = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.company) params.append("company", filters.company);
    if (filters.level) params.append("level", filters.level);
    if (filters.role) params.append("role", filters.role);
    if (filters.location) params.append("location", filters.location);
    params.append("sortBy", filters.sortBy);
    params.append("sortOrder", filters.sortOrder);
    
    const res = await fetch(`${API_BASE_URL}/api/salaries?${params.toString()}`);

    const data = await res.json();
    
    // Strict requirement: Only L3, L4, L5 breakdown
    const restrictedData = data.filter((s: any) => ["L3", "L4", "L5"].includes(s.level));
    
    setSalaries(restrictedData);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSalaries();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [filters]);

  const medianTC = useMemo(() => {
    return computeMedian(salaries.map((s: any) => s.totalCompensation));
  }, [salaries]);

  const stats = [
    { title: "Total Entries", value: salaries.length, icon: Users, trend: "ACTIVE" },
    { title: "Median Compensation", value: salaries.length > 0 ? `$${Math.round(medianTC).toLocaleString()}` : "$0", icon: TrendingUp },
    { title: "Companies", value: new Set(salaries.map((s: any) => s.company)).size, icon: Building2 },
    { title: "Standard Levels", value: "L3 | L4 | L5", icon: Filter },
  ];

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8 md:space-y-12 text-slate-200 relative overflow-x-hidden">

      <div className="scanline" />
      
      <SubmitSalaryModal 
        isOpen={isSubmitOpen} 
        onClose={() => setIsSubmitOpen(false)} 
        onSuccess={fetchSalaries}
      />

      <header className="space-y-4 relative z-10 pt-16 md:pt-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-[1px] w-12 bg-primary" />
              <span className="text-primary text-[10px] font-black tracking-[0.5em] uppercase">Intelligence Engine</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter glow-text italic leading-tight md:leading-none uppercase">
              Comp Intelligence <span className="text-primary underline decoration-accent decoration-2 md:decoration-4 underline-offset-4 md:underline-offset-8 italic">v2.0</span>
            </h1>
            <p className="text-slate-500 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] mt-4 md:mt-6 flex items-center gap-4">
              <span className="inline-block w-2 h-2 bg-success rounded-full animate-ping" />
              L3-L5 Standardized Salary Matrix
            </p>
          </motion.div>
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
            <button 
              onClick={() => setIsSubmitOpen(true)}
              className="bg-primary/10 border border-primary/20 text-primary px-4 md:px-8 py-3 rounded-2xl font-black text-[10px] md:text-xs tracking-widest hover:bg-primary/20 transition-all active:scale-95"
            >
              + CONTRIBUTE DATA
            </button>
            <div className="hidden sm:block glass p-3 md:p-4 border-primary/10 rounded-xl">
               <div className="text-[8px] md:text-[10px] font-mono text-primary/40 uppercase mb-1 md:mb-2 tracking-widest">System Status</div>
               <div className="text-[7px] md:text-[9px] font-mono text-success space-y-0.5 md:space-y-1">
                 <div>&gt; Connection Secure</div>
                 <div>&gt; Database Synced</div>
               </div>
            </div>
          </div>
        </div>
      </header>


      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">

        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </section>

      <section className="space-y-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass p-6 rounded-3xl border-primary/20">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              value={filters.company}
              placeholder="Search by company name..."
              className="w-full pl-16 pr-6 py-5 bg-black/60 border border-primary/10 rounded-2xl focus:outline-none focus:border-primary/50 transition-all text-white placeholder:text-slate-800 font-mono text-sm tracking-tight"
              onChange={(e) => setFilters({ ...filters, company: e.target.value })}
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto relative">
            <div className="relative flex-1 md:w-48">
              <select
                value={filters.level}
                className="w-full px-8 py-5 bg-black/60 border border-primary/10 rounded-2xl focus:outline-none focus:border-primary/50 transition-all text-white appearance-none cursor-pointer font-black text-xs tracking-widest"
                onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              >
                <option value="">All Levels</option>
                <option value="L3">Level L3</option>
                <option value="L4">Level L4</option>
                <option value="L5">Level L5</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/50 text-[8px] font-black uppercase">select</div>
            </div>
            
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-black transition-all text-xs tracking-[0.2em] border ${isFilterOpen ? 'bg-accent text-white border-accent shadow-[0_0_30px_rgba(255,0,255,0.3)]' : 'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10'}`}
            >
              <Filter size={16} />
              {isFilterOpen ? 'Applied' : 'Filters'}
            </button>
          </div>
        </div>

        {isFilterOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="glass p-8 rounded-3xl grid grid-cols-1 md:grid-cols-4 gap-8 border-accent/20 overflow-hidden"
          >
            <div className="space-y-4">
              <label className="text-[10px] text-accent uppercase font-black tracking-[0.3em]">Sort Order</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilters({ ...filters, sortBy: "totalCompensation", sortOrder: "desc" })}
                  className={`px-4 py-3 rounded text-[10px] font-black tracking-widest flex-1 transition-all ${filters.sortBy === "totalCompensation" && filters.sortOrder === "desc" ? 'bg-accent text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}
                >
                  TC High to Low
                </button>
                <button 
                  onClick={() => setFilters({ ...filters, sortBy: "totalCompensation", sortOrder: "asc" })}
                  className={`px-4 py-3 rounded text-[10px] font-black tracking-widest flex-1 transition-all ${filters.sortBy === "totalCompensation" && filters.sortOrder === "asc" ? 'bg-accent text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}
                >
                  TC Low to High
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] text-accent uppercase font-black tracking-[0.3em]">Role Filter</label>
              <input
                type="text"
                value={filters.role}
                placeholder="Software Engineer..."
                className="w-full px-4 py-3 bg-black/40 border border-slate-800 rounded-lg focus:outline-none focus:border-accent/50 text-white text-xs font-mono"
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] text-accent uppercase font-black tracking-[0.3em]">Location</label>
              <input
                type="text"
                value={filters.location}
                placeholder="Mountain View, CA..."
                className="w-full px-4 py-3 bg-black/40 border border-slate-800 rounded-lg focus:outline-none focus:border-accent/50 text-white text-xs font-mono"
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>

            <div className="flex items-end pb-1 gap-4">
               <button 
                 onClick={() => setFilters({ ...filters, company: "", role: "", level: "", location: "" })}
                 className="text-[9px] font-black text-primary hover:text-white transition-colors uppercase tracking-[0.4em] bg-primary/10 px-3 py-1 rounded"
               >
                 Clear Filters
               </button>
               <button 
                 onClick={() => setFilters({ company: "", role: "", level: "", location: "", sortBy: "totalCompensation", sortOrder: "desc" })}
                 className="text-[9px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-[0.4em]"
               >
                 Reset All
               </button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-16 h-[2px] bg-primary relative overflow-hidden">
              <div className="absolute inset-0 bg-white translate-x-[-100%] animate-[scanline_2s_ease-in-out_infinite]" />
            </div>
          </div>
        ) : (
          <SalaryTable salaries={salaries} />
        )}
      </section>
    </main>
  );
}
