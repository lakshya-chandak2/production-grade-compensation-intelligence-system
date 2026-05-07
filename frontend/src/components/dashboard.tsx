"use client";

import { motion } from "framer-motion";
import { TrendingUp, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scale } from "lucide-react";

export const StatCard = ({ title, value, icon: Icon, trend }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="card p-6 flex flex-col gap-4 relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={64} />
    </div>
    <div className="p-3 rounded-2xl bg-primary/5 text-primary w-fit border border-primary/10">
      <Icon size={24} />
    </div>
    <div className="min-w-0 space-y-1">
      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-extrabold text-slate-900 truncate">{value}</h3>
        {trend && (
          <span className="text-xs text-emerald-600 flex items-center gap-1 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

export const SalaryTable = ({ salaries }: { salaries: any[] }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]
    );
  };

  const handleCompare = () => {
    if (selected.length === 2) {
      router.push(`/compare?id1=${selected[0]}&id2=${selected[1]}`);
    }
  };

  // Ensure only L3, L4, L5 are shown
  const filteredSalaries = salaries.filter(s => ["L3", "L4", "L5"].includes(s.level));

  if (filteredSalaries.length === 0) {
    return (
      <div className="card p-16 mt-4 text-center">
        <Search size={40} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700">No results found</h3>
        <p className="text-slate-400 text-sm mt-1.5">Try adjusting your filters or add new salary data.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white px-6 py-4 rounded-2xl shadow-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4 w-[90%] sm:w-auto"
        >
          <div className="text-slate-700 text-sm font-medium">
            <span className="text-primary font-semibold">{selected.length}/2</span> selected
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              disabled={selected.length < 2}
              onClick={handleCompare}
              className="flex-1 sm:flex-none px-5 py-2 bg-primary disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 hover:bg-primary-dark active:scale-[0.98]"
            >
              <Scale size={15} /> Compare
            </button>
            <button
              onClick={() => setSelected([])}
              className="text-slate-400 hover:text-slate-700 transition-colors text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </motion.div>
      )}

      <div className="card overflow-hidden border-slate-200/60 shadow-sm mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px] md:min-w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 w-12"></th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Company</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Level</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Experience</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Confidence</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Total Comp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {filteredSalaries.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => toggleSelect(s.id)}
                  className={`hover:bg-slate-50 transition-colors group cursor-pointer ${selected.includes(s.id) ? 'bg-primary/[0.03]' : ''}`}
                >
                  <td className="px-6 py-5">
                    <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                      selected.includes(s.id)
                        ? 'bg-primary border-primary shadow-sm shadow-primary/30'
                        : 'border-slate-200 group-hover:border-slate-300 bg-white'
                    }`}>
                      {selected.includes(s.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                        {s.company[0].toUpperCase()}
                      </div>
                      <Link
                        href={`/company/${s.company}`}
                        className="text-slate-900 hover:text-primary transition-colors font-bold text-sm tracking-tight"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {s.company}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-600 text-sm font-medium">{s.role}</td>
                  <td className="px-6 py-5">
                    <span className={`badge ${
                      s.level === 'L5' ? 'badge-accent' : s.level === 'L4' ? 'badge-primary' : 'badge-success'
                    }`}>
                      {s.level}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-500 text-sm font-medium">
                    {s.experienceYears} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">yrs</span>
                  </td>
                  <td className="px-6 py-5 text-slate-500 text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-400" /> {s.location}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3].map((bar) => (
                        <div
                          key={bar}
                          className={`w-2 h-5 rounded-full transition-all duration-500 ${
                            s.confidenceScore >= bar * 30
                              ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                              : 'bg-slate-100'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-black text-slate-900 text-lg tracking-tight">
                    ${(s.totalCompensation / 1000).toFixed(0)}<span className="text-sm font-bold text-slate-400 ml-0.5">K</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
