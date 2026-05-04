"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, MapPin, Building2, Search } from "lucide-react";

export const StatCard = ({ title, value, icon: Icon, trend }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass p-6 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer"
  >
    <div className="p-3 rounded-xl bg-primary/10 text-primary">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-slate-400 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      {trend && (
        <span className="text-xs text-success flex items-center gap-1 mt-1">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
  </motion.div>
);

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scale } from "lucide-react";

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
      <div className="glass rounded-3xl p-16 mt-8 border-primary/10 text-center">
        <Search size={48} className="mx-auto text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-slate-400">No results found</h3>
        <p className="text-slate-600 text-sm mt-2 font-mono">Try adjusting your filters or add new salary data.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {selected.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          className="fixed bottom-6 md:bottom-12 left-1/2 z-50 glass px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-4 md:gap-8 border-primary glow-blue w-[90%] md:w-auto"
        >
          <div className="text-white font-mono text-xs md:text-sm tracking-tighter">
            <span className="text-primary font-black">[{selected.length}/2]</span> Items Selected
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              disabled={selected.length < 2}
              onClick={handleCompare}
              className="flex-1 md:flex-none px-6 md:px-8 py-2 bg-primary disabled:bg-slate-800 disabled:text-slate-600 text-black rounded-full font-black text-[10px] md:text-xs tracking-widest transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <Scale size={14} className="md:w-4 md:h-4" /> Compare
            </button>

            <button onClick={() => setSelected([])} className="text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="glass rounded-3xl overflow-hidden mt-8 border-primary/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono min-w-[800px] md:min-w-full">

          <thead>
            <tr className="bg-primary/5 text-primary/40 text-[10px] font-black uppercase tracking-[0.3em]">
              <th className="px-6 py-5 w-12"></th>
              <th className="px-6 py-5">Company</th>
              <th className="px-6 py-5">Role</th>
              <th className="px-6 py-5">Level</th>
              <th className="px-6 py-5">Exp</th>
              <th className="px-6 py-5">Location</th>
              <th className="px-6 py-5">Confidence</th>
              <th className="px-6 py-5 text-right">Total Comp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {filteredSalaries.map((s, i) => (
              <motion.tr
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => toggleSelect(s.id)}
                className={`hover:bg-primary/5 transition-colors group cursor-pointer ${selected.includes(s.id) ? 'bg-primary/10' : ''}`}
              >
                <td className="px-6 py-5">
                  <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${selected.includes(s.id) ? 'bg-primary border-primary shadow-[0_0_10px_rgba(0,242,255,0.5)]' : 'border-slate-800 group-hover:border-primary/50'}`}>
                    {selected.includes(s.id) && <div className="w-1.5 h-1.5 bg-black rounded-sm" />}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-xs font-black text-primary">
                      {s.company[0].toUpperCase()}
                    </div>
                    <Link href={`/company/${s.company}`} className="text-white hover:text-primary transition-colors font-black uppercase tracking-tight" onClick={(e) => e.stopPropagation()}>
                      {s.company}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-400 text-xs font-bold uppercase">{s.role}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded text-[10px] font-black tracking-widest border ${s.level === 'L5' ? 'bg-accent/10 text-accent border-accent/30' : 'bg-primary/10 text-primary border-primary/30'}`}>
                    {s.level}
                  </span>
                </td>
                <td className="px-6 py-5 text-slate-400 text-[10px] font-bold uppercase">
                  {s.experienceYears} Yrs
                </td>
                <td className="px-6 py-5 text-slate-500 text-[10px] flex items-center gap-2 uppercase font-bold">
                  <MapPin size={12} className="text-primary/40" /> {s.location}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3].map((bar) => (
                      <div key={bar} className={`w-1 h-3 rounded-full ${s.confidenceScore >= bar * 30 ? 'bg-success shadow-[0_0_5px_rgba(0,255,65,0.5)]' : 'bg-slate-800'}`} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-5 text-right font-black text-primary group-hover:scale-105 transition-transform origin-right italic text-lg">
                  ${(s.totalCompensation / 1000).toFixed(0)}K
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
