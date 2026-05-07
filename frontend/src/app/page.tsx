"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Filter, TrendingUp, Users, Building2, ChevronDown } from "lucide-react";
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
    { title: "Total Entries", value: salaries.length, icon: Users, trend: "Active" },
    { title: "Median Compensation", value: salaries.length > 0 ? `$${Math.round(medianTC).toLocaleString()}` : "$0", icon: TrendingUp },
    { title: "Companies", value: new Set(salaries.map((s: any) => s.company)).size, icon: Building2 },
    { title: "Standard Levels", value: "L3 · L4 · L5", icon: Filter },
  ];

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">

      <SubmitSalaryModal 
        isOpen={isSubmitOpen} 
        onClose={() => setIsSubmitOpen(false)} 
        onSuccess={fetchSalaries}
      />

      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Compensation <span className="text-primary">Intelligence</span>
            </h1>
            <p className="text-slate-500 text-base max-w-2xl">
              Access standardized, verified compensation data for L3–L5 engineering roles across top-tier technology firms.
            </p>
          </div>
          <button 
            onClick={() => setIsSubmitOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] w-fit"
          >
            <span className="text-xl leading-none font-light">+</span> Contribute Data
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </section>

      {/* Search & Filters */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              value={filters.company}
              placeholder="Search companies (e.g. Google, Meta)..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:ring-4 focus:ring-primary/5"
              onChange={(e) => setFilters({ ...filters, company: e.target.value })}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative min-w-[160px]">
              <select
                value={filters.level}
                className="w-full appearance-none px-4 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 cursor-pointer font-semibold shadow-sm transition-all hover:border-slate-300"
                onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              >
                <option value="">All Levels</option>
                <option value="L3">Entry (L3)</option>
                <option value="L4">Mid-Level (L4)</option>
                <option value="L5">Senior (L5)</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={18} />
            </div>
            
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-semibold text-sm border transition-all shadow-sm ${
                isFilterOpen 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Filter size={18} />
              Advanced Filters
            </button>
          </div>
        </div>

        {isFilterOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="card p-5 grid grid-cols-1 md:grid-cols-4 gap-5 overflow-hidden"
          >
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-medium">Sort Order</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilters({ ...filters, sortBy: "totalCompensation", sortOrder: "desc" })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex-1 transition-all border ${
                    filters.sortBy === "totalCompensation" && filters.sortOrder === "desc" 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  High → Low
                </button>
                <button 
                  onClick={() => setFilters({ ...filters, sortBy: "totalCompensation", sortOrder: "asc" })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex-1 transition-all border ${
                    filters.sortBy === "totalCompensation" && filters.sortOrder === "asc" 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Low → High
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-medium">Role</label>
              <input
                type="text"
                value={filters.role}
                placeholder="Software Engineer..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400"
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-medium">Location</label>
              <input
                type="text"
                value={filters.location}
                placeholder="Mountain View, CA..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400"
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>

            <div className="flex items-end gap-3">
               <button 
                 onClick={() => setFilters({ ...filters, company: "", role: "", level: "", location: "" })}
                 className="text-xs font-medium text-primary hover:text-primary-dark transition-colors px-3 py-2 rounded-lg hover:bg-primary/5"
               >
                 Clear Filters
               </button>
               <button 
                 onClick={() => setFilters({ company: "", role: "", level: "", location: "", sortBy: "totalCompensation", sortOrder: "desc" })}
                 className="text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors"
               >
                 Reset All
               </button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="spinner" />
          </div>
        ) : (
          <SalaryTable salaries={salaries} />
        )}
      </section>
    </main>
  );
}
